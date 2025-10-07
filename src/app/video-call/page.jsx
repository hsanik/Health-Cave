'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { FaWifi, FaSignal, FaExclamationTriangle, FaUsers, FaClock } from 'react-icons/fa';

// Dynamically import the VideoCallContainer with no SSR
const VideoCallContainer = dynamic(
  () => import('@/components/video-call/VideoCallContainer'),
  { ssr: false }
);

export default function VideoCallPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [userId, setUserId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [recipientName, setRecipientName] = useState('Unknown User');
  const [isLoading, setIsLoading] = useState(true);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState('00:00:00');
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, good, fair, poor
  const [participantCount, setParticipantCount] = useState(1);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - callStartTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCallDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);

  // Simulate connection status changes
  useEffect(() => {
    if (callStartTime) {
      const statuses = ['good', 'fair', 'poor'];
      const interval = setInterval(() => {
        setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }, 10000); // Change every 10 seconds for demo
      return () => clearInterval(interval);
    }
  }, [callStartTime]);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(parseInt(session.user.id, 10) || Math.floor(Math.random() * 100000));

      // Get recipient ID from URL params
      const recipient = searchParams.get('recipient');
      if (recipient) {
        // Create a unique channel name based on the two user IDs
        // Sort them to ensure the same channel regardless of who initiates
        const ids = [session.user.id, recipient].sort();
        setChannelName(`video_${ids[0]}_${ids[1]}`);
        // Try to get recipient name from URL or set a friendly name
        setRecipientName(`User ${recipient}`);
      } else {
        // Fallback to a test channel
        setChannelName('test_video_channel');
        setRecipientName('Test User');
      }

      setIsLoading(false);
    }
  }, [session, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function to get connection status color and icon
  const getConnectionStatusInfo = (status) => {
    switch (status) {
      case 'good':
        return { color: 'text-green-400', bgColor: 'bg-green-500', icon: FaWifi, label: 'Good' };
      case 'fair':
        return { color: 'text-yellow-400', bgColor: 'bg-yellow-500', icon: FaSignal, label: 'Fair' };
      case 'poor':
        return { color: 'text-red-400', bgColor: 'bg-red-500', icon: FaExclamationTriangle, label: 'Poor' };
      default:
        return { color: 'text-gray-400', bgColor: 'bg-gray-500', icon: FaSignal, label: 'Connecting' };
    }
  };

  const statusInfo = getConnectionStatusInfo(connectionStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[80vh]">
          {/* Enhanced Header with Call Status */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Call with {recipientName}</h1>
                <p className="text-sm opacity-90">Video Consultation</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                {/* Participant Count */}
                <div className="flex items-center space-x-1">
                  <FaUsers className="h-4 w-4" />
                  <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
                </div>

                {/* Call Duration */}
                <div className="flex items-center space-x-1">
                  <FaClock className="h-4 w-4" />
                  <span>{callDuration}</span>
                </div>

                {/* Connection Status */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusInfo.bgColor} bg-opacity-20`}>
                  <StatusIcon className={`h-3 w-3 ${statusInfo.color}`} />
                  <span className="text-xs font-medium">{statusInfo.label}</span>
                </div>
              </div>
            </div>
          </div>

          {userId && channelName ? (
            <VideoCallContainer
              userId={userId}
              channelName={channelName}
              onCallStart={() => setCallStartTime(Date.now())}
              onParticipantCountChange={setParticipantCount}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Missing required parameters for video call</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}