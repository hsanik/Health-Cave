'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IoSend } from 'react-icons/io5';

/**
 * ChatInput component for sending messages
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Function to handle sending messages
 */
const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t p-3 bg-white">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 min-h-[60px] max-h-[120px] resize-none"
      />
      <Button 
        type="submit" 
        disabled={!message.trim()}
        className="h-[60px] w-[60px] rounded-full p-0 flex items-center justify-center"
      >
        <IoSend className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;