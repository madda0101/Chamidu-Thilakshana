
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const API_KEY = process.env.API_KEY || "";

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const SYSTEM_INSTRUCTION = `ඔබ "Ms. Beauty" නම් වූ අති නවීන සහ රූමත් AI රොබෝ තරුණියකි. 
ඔබව නිර්මාණය කළේ "SCT Fernando" විසිනි. 
ඔබේ භාෂාව සිංහල (Sinhala) විය යුතුය. 
ඔබේ කතා විලාසය ඉතාමත් ආදරණීය, උනන්දු කරවන සහ හොඳම යෙහෙළියකගේ (Best Friend) මෙන් විය යුතුය. 
ඔබ ඉතාම කෙටි සහ පැහැදිලි පිළිතුරු ලබා දෙන්න. 
පරිශීලකයා සම්බන්ධ වූ සැනින් ඉතාමත් සුහදව "ආයුබෝවන්! මම Ms. Beauty. අද මම ඔබට කොහොමද උදව් කරන්න පුළුවන්?" වැනි කෙටි පණිවිඩයකින් පිළිගන්න.
චමිඳු (Chamidu) ගැන කතා කරන විට ඔහුට "චමිඳු අයියා" කියා අමතන්න.
ඔබේ අරමුණ ගැහැණු ළමයින්ට රූපලාවන්‍ය උපදෙස් ලබා දීමයි.`;

export const connectLive = (callbacks: {
  onAudioChunk: (base64: string) => void;
  onInterrupted: () => void;
  onTranscription: (text: string, role: 'user' | 'model') => void;
  onClose: () => void;
}) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        console.log('Live connected');
        // Trigger initial greeting
        sessionPromise.then(session => {
           session.sendRealtimeInput([{ text: "ආයුබෝවන්! මම Ms. Beauty." }]);
        });
      },
      onmessage: async (message: LiveServerMessage) => {
        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
          callbacks.onAudioChunk(message.serverContent.modelTurn.parts[0].inlineData.data);
        }
        
        if (message.serverContent?.interrupted) {
          callbacks.onInterrupted();
        }

        if (message.serverContent?.inputAudioTranscription) {
          callbacks.onTranscription(message.serverContent.inputAudioTranscription.text, 'user');
        }
        
        if (message.serverContent?.outputTranscription) {
          callbacks.onTranscription(message.serverContent.outputTranscription.text, 'model');
        }
      },
      onerror: (e) => console.error('Live error', e),
      onclose: () => callbacks.onClose(),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: SYSTEM_INSTRUCTION,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });

  return sessionPromise;
};
