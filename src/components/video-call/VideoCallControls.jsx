'use client';

import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

/**
 * VideoCallControls component for controlling video call settings
 * @param {Object} props - Component props
 * @param {boolean} props.audio - Current audio state
 * @param {boolean} props.video - Current video state
 * @param {Function} props.toggleAudio - Function to toggle audio
 * @param {Function} props.toggleVideo - Function to toggle video
 * @param {Function} props.endCall - Function to end the call
 */
const VideoCallControls = ({ audio, video, toggleAudio, toggleVideo, endCall }) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={toggleAudio}
        className={`p-3 rounded-full ${
          audio ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        }`}
        aria-label={audio ? 'Mute microphone' : 'Unmute microphone'}
      >
        {audio ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
      </button>
      
      <button
        onClick={toggleVideo}
        className={`p-3 rounded-full ${
          video ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        }`}
        aria-label={video ? 'Turn off camera' : 'Turn on camera'}
      >
        {video ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
      </button>
      
      <button
        onClick={endCall}
        className="p-3 rounded-full bg-red-600 text-white"
        aria-label="End call"
      >
        <FaPhoneSlash size={20} />
      </button>
    </div>
  );
};

export default VideoCallControls;