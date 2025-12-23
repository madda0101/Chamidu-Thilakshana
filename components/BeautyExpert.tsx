
import React, { useState, useEffect } from 'react';

interface BeautyExpertProps {
  isSpeaking: boolean;
  isUserSpeaking: boolean;
}

const BeautyExpert: React.FC<BeautyExpertProps> = ({ isSpeaking, isUserSpeaking }) => {
  const [mouthLevel, setMouthLevel] = useState(0);
  const [blink, setBlink] = useState(false);
  const [sway, setSway] = useState(0);

  // Smooth lip-sync logic
  useEffect(() => {
    let interval: number;
    if (isSpeaking) {
      interval = window.setInterval(() => {
        setMouthLevel(Math.random() * 100);
      }, 50);
    } else {
      setMouthLevel(0);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Natural idle movement and blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 4000 + Math.random() * 3000);

    const swayInterval = setInterval(() => {
      setSway(prev => (prev + 1) % 360);
    }, 30);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(swayInterval);
    };
  }, []);

  const headSwayX = Math.sin(sway * 0.02) * 4;
  const headSwayY = Math.cos(sway * 0.03) * 6;
  const generalHairSway = Math.sin(sway * 0.01) * 8;

  return (
    <div className="relative w-full max-w-[400px] md:max-w-[600px] aspect-[3/4] flex items-center justify-center select-none overflow-visible">
      
      {/* Warm Golden Hour Glow */}
      <div className={`absolute inset-0 bg-orange-500/10 blur-[150px] rounded-full transition-all duration-1000 ${isSpeaking ? 'scale-150 opacity-60' : 'scale-100 opacity-20'}`} />

      {/* Main Character Body */}
      <div className="relative w-full h-full flex flex-col items-center justify-end overflow-visible">
        
        {/* LONG FLOWING HAIR (Back Layers) */}
        <div 
          className="absolute top-[5%] w-[100%] h-[90%] z-0"
          style={{ transform: `translateX(${generalHairSway}px)` }}
        >
           {/* Dark Rich Brown Hair base */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b10] via-[#4a2c1d] to-[#1a0f0a] rounded-t-[180px] rounded-b-[40px] shadow-2xl animate-[hairSwayMain_8s_ease-in-out_infinite]" />
           
           {/* Warm Highlights */}
           <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_#ffcc80_0%,_transparent_70%)]" />
           
           {/* Blowing Strands (Left) */}
           <div className="absolute -left-10 top-40 w-24 h-[60%] bg-[#2d1b10] rounded-full blur-[2px] opacity-80 animate-[hairWaveLeft_6s_ease-in-out_infinite] origin-top-right" />
           
           {/* Blowing Strands (Right) */}
           <div className="absolute -right-12 top-32 w-28 h-[75%] bg-[#4a2c1d] rounded-full blur-[2px] opacity-90 animate-[hairWaveRight_7s_ease-in-out_infinite] origin-top-left" />
        </div>

        {/* CLOTHING - Teal Patterned Dress */}
        <div className="absolute bottom-0 w-[95%] h-[35%] z-10 flex justify-center">
           <div className="w-full h-full bg-[#009688] rounded-t-[140px] shadow-2xl border-t-2 border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]" />
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-pink-500/40 via-purple-500/30 to-transparent skew-x-[-10deg]" />
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-bl from-orange-400/20 via-yellow-200/20 to-transparent skew-x-[10deg]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-[#f7d7c4] rounded-b-full shadow-inner border-b-2 border-orange-200/30" />
           </div>
        </div>

        {/* ARMS / HANDS */}
        <div className="absolute bottom-[5%] w-full flex justify-between px-4 z-20 opacity-90">
           <div className="w-24 h-48 bg-[#f7d7c4] rounded-t-full rotate-[-10deg] shadow-lg border-r-2 border-orange-200/20" />
           <div className="w-28 h-56 bg-[#009688] rounded-t-[60px] rotate-[8deg] shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/40 to-yellow-400/30 opacity-60" />
              <div className="absolute inset-0 border-2 border-white/10" />
           </div>
        </div>

        {/* THE FACE */}
        <div 
          className="relative w-72 h-96 md:w-85 md:h-[450px] z-30 transition-transform duration-[2000ms] ease-in-out"
          style={{ transform: `translate(${headSwayX}px, ${headSwayY}px)` }}
        >
          {/* Front Hair Strands (Bangs) */}
          <div className="absolute top-[-5%] left-[-2%] w-[105%] h-40 z-50 overflow-visible">
             <div className="absolute left-0 top-0 w-2/3 h-full bg-gradient-to-br from-[#2d1b10] to-transparent rounded-tl-[160px] animate-[bangSwayLeft_5s_ease-in-out_infinite] origin-top-left" />
             <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-[#4a2c1d] to-transparent rounded-tr-[160px] animate-[bangSwayRight_6s_ease-in-out_infinite] origin-top-right" />
          </div>

          {/* Face Plate (Warm Skin Tone) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9dfd1] via-[#f7d7c4] to-[#f4c6b1] rounded-[150px] shadow-[inset_0_0_50px_rgba(255,100,50,0.1),0_30px_70px_rgba(0,0,0,0.25)] border-t-2 border-white/50 overflow-hidden flex flex-col items-center">
            
            {/* EYES */}
            <div className="mt-20 w-full flex justify-around px-8 relative">
              {[0, 1].map((i) => (
                <div key={i} className="relative w-20 h-14 flex items-center justify-center">
                  <div className="absolute -top-1 w-[95%] h-6 border-t-[4px] border-[#1a0d06] rounded-[50%] opacity-90" />
                  <div className={`absolute -top-1 ${i === 0 ? '-left-1' : '-right-1'} w-8 h-2 bg-[#1a0d06] ${i === 0 ? 'rotate-[-20deg]' : 'rotate-[20deg]'} rounded-full opacity-70`} />
                  
                  <div className="w-full h-[85%] bg-white rounded-full shadow-inner border border-orange-100 overflow-hidden flex items-center justify-center">
                    <div className={`w-10 h-10 bg-gradient-to-br from-[#78909c] via-[#546e7a] to-[#cfd8dc] rounded-full transition-all duration-300 ${blink ? 'scale-y-0' : 'scale-y-100'}`}>
                      <div className="w-5 h-5 bg-black rounded-full m-auto mt-2.5 relative shadow-lg">
                         <div className="w-2.5 h-2.5 bg-white/70 rounded-full absolute top-1 left-1" />
                         <div className="w-1 h-1 bg-white/40 rounded-full absolute bottom-1 right-1" />
                      </div>
                    </div>
                  </div>

                  <div className={`absolute inset-0 bg-[#f7d7c4] transition-all duration-150 origin-top shadow-inner z-10 ${blink ? 'scale-y-100' : 'scale-y-0'}`} />
                  <div className="absolute -top-4 w-full h-8 bg-orange-800/10 blur-lg rounded-full" />
                </div>
              ))}
            </div>

            {/* BLUSH */}
            <div className="absolute top-[50%] w-full flex justify-around px-10">
               <div className="w-16 h-10 bg-rose-500/15 blur-xl rounded-full" />
               <div className="w-16 h-10 bg-rose-500/15 blur-xl rounded-full" />
            </div>

            {/* NOSE */}
            <div className="mt-6 w-3 h-5 bg-gradient-to-b from-transparent to-orange-200/30 rounded-full" />

            {/* MOUTH */}
            <div className="mt-8 flex flex-col items-center">
              <div className="relative w-32 h-14 flex items-center justify-center">
                <div className={`absolute top-0 w-20 h-5 bg-gradient-to-r from-[#b71c1c] via-[#d32f2f] to-[#b71c1c] rounded-full transition-all duration-100 shadow-sm z-10 ${isSpeaking ? 'translate-y-[-5px] scale-x-110' : ''}`}>
                   <div className="w-full h-1/3 bg-white/30 rounded-full mt-1 blur-[1px]" />
                </div>
                
                <div 
                  className="bg-[#3e0a0a] rounded-full border border-rose-900/20 flex items-center justify-center overflow-hidden transition-all duration-100 shadow-inner"
                  style={{ 
                    height: isSpeaking ? `${6 + mouthLevel * 0.5}px` : '5px',
                    width: isSpeaking ? `${44 + mouthLevel * 0.2}px` : '36px'
                  }}
                >
                   <div className="w-full h-2 bg-rose-300/20 blur-[3px] animate-pulse" />
                </div>

                <div className={`absolute bottom-0 w-16 h-5 bg-gradient-to-r from-[#d32f2f] via-[#f44336] to-[#d32f2f] rounded-full transition-all duration-100 shadow-md z-10 ${isSpeaking ? 'translate-y-[5px]' : ''}`}>
                   <div className="w-full h-1/4 bg-white/20 rounded-full mt-2" />
                </div>
              </div>
            </div>

            {/* Golden Earrings */}
            <div className="absolute top-[50%] -left-2 w-10 h-10 border-4 border-yellow-500 rounded-full opacity-60 rotate-[20deg]" />
            <div className="absolute top-[50%] -right-2 w-10 h-10 border-4 border-yellow-500 rounded-full opacity-60 rotate-[-20deg]" />

            {/* Branding Watermark */}
            <div className="absolute bottom-10 flex flex-col items-center opacity-30">
               <div className="w-16 h-[1px] bg-orange-900/40" />
               <span className="mt-2 text-[8px] font-black text-orange-900 tracking-[0.4em] uppercase">SCT FERNANDO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[0.5px] animate-[float_6s_infinite]"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${i * 1.2}s`,
              opacity: 0.2
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.4; }
        }
        @keyframes hairSwayMain {
          0%, 100% { transform: scale(1) translateX(0); }
          50% { transform: scale(1.02) translateX(5px); }
        }
        @keyframes hairWaveLeft {
          0%, 100% { transform: rotate(-15deg) skewX(0deg); }
          50% { transform: rotate(-22deg) skewX(-5deg); }
        }
        @keyframes hairWaveRight {
          0%, 100% { transform: rotate(15deg) skewX(0deg); }
          50% { transform: rotate(25deg) skewX(8deg); }
        }
        @keyframes bangSwayLeft {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(-8deg) translateX(-3px); }
        }
        @keyframes bangSwayRight {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(15deg) translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default BeautyExpert;
