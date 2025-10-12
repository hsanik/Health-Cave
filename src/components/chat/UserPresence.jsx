'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * UserPresence component for displaying user online status
 * @param {Object} props - Component props
 * @param {boolean} props.isOnline - Whether the user is online
 * @param {boolean} props.isTyping - Whether the user is typing
 * @param {string} props.userName - User's display name
 */
const UserPresence = ({ isOnline = false, isTyping = false, userName = 'User' }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-2.5 h-2.5 rounded-full",
        isOnline ? "bg-green-500" : "bg-gray-400"
      )}></div>
      <span className="text-sm">
        {isTyping ? `${userName} is typing...` : (isOnline ? 'Online' : 'Offline')}
      </span>
    </div>
  );
};

export default UserPresence;