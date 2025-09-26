'use client';
import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './config.js';
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen && (
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="chatbot-toggle-button"
      >
        {isOpen ? 'X' : '💬'}
      </button>
    </div>
  );
};

export default ChatbotComponent;
