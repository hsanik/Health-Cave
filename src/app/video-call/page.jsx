'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

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
  const [isLoading, setIsLoading] = useState(true);

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
      } else {
        // Fallback to a test channel
        setChannelName('test_video_channel');
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[80vh]">
          <div className="p-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Video Call</h1>
            <p className="text-sm">Channel: {channelName}</p>
          </div>
          
          {userId && channelName ? (
            <VideoCallContainer 
              userId={userId} 
              channelName={channelName} 
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