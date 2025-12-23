
import React from 'react';

interface AvatarProps {
  isSpeaking: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-6">
      <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-pink-300 overflow-hidden shadow-2xl transition-transform duration-500 ${isSpeaking ? 'scale-105 shadow-pink-400/50' : 'scale-100'}`}>
        <img 
          src="https://picsum.photos/seed/beauty-expert/600/600" 
          alt="Ms. Beauty AI" 
          className="w-full h-full object-cover"
        />
        {isSpeaking && (
          <div className="absolute inset-0 bg-pink-400/10 animate-pulse flex items-center justify-center">
             <div className="flex space-x-1">
                <span className="w-1.5 h-6 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-8 bg-pink-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-6 bg-pink-500 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-pink-700 font-serif">Ms. Beauty</h2>
        <p className="text-pink-500 text-sm italic">ඔබේ රූපලාවන්‍ය මිතුරිය</p>
      </div>
      
      {/* Decorative floating items */}
      <div className="absolute -top-4 -right-4 text-4xl animate-bounce">✨</div>
      <div className="absolute bottom-10 -left-6 text-3xl animate-pulse">💄</div>
    </div>
  );
};

export default Avatar;
