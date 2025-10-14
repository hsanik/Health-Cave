'use client';

/**
 * Chat storage utility for persisting chat messages
 * Uses localStorage for client-side persistence
 */

const STORAGE_KEY_PREFIX = 'health_cave_chat_';

/**
 * Save a message to chat history
 * @param {string} channelId - Channel ID for the chat
 * @param {Object} message - Message object to save
 */
export const saveMessage = (channelId, message) => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${channelId}`;
    const existingMessages = getMessages(channelId);
    const updatedMessages = [...existingMessages, message];
    
    // Limit history to last 100 messages to prevent storage issues
    const limitedMessages = updatedMessages.slice(-100);
    localStorage.setItem(storageKey, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Failed to save message to storage:', error);
  }
};

/**
 * Get all messages for a specific channel
 * @param {string} channelId - Channel ID for the chat
 * @returns {Array} Array of message objects
 */
export const getMessages = (channelId) => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${channelId}`;
    const messagesJson = localStorage.getItem(storageKey);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (error) {
    console.error('Failed to retrieve messages from storage:', error);
    return [];
  }
};

/**
 * Clear all messages for a specific channel
 * @param {string} channelId - Channel ID for the chat
 */
export const clearMessages = (channelId) => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${channelId}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Failed to clear messages from storage:', error);
  }
};

/**
 * Get all chat channels for the current user
 * @returns {Array} Array of channel IDs
 */
export const getChannels = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const channels = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        channels.push(key.replace(STORAGE_KEY_PREFIX, ''));
      }
    }
    return channels;
  } catch (error) {
    console.error('Failed to retrieve channels from storage:', error);
    return [];
  }
};