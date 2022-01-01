import * as React from 'react'
import { Button, Platform, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import env from './config/env'
import axios from 'axios'

WebBrowser.maybeCompleteAuthSession()

const useProxy = true
const redirectUri = AuthSession.makeRedirectUri({
  useProxy,
  path: 'oauth2redirect',
})

const clientId = env.gitlabClientId
const scopes = ['api', 'read_user', 'read_api', 'read_repository']
const authorizationEndpoint = 'https://gitlab.com/oauth/authorize'
const tokenEndpoint = `${env.apiEndpoint}/oauth/token`

export default function App() {
  const [token, setToken] = React.useState('')
  const [error, setError] = React.useState('')

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes,
    },
    {
      authorizationEndpoint,
    },
  )

  async function getAccessToken() {
    if (result?.type === 'success' && request?.codeVerifier) {
      const code = result.params.code

      const data: Record<string, string> = {
        code: code,
        redirectUri: redirectUri,
        codeVerifier: request.codeVerifier,
      }

      console.log('data', data)

      try {
        const response = await axios.post(
          tokenEndpoint,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            }
          },
        )

        console.log('response', response.data)
        setToken(response.data.accessToken)
      } catch (error: any) {
        console.error(error)
        console.log('error?.response?._url', error?.request?._url)
        console.log(error?.response?.data)
        setError(
          JSON.stringify(
            {
              url: error?.request?._url,
              data: error?.response?.data,
            },
            null,
            2,
          ),
        )
      }
    }
  }

  React.useEffect(() => {
    if (result) {
      getAccessToken()
    }
  }, [result])

  return (
    <ScrollView style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Button
            title='Login!'
            disabled={!request}
            onPress={() => promptAsync({ useProxy })}
          />
          {result ? <Text>{JSON.stringify(result, null, 2)}</Text> : null}
          {token ? <Text>{token}</Text> : null}
          {error ? <Text>{error}</Text> : null}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
