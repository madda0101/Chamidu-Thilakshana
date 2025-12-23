
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, ShieldCheck, Heart, Sparkles, User } from 'lucide-react';
import { connectLive, decode, decodeAudioData, createBlob } from './services/liveService';
import BeautyExpert from './components/BeautyExpert';

const App: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcription, setTranscription] = useState<{ text: string, role: 'user' | 'model' } | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      // Ensure AudioContext is created/resumed on user gesture
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const source = inputCtx.createMediaStreamSource(stream);
      const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);

      const sessionPromise = connectLive({
        onAudioChunk: async (base64) => {
          setIsSpeaking(true);
          const ctx = audioContextRef.current!;
          
          // Make sure context is running
          if (ctx.state === 'suspended') await ctx.resume();

          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
          
          const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
          const audioSource = ctx.createBufferSource();
          audioSource.buffer = audioBuffer;
          audioSource.connect(ctx.destination);
          
          audioSource.onended = () => {
            sourcesRef.current.delete(audioSource);
            if (sourcesRef.current.size === 0) {
              setIsSpeaking(false);
            }
          };

          audioSource.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          sourcesRef.current.add(audioSource);
        },
        onInterrupted: () => {
          sourcesRef.current.forEach(s => {
            try { s.stop(); } catch(e) {}
          });
          sourcesRef.current.clear();
          nextStartTimeRef.current = 0;
          setIsSpeaking(false);
        },
        onTranscription: (text, role) => {
          setTranscription({ text, role });
          if (role === 'user') {
            setIsUserSpeaking(true);
            setTimeout(() => setIsUserSpeaking(false), 1500);
          }
        },
        onClose: () => {
          setIsActive(false);
          sessionRef.current = null;
          setTranscription(null);
        },
      });

      sessionRef.current = await sessionPromise;

      scriptProcessor.onaudioprocess = (e) => {
        if (isMuted || !sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        sessionRef.current.sendRealtimeInput({ media: pcmBlob });
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(inputCtx.destination);
      
      setIsActive(true);
      setIsMuted(false);
    } catch (err) {
      console.error("Failed to start session:", err);
      alert("මයික්‍රොෆෝනය සක්‍රීය කිරීමට අවසර ලබා දී නැවත උත්සාහ කරන්න.");
    }
  };

  const toggleMic = () => {
    if (!isActive) {
      startSession();
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-screen w-full bg-[#120b0d] flex flex-col items-center justify-between overflow-hidden relative selection:bg-rose-500/30">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(183,28,28,0.15),_transparent_80%)] pointer-events-none" />
      <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
      
      <div className="w-full pt-10 flex flex-col items-center z-50 pointer-events-none select-none">
         <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl px-10 py-3 rounded-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <span className="text-white text-[13px] font-black tracking-[0.5em] uppercase">SCT FERNANDO</span>
            <Sparkles className="w-4 h-4 text-rose-300 animate-pulse" />
         </div>
         <p className="mt-3 text-rose-100/30 text-[9px] uppercase tracking-[0.8em] font-medium">Beauty AI Consultant</p>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative z-10">
         <BeautyExpert isSpeaking={isSpeaking} isUserSpeaking={isUserSpeaking} />
         
         <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[94%] max-w-lg text-center pointer-events-none z-20">
            {transcription && (
              <div className={`p-8 rounded-[2.5rem] backdrop-blur-[50px] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6 border ${transcription.role === 'user' ? 'bg-white/5 border-white/10 text-orange-100/50 text-base' : 'bg-rose-900/20 border-rose-500/30 text-white text-xl md:text-2xl font-medium shadow-[0_40px_100px_rgba(0,0,0,0.7)]'}`}>
                <div className="flex items-center justify-center space-x-2 mb-2 opacity-30">
                   {transcription.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                   <span className="text-[10px] uppercase tracking-widest">{transcription.role === 'user' ? 'You' : 'Ms. Beauty'}</span>
                </div>
                <p className="sinhala-font leading-[1.6] drop-shadow-2xl">
                   "{transcription.text}"
                </p>
              </div>
            )}
         </div>
      </div>

      <div className="w-full flex flex-col items-center space-y-10 pb-16 z-30">
         <div className="flex flex-col items-center space-y-6">
            <button 
              onClick={toggleMic}
              className={`p-14 rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative group ${isMuted || !isActive ? 'bg-rose-950/40 text-rose-500 border-2 border-rose-500/30' : 'bg-rose-600 text-white shadow-[0_0_40px_rgba(229,57,53,0.5)]'}`}
            >
              {isMuted || !isActive ? <MicOff className="w-14 h-14" /> : <Mic className="w-14 h-14" />}
              
              {!isActive && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
                  <div className="bg-white text-rose-900 text-[12px] font-black px-8 py-2.5 rounded-full whitespace-nowrap animate-bounce shadow-[0_20px_50px_rgba(0,0,0,0.5)] uppercase tracking-[0.2em]">
                    මට කතා කරන්න
                  </div>
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
              )}

              {isActive && !isMuted && (
                <div className="absolute inset-0 rounded-full border-4 border-rose-400/30 animate-[ping_3s_infinite] pointer-events-none" />
              )}
            </button>
            
            <div className="flex items-center space-x-6 px-10 py-3 bg-white/5 rounded-full border border-white/5 shadow-inner">
               <div className={`w-3 h-3 rounded-full transition-all duration-700 ${isUserSpeaking ? 'bg-orange-400 shadow-[0_0_15px_rgba(255,152,0,1)] scale-125' : 'bg-white/5'}`} />
               <p className="text-rose-100/30 text-[11px] uppercase tracking-[0.6em] font-black text-center min-w-[160px]">
                  {isMuted ? 'Mic Disabled' : isSpeaking ? 'Ms. Beauty Speaking' : 'Listening...'}
               </p>
               <div className={`w-3 h-3 rounded-full transition-all duration-700 ${isSpeaking ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,67,54,1)] scale-125' : 'bg-white/5'}`} />
            </div>
         </div>

         <div className="opacity-10 select-none pointer-events-none transition-all duration-1000 hover:opacity-40">
            <p className="text-[14px] text-white font-black tracking-[2em] uppercase">SCT FERNANDO PRODUCTION</p>
         </div>
      </div>

      <style>{`
        .sinhala-font { font-family: 'Abhaya Libre', serif; }
        body { 
          background-color: #120b0d; 
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default App;
