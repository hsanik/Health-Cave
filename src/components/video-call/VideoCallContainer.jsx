'use client';

import React, { useState, useEffect } from 'react';
import { AgoraRTCProvider, useJoin, usePublish, useRemoteUsers, RemoteUser, LocalUser, useLocalMicrophoneTrack, useLocalCameraTrack } from 'agora-rtc-react';
import { createClient } from 'agora-rtc-sdk-ng';
import VideoCallControls from './VideoCallControls';
import agoraRtcConfig from '@/lib/agoraRtcConfig';

/**
 * VideoCallContent - Inner component for video call functionality
 */
const VideoCallContent = ({ channelName, userId, client, onCallStart, onParticipantCountChange }) => {
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStep, setConnectionStep] = useState(1);
  const remoteUsers = useRemoteUsers();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(audio);
  const { localCameraTrack } = useLocalCameraTrack(video);

  // Request permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        setConnectionStep(1);
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream

        setConnectionStep(2);
        setPermissionsGranted(true);
        setPermissionError(null);
      } catch (error) {
        console.error('Permission denied:', error);
        setPermissionError(error.name);
        setPermissionsGranted(false);
      }
    };

    requestPermissions();
  }, []);

  // Join the channel when permissions are granted
  useJoin({
    channel: channelName,
    uid: userId,
    token: null, // Use token if you have enabled token authentication
    appid: agoraRtcConfig.appId,
  });

  // Publish local audio and video tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Update participant count when remote users change
  useEffect(() => {
    const totalParticipants = remoteUsers.length + 1; // +1 for local user
    onParticipantCountChange?.(totalParticipants);
  }, [remoteUsers.length, onParticipantCountChange]);

  // Call started when we have tracks and are connected
  useEffect(() => {
    if (localMicrophoneTrack && localCameraTrack && permissionsGranted) {
      setConnectionStep(3);
      setIsConnecting(false);
      onCallStart?.();
    }
  }, [localMicrophoneTrack, localCameraTrack, permissionsGranted, onCallStart]);

  const toggleAudio = () => setAudio(prev => !prev);
  const toggleVideo = () => setVideo(prev => !prev);

  const endCall = () => {
    // Navigate back or close the call
    window.history.back();
  };

  // Show permission request UI if permissions not granted
  if (!permissionsGranted) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          {permissionError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Camera & Microphone Access Required
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {permissionError === 'NotAllowedError'
                  ? 'Please allow camera and microphone access in your browser settings to join the video call.'
                  : 'Unable to access camera and microphone. Please check your device settings.'
                }
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="text-blue-500 mb-4">
                <svg className="w-12 h-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Requesting Permissions
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Please allow access to your camera and microphone to join the video call.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show connection progress
  if (isConnecting) {
    const steps = [
      'Requesting permissions...',
      'Initializing camera & microphone...',
      'Connecting to video call...'
    ];

    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Connecting to Call
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {steps[connectionStep - 1]}
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step <= connectionStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {connectionStep} of 3
          </p>
        </div>
      </div>
    );
  }
  
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
const VideoCallContainer = ({ channelName, userId, onCallStart, onParticipantCountChange }) => {
  const rtcClient = createClient({ mode: 'rtc', codec: 'vp8' });

  return (
    <div className="h-full">
      <AgoraRTCProvider client={rtcClient}>
        <VideoCallContent
          channelName={channelName}
          userId={userId}
          client={rtcClient}
          onCallStart={onCallStart}
          onParticipantCountChange={onParticipantCountChange}
        />
      </AgoraRTCProvider>
    </div>
  );
};

export default VideoCallContainer;