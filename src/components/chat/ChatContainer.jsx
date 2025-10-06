'use client';

import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getAgoraRTMClient, loginToAgoraRTM, joinChannel, sendChannelMessage, logoutFromAgoraRTM } from '@/lib/agoraClient';

/**
 * ChatContainer component for managing the chat interface
 * @param {Object} props - Component props
 * @param {string} props.userId - Current user ID
 * @param {string} props.recipientId - Recipient user ID
 * @param {string} props.channelName - Channel name for the chat
 * @param {string} props.userName - Current user's display name
 * @param {string} props.recipientName - Recipient's display name
 */
const ChatContainer = ({ userId, recipientId, channelName, userName, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Agora RTM client and join channel
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Initialize and login to Agora RTM
        const rtmClient = await loginToAgoraRTM(userId);
        setClient(rtmClient);
        
        // Join the channel
        const chatChannel = await joinChannel(rtmClient, channelName);
        setChannel(chatChannel);
        setIsConnected(true);
        
        // Set up message listener
        chatChannel.on('ChannelMessage', (message, senderId) => {
          if (message.text) {
            const newMessage = {
              content: message.text,
              sender: senderId,
              timestamp: new Date().toISOString(),
              id: `${senderId}-${Date.now()}`
            };
            setMessages(prev => [...prev, newMessage]);
          }
        });
        
        // Add welcome message
        setMessages([
          {
            content: `Connected to chat with ${recipientName}`,
            sender: 'system',
            timestamp: new Date().toISOString(),
            id: `system-${Date.now()}`
          }
        ]);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to connect to chat. Please try again later.');
      }
    };

    if (userId && channelName) {
      initializeChat();
    }

    // Cleanup function
    return () => {
      if (client) {
        logoutFromAgoraRTM(client);
      }
    };
  }, [userId, channelName, recipientName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (content) => {
    if (!channel || !isConnected) return;
    
    try {
      // Add message to local state first for immediate feedback
      const newMessage = {
        content,
        sender: userId,
        timestamp: new Date().toISOString(),
        id: `${userId}-${Date.now()}`
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Send message through Agora RTM
      await sendChannelMessage(channel, content);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{recipientName}</h2>
          <p className="text-sm text-blue-100">
            {isConnected ? 'Connected' : 'Connecting...'}
          </p>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {messages.map((msg) => (
          msg.sender === 'system' ? (
            <div key={msg.id} className="text-center text-gray-500 text-sm my-4">
              {msg.content}
            </div>
          ) : (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              sender={msg.sender}
              currentUserId={userId}
              timestamp={msg.timestamp}
              senderName={msg.sender === userId ? userName : recipientName}
            />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;