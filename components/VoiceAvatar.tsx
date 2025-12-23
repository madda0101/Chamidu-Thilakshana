
import React from 'react';

interface VoiceAvatarProps {
  isSpeaking: boolean;
  isUserSpeaking: boolean;
}

const VoiceAvatar: React.FC<VoiceAvatarProps> = ({ isSpeaking, isUserSpeaking }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 ${isSpeaking ? 'bg-pink-500/30 scale-125' : 'bg-pink-500/10 scale-100'}`} />
      
      {/* Dynamic Rings */}
      <div className={`absolute w-72 h-72 rounded-full border border-pink-400/30 transition-all duration-500 ${isSpeaking ? 'animate-ping opacity-100' : 'opacity-0'}`} />
      <div className={`absolute w-80 h-80 rounded-full border border-pink-300/20 transition-all duration-700 ${isUserSpeaking ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`} />

      {/* Main Avatar Circle */}
      <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full border-[6px] border-white/90 overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.3)] transition-all duration-700 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
        <img 
          src="https://picsum.photos/seed/msbeauty/1000/1000" 
          alt="Ms. Beauty" 
          className="w-full h-full object-cover transition-all duration-500 brightness-110 contrast-110"
        />
        
        {/* Status Overlay */}
        {!isSpeaking && !isUserSpeaking && (
          <div className="absolute inset-0 bg-pink-900/5 backdrop-blur-[2px] flex items-center justify-center">
             <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
             </div>
          </div>
        )}
      </div>

      {/* Call Identity */}
      <div className="mt-8 text-center z-10">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg font-serif tracking-wide">Ms. Beauty</h2>
        <div className="flex items-center justify-center space-x-2 mt-1">
           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
           <p className="text-pink-100 text-sm font-light tracking-widest uppercase">සජීවීව • Online</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAvatar;
