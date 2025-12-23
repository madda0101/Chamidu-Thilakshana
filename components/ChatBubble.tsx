
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base transition-all ${
        isUser 
          ? 'bg-pink-600 text-white rounded-br-none' 
          : 'bg-white text-pink-900 border border-pink-100 rounded-bl-none'
      }`}>
        <p className="sinhala-font leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={`text-[10px] mt-1 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
