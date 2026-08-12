import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Mic, X, Send, Sparkles, Volume2, Shield, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Message, UserProfile } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface SevaAIBotProps {
  isOpen: boolean;
  onToggle: () => void;
  onBookSpecialty: (specialty: string) => void;
  onActivateSOS: () => void;
  currentUser?: UserProfile | null;
}

export default function SevaAIBot({ isOpen, onToggle, onActivateSOS, currentUser }: SevaAIBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-initial',
      sender: 'seva-ai',
      text: 'Hello! I am Seva AI. How can I assist you with your health, symptoms, or medical queries today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      setMessages(prev => {
        if (prev.length <= 1) {
          return [
            {
              id: 'm-initial',
              sender: 'seva-ai',
              text: `Hello ${currentUser.name}! I am Seva AI. I have access to your health profile context. What medical or health questions can I help you with today?`,
              timestamp: new Date()
            }
          ];
        }
        return prev;
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing.');
      }

      const ai = new GoogleGenAI({ apiKey });

      const profileContext = currentUser ? `
        User Profile Context:
        - Name: ${currentUser.name}
        - Blood Group: ${currentUser.bloodGroup || 'Not specified'}
        - Known Allergies: ${currentUser.allergies || 'None'}
        - Chronic Conditions: ${currentUser.chronicConditions || 'None'}
        - Smoking Habit: ${currentUser.smokingHabit || 'Non-smoker'}
        - Drinking Habit: ${currentUser.drinkingHabit || 'Non-drinker'}
        - Stress Level: ${currentUser.stressLevel || 'Normal'}
      ` : 'User is currently unauthenticated / guest.';

      const prompt = `
        You are Seva AI, a highly intelligent and helpful AI assistant.

        ${profileContext}

        User Question: "${textToSend}"

        INSTRUCTIONS:
        1. STRICT DOMAIN ISOLATION: Evaluate if the user's question is related to medicine, health, symptoms, nutrition, fitness, mental health, general human biology, OR questions about how to use this Sevadharm website and its features.
        2. IF OUT OF BOUNDS: Set "isMedical" to false. In "responseText", politely inform the user that you are dedicated strictly to health, medical queries, and website assistance, and decline to answer the unrelated topic.
        3. IF IN BOUNDS: Set "isMedical" to true. In "responseText", respond naturally and insightfully as Seva AI. 
        4. CRITICAL FORMATTING: Keep your responses brief, precise, and straight to the point. Do not write long paragraphs. Do not output JSON within the responseText, just natural conversational text.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isMedical: { type: Type.BOOLEAN },
              responseText: { type: Type.STRING }
            },
            required: ['isMedical', 'responseText']
          }
        }
      });

      if (!response.text) {
        throw new Error('No response from Gemini API.');
      }

      const data = JSON.parse(response.text);

      const aiMsg: Message = {
        id: `m-ai-${Date.now()}`,
        sender: 'seva-ai',
        text: data.responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

    } catch (err) {
      console.error('AI response error:', err);
      const fallbackMsg: Message = {
        id: `m-ai-${Date.now()}`,
        sender: 'seva-ai',
        text: "I am Seva AI. I'm here to assist with health, medical questions, and navigating this website. Please try asking your question again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setIsTyping(false);
    }
  };

  const handleVoiceSimulation = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleSpoken = "I have had a migraine and nausea for the past few hours.";
        handleSend(sampleSpoken);
      }, 3000);
    }
  };

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-6">
        <div className="flex flex-col items-center gap-1.5 mr-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-75 duration-1000" />
            <motion.button
              onClick={onActivateSOS}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-600/50 w-14 h-14 rounded-full transition-all flex items-center justify-center cursor-pointer border-[3px] border-white"
            >
              <AlertTriangle className="w-6 h-6" strokeWidth={2} />
            </motion.button>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-500 font-bold text-[11px] uppercase tracking-widest shadow-sm border border-red-100">SOS</span>
        </div>

        <motion.button
          id="seva-ai-floating-btn"
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all relative"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-semibold text-sm pr-1">Talk to Seva AI</span>
        </motion.button>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-[115px] right-6 w-full max-w-md h-[550px] rounded-3xl bg-white shadow-2xl border border-neutral-100 z-50 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-gradient-to-r from-brand to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">Seva AI Health Assistant</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time AI Engine</span>
                  </div>
                </div>
              </div>
              <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2 bg-brand-light border-b border-brand-soft flex items-center gap-2 text-xs text-brand-dark">
              <Shield className="w-3.5 h-3.5" />
              <span>Dedicated strictly to medical consultations and Sevadharm website assistance.</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-neutral-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.sender === 'user'
                      ? 'bg-brand text-white rounded-br-none'
                      : 'bg-white text-neutral-800 shadow-sm border border-neutral-100 rounded-bl-none'
                    }`}>
                    {/* Plain text conversational response */}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>

                    <span className="text-[9px] block text-right mt-1 opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl rounded-bl-none p-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 80, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-brand-soft border-t border-brand-soft flex flex-col items-center justify-center py-2 text-brand"
                >
                  <span className="text-xs font-mono font-bold tracking-wider uppercase animate-pulse mb-1">Listening to symptoms...</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-6 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-10 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1.5 h-12 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <span className="w-1.5 h-8 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-4 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
              <button
                onClick={handleVoiceSimulation}
                className={`p-3 rounded-xl transition-all cursor-pointer ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                title="Speak Symptoms"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                placeholder="Ask any health or medical question..."
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all outline-none text-sm"
              />
              <button
                onClick={() => handleSend(inputText)}
                className="p-3 rounded-xl bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/20 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}