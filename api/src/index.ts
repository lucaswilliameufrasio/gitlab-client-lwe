import env from './config/env'
import Fastify from 'fastify'
import axios from 'axios'

const fastify = Fastify({ logger: true })

fastify.post('/oauth/token', async (request, reply) => {
  console.log('request.body', request.body)
  const { code, redirectUri, codeVerifier } = request.body as any

  try {
    const result = await axios.post(
      env.gitlabTokenEndpoint,
      {},
      {
        params: {
          client_id: env.gitlabClientId,
          client_secret: env.gitlabClientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        },
      },
    )
    console.log('data', result.data)
    const accessToken = result.data.access_token
    return { accessToken }
  } catch (error) {
    fastify.log.error(error.response)
    return {
      error: 'Could not retrieve your access token. Verify the data sent.',
    }
  }
})

const start = async () => {
  try {
    await fastify.listen(env.port, env.host)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
