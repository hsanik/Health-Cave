// Agora configuration settings
const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || 'YOUR_AGORA_APP_ID',
  // Default channel for testing purposes
  defaultChannel: 'health-cave-channel',
  // Token server URL (if you're using token authentication)
  tokenServerUrl: process.env.NEXT_PUBLIC_AGORA_TOKEN_SERVER_URL,
};

export default agoraConfig;