'use client';

import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getAgoraRTMClient, loginToAgoraRTM, joinChannel, sendChannelMessage, logoutFromAgoraRTM } from '@/lib/agoraClient';
import { saveMessage, getMessages } from '@/lib/chatStorage';
import ChatNotification from './ChatNotification';
import { useRouter } from 'next/navigation';

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
  const [lastNotification, setLastNotification] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Initialize Agora RTM client and join channel
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Load chat history from storage
        const chatHistory = getMessages(channelName);
        
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
            
            // Save message to storage
            saveMessage(channelName, newMessage);
            
            setMessages(prev => [...prev, newMessage]);
          }
        });
        
        // Set initial messages from history or add welcome message if empty
        if (chatHistory.length > 0) {
          setMessages(chatHistory);
        } else {
          const welcomeMessage = {
            content: `Connected to chat with ${recipientName}`,
            sender: 'system',
            timestamp: new Date().toISOString(),
            id: `system-${Date.now()}`
          };
          setMessages([welcomeMessage]);
          saveMessage(channelName, welcomeMessage);
        }
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
      
      // Save message to storage
      saveMessage(channelName, newMessage);
      
      setMessages(prev => [...prev, newMessage]);
      
      // Send message through Agora RTM
      await sendChannelMessage(channel, content);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Track user typing status
  const [isTyping, setIsTyping] = useState(false);
  const [recipientIsTyping, setRecipientIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator and message notifications
  useEffect(() => {
    if (!channel) return;

    // Set up typing indicator listener and message handler
    channel.on('ChannelMessage', (message, senderId) => {
      if (senderId !== userId && message.text === '__TYPING__') {
        setRecipientIsTyping(true);
        
        // Clear previous timeout if exists
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to clear typing indicator after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          setRecipientIsTyping(false);
        }, 3000);
      } else if (senderId !== userId && message.text !== '__TYPING__') {
        // Set last notification for the new message if it's from another user
        setLastNotification({
          content: message.text,
          sender: senderId,
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [channel, userId]);

  // Send typing indicator
  const handleTyping = async () => {
    if (!channel || !isConnected || isTyping) return;
    
    try {
      setIsTyping(true);
      await sendChannelMessage(channel, '__TYPING__');
      
      // Reset typing flag after 3 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to send typing indicator:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{recipientName}</h2>
          <div className="text-sm text-blue-100">
            {isConnected ? (
              recipientIsTyping ? 
                `${recipientName} is typing...` : 
                'Online'
            ) : 'Connecting...'}
          </div>
        </div>
        <button
          onClick={() => router.push(`/video-call?recipient=${recipientId}`)}
          className="bg-white hover:bg-gray-100 text-blue-600 px-3 py-1 rounded-md flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Video Call
        </button>
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
      
      {/* Notification component */}
      <ChatNotification 
        message={lastNotification}
        currentUserId={userId}
        onNotificationClick={() => router.push(`/chat?recipient=${recipientId}`)}
      />
      
      {/* Chat input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ChatContainer;