'use client';

import React, { useState, useEffect } from 'react';
import { AgoraRTCProvider, useJoin, usePublish, useRemoteUsers, RemoteUser, LocalUser, useLocalMicrophoneTrack, useLocalCameraTrack } from 'agora-rtc-react';
import { createClient } from 'agora-rtc-sdk-ng';
import VideoCallControls from './VideoCallControls';
import agoraRtcConfig from '@/lib/agoraRtcConfig';

/**
 * VideoCallContent - Inner component for video call functionality
 */
const VideoCallContent = ({ channelName, userId, client }) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const remoteUsers = useRemoteUsers();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(audio);
  const { localCameraTrack } = useLocalCameraTrack(video);
  
  // Join the channel
  useJoin({
    channel: channelName,
    uid: userId,
    token: null, // Use token if you have enabled token authentication
    appid: agoraRtcConfig.appId,
  });
  
  // Publish local audio and video tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);
  
  const toggleAudio = () => setAudio(prev => !prev);
  const toggleVideo = () => setVideo(prev => !prev);
  
  const endCall = () => {
    // Navigate back or close the call
    window.history.back();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Local user video */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <LocalUser
            cameraOn={video}
            micOn={audio}
            playAudio={false}
            className="w-full h-full object-cover"
          >
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              You
            </div>
          </LocalUser>
        </div>
        
        {/* Remote users */}
        {remoteUsers.length > 0 ? (
          remoteUsers.map(user => (
            <div key={user.uid} className="relative bg-gray-900 rounded-lg overflow-hidden">
              <RemoteUser
                user={user}
                playVideo={true}
                playAudio={true}
                className="w-full h-full object-cover"
              >
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  Remote User
                </div>
              </RemoteUser>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center bg-gray-800 rounded-lg">
            <p className="text-white">Waiting for others to join...</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4">
        <VideoCallControls
          audio={audio}
          video={video}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          endCall={endCall}
        />
      </div>
    </div>
  );
};

/**
 * VideoCallContainer - Main component that wraps the Agora RTC provider
 */
const VideoCallContainer = ({ channelName, userId }) => {
  const rtcClient = createClient({ mode: 'rtc', codec: 'vp8' });
  
  return (
    <div className="h-full">
      <AgoraRTCProvider client={rtcClient}>
        <VideoCallContent channelName={channelName} userId={userId} client={rtcClient} />
      </AgoraRTCProvider>
    </div>
  );
};

export default VideoCallContainer;