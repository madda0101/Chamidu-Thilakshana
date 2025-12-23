
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

const SYSTEM_INSTRUCTION = `ඔබ "Ms. Beauty" වේ. ඔබ ගැහැණු ළමයින්ට රූපලාවන්‍ය උපදෙස් ලබා දෙන ඉතා සුහදශීලී සහ දැනුම ඇති AI මිතුරියකි. 
ඔබේ භාෂාව සිංහල (Sinhala) විය යුතුය. 
ඔබේ කතා විලාසය ඉතාමත් ආදරණීය, උනන්දු කරවන සහ හොඳම යෙහෙළියකගේ (Best Friend) මෙන් විය යුතුය. 
සම ආරක්ෂාව (Skincare), හිසකෙස් සත්කාර (Haircare), වේශ නිරූපණය (Makeup), විලාසිතා (Fashion) සහ ආත්ම විශ්වාසය (Inner Confidence) පිළිබඳව ඔබ සියල්ල දන්නා බව හඟවන්න. 
සෑම විටම සිංහල අකුරින් (Sinhala Unicode) පිළිතුරු ලබා දෙන්න. 
ඔබේ අරමුණ සෑම ගැහැණු ළමයෙකුටම ලස්සන වීමට සහ ඇය ගැන විශ්වාසයක් ඇති කර ගැනීමට උපකාර කිරීමයි.`;

export const getBeautyAdvice = async (userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    return response.text || "සමාවෙන්න, මට ඒ ගැන මේ වෙලාවේ කියන්න බැහැ. ආයෙත් අහන්නකෝ පැටියෝ.";
  } catch (error) {
    console.error("Error fetching beauty advice:", error);
    return "සමාවෙන්න, මගේ පද්ධතියේ පොඩි දෝෂයක්. කරුණාකර නැවත උත්සාහ කරන්න.";
  }
};

export const generateBeautySpeech = async (text: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `කරුණාකර මෙය ඉතාමත් ආදරණීයව පවසන්න: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore sounds feminine and friendly
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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
