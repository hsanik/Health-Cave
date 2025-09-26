import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage(`Hello! How can I help you today?`)],
  botName: 'HealthCaveBot',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#4c69c6',
    },
    chatButton: {
      backgroundColor: '#43d5cb',
    },
  },
};

export default config;
