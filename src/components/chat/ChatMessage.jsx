'use client';

import { cn } from "@/lib/utils";

/**
 * ChatMessage component for displaying individual chat messages
 * @param {Object} props - Component props
 * @param {string} props.content - Message content
 * @param {string} props.sender - Message sender ID
 * @param {string} props.currentUserId - Current user ID
 * @param {string} props.timestamp - Message timestamp
 * @param {string} props.senderName - Sender's display name
 */
const ChatMessage = ({ content, sender, currentUserId, timestamp, senderName }) => {
  const isCurrentUser = sender === currentUserId;
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
        isCurrentUser 
          ? "bg-blue-500 text-white rounded-br-none" 
          : "bg-gray-100 text-gray-800 rounded-bl-none"
      )}>
        {!isCurrentUser && (
          <div className="text-xs font-semibold mb-1 text-gray-600">
            {senderName || sender}
          </div>
        )}
        <p className="text-sm">{content}</p>
        <div className={cn(
          "text-xs mt-1",
          isCurrentUser ? "text-blue-100" : "text-gray-500"
        )}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;