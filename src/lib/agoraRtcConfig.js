/**
 * Agora RTC configuration for video calls
 */
const agoraRtcConfig = {
  // Your Agora App ID (same as used for chat)
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "your-agora-app-id",
  
  // Video call settings
  videoConfig: {
    encoderConfig: {
      width: 640,
      height: 360,
      frameRate: 15,
      bitrate: 800,
    },
  },
  
  // Audio settings
  audioConfig: {
    AEC: true, // Acoustic Echo Cancellation
    ANS: true, // Automatic Noise Suppression
    AGC: true, // Automatic Gain Control
  },
};

export default agoraRtcConfig;