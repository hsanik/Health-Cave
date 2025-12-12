'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoMdChatbubbles } from 'react-icons/io';

/**
 * ChatNotification component for displaying notifications for new messages
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object that triggered the notification
 * @param {string} props.currentUserId - Current user ID
 * @param {Function} props.onNotificationClick - Function to handle notification click
 */
const ChatNotification = ({ message, currentUserId, onNotificationClick }) => {
  useEffect(() => {
    // Only show notifications for messages from other users
    if (message && message.sender !== currentUserId && message.sender !== 'system') {
      const notification = toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
            onClick={() => {
              toast.dismiss(t.id);
              if (onNotificationClick) onNotificationClick();
            }}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <IoMdChatbubbles className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {message.senderName || 'New message'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                View
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    }
  }, [message, currentUserId, onNotificationClick]);

  return null; // This component doesn't render anything directly
};

export default ChatNotification;