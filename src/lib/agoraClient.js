'use client';

import AgoraRTM from 'agora-rtm-sdk';
import agoraConfig from './agoraConfig';

// Singleton pattern for Agora RTM client
let rtmClient = null;

/**
 * Initialize and get the Agora RTM client
 * @returns {Promise<Object>} The RTM client instance
 */
export const getAgoraRTMClient = async () => {
  if (!rtmClient) {
    try {
      rtmClient = AgoraRTM.createInstance(agoraConfig.appId);
    } catch (error) {
      console.error('Failed to create RTM client:', error);
      throw error;
    }
  }
  return rtmClient;
};

/**
 * Login to Agora RTM service
 * @param {string} userId - User ID for RTM login
 * @returns {Promise<void>}
 */
export const loginToAgoraRTM = async (userId) => {
  try {
    const client = await getAgoraRTMClient();
    await client.login({ uid: userId.toString() });
    return client;
  } catch (error) {
    console.error('Failed to login to Agora RTM:', error);
    throw error;
  }
};

/**
 * Join a chat channel
 * @param {Object} client - RTM client instance
 * @param {string} channelName - Channel to join
 * @returns {Promise<Object>} The channel instance
 */
export const joinChannel = async (client, channelName) => {
  try {
    const channel = client.createChannel(channelName);
    await channel.join();
    return channel;
  } catch (error) {
    console.error('Failed to join channel:', error);
    throw error;
  }
};

/**
 * Send a message to a channel
 * @param {Object} channel - Channel instance
 * @param {string} message - Message to send
 * @returns {Promise<void>}
 */
export const sendChannelMessage = async (channel, message) => {
  try {
    await channel.sendMessage({ text: message });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

/**
 * Send a peer-to-peer message
 * @param {Object} client - RTM client instance
 * @param {string} peerId - Recipient's user ID
 * @param {string} message - Message to send
 * @returns {Promise<void>}
 */
export const sendPeerMessage = async (client, peerId, message) => {
  try {
    await client.sendMessageToPeer({ text: message }, peerId.toString());
  } catch (error) {
    console.error('Failed to send peer message:', error);
    throw error;
  }
};

/**
 * Logout from Agora RTM service
 * @param {Object} client - RTM client instance
 * @returns {Promise<void>}
 */
export const logoutFromAgoraRTM = async (client) => {
  try {
    await client.logout();
  } catch (error) {
    console.error('Failed to logout from Agora RTM:', error);
  }
};