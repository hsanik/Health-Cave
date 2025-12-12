'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Dynamically import ChatContainer to avoid SSR issues
const ChatContainer = dynamic(
  () => import('@/components/chat/ChatContainer'),
  { ssr: false }
);

function ChatContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const recipientId = searchParams.get('recipientId');
  const recipientName = searchParams.get('recipientName');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // If authenticated but no recipient selected
  if (status === 'authenticated' && !recipientId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Chat</h1>
          <p className="text-gray-600 mb-6">
            No chat selected. Please select a doctor or patient to start chatting.
          </p>
          <Button onClick={() => router.push('/doctors')}>
            Browse Doctors
          </Button>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto h-[80vh]">
        <ChatContainer 
          userId={session?.user?.id || 'anonymous'}
          recipientId={recipientId}
          channelName={`chat_${[session?.user?.id, recipientId].sort().join('_')}`}
          userName={session?.user?.name || 'User'}
          recipientName={recipientName || 'Recipient'}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}