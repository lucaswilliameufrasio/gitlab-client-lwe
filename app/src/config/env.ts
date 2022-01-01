import { API_ENDPOINT, GITLAB_CLIENT_ID } from 'react-native-dotenv'

export default {
  apiEndpoint: API_ENDPOINT || 'http://10.0.2.2:7777',
  gitlabClientId: GITLAB_CLIENT_ID,
}
