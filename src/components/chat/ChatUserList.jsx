'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoMdChatbubbles } from 'react-icons/io';

/**
 * ChatUserList component for displaying available users to chat with
 * @param {Object} props - Component props
 * @param {Array} props.users - List of users to display
 * @param {string} props.userType - Type of users (doctors/patients)
 */
const ChatUserList = ({ users = [], userType = 'doctors' }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [onlineUsers, setOnlineUsers] = useState({});

  // Start a chat with a user
  const startChat = (user) => {
    router.push(`/chat?recipientId=${user.id}&recipientName=${encodeURIComponent(user.name)}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Available {userType}</h2>
      
      {users.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          No {userType} available for chat at the moment.
        </Card>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${onlineUsers[user.id] ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.specialty || user.email || ''}</p>
              </div>
            </div>
            <Button 
              onClick={() => startChat(user)}
              className="flex items-center space-x-1"
            >
              <IoMdChatbubbles className="mr-1" />
              Chat
            </Button>
          </Card>
        ))
      )}
    </div>
  );
};

export default ChatUserList;