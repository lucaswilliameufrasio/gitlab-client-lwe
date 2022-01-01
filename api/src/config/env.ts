export default {
	nodeEnv: process.env.NODE_ENV || "development",
    host: process.env.HOST || '0.0.0.0',
	port: process.env.PORT || 7777,
	gitlabTokenEndpoint: process.env.GITLAB_TOKEN_ENDPOINT || "https://gitlab.com/oauth/token",
	gitlabClientId: process.env.GITLAB_CLIENT_ID,
	gitlabClientSecret: process.env.GITLAB_CLIENT_SECRET,
};
