import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Mic, X, Send, Sparkles, Volume2, Shield, HeartHandshake, AlertTriangle, ArrowRight, BrainCircuit } from 'lucide-react';
import { Message, UserProfile } from '../types';

interface SevaAIBotProps {
  isOpen: boolean;
  onToggle: () => void;
  onBookSpecialty: (specialty: string) => void;
  onActivateSOS: () => void;
  currentUser?: UserProfile | null;
}

export default function SevaAIBot({ isOpen, onToggle, onBookSpecialty, onActivateSOS, currentUser }: SevaAIBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-initial',
      sender: 'seva-ai',
      text: 'Namaste! I am Seva AI, your personal clinical symptom triage assistant. What symptoms or medical queries can I assist you with today?',
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
              text: `Namaste, ${currentUser.name}! I am Seva AI, synced with your clinical health passport. I can see your profile details are active. What symptoms or medical queries can I assist you with today?`,
              timestamp: new Date()
            }
          ];
        }
        return prev;
      });
    } else {
      setMessages(prev => {
        if (prev.length <= 1) {
          return [
            {
              id: 'm-initial',
              sender: 'seva-ai',
              text: 'Namaste! I am Seva AI, your personal clinical symptom triage assistant. What symptoms or medical queries can I assist you with today?',
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

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate clinical triage AI response
    setTimeout(() => {
      setIsTyping(false);
      let responseText = "";
      let triage: Message['triageDetails'] = undefined;

      const cleanedText = textToSend.toLowerCase();

      // Detect user profile properties for dynamic clinical logic
      const hasChronic = currentUser && currentUser.chronicConditions && currentUser.chronicConditions !== 'None' && currentUser.chronicConditions !== '';
      const hasAllergies = currentUser && currentUser.allergies && currentUser.allergies !== 'None' && currentUser.allergies !== '';
      const isSmoker = currentUser && currentUser.smokingHabit && currentUser.smokingHabit !== 'Non-smoker';
      const isDrinker = currentUser && currentUser.drinkingHabit && currentUser.drinkingHabit !== 'Non-drinker';
      const isHighStress = currentUser && currentUser.stressLevel === 'High';
      const lowSleep = currentUser && currentUser.sleepHours && currentUser.sleepHours < 7;

      if (cleanedText.includes('chest pain') || cleanedText.includes('heart attack') || cleanedText.includes('breathing difficulty') || cleanedText.includes('stroke') || cleanedText.includes('unconscious')) {
        responseText = `⚠️ WARNING: This matches high-urgency emergency parameters. Chest pain, radiating arm numbness, or sudden breathing distress requires IMMEDIATE critical medical response. ${currentUser ? `Given your background of ${currentUser.age} yrs old ${hasChronic ? `and active conditions of ${currentUser.chronicConditions}` : ""}, ` : ""}please do not delay. Triggering immediate SOS support.`;
        triage = {
          severity: 'Emergency',
          possibleCauses: ['Myocardial Infarction (Heart Attack)', 'Pulmonary Embolism', 'Acute Angina', 'Severe Bronchospasm'],
          remedies: ['Sit upright', 'Chew Aspirin 325mg if advised by doctor', 'Do not exert physical energy'],
          recommendedSpecialty: 'Cardiologist'
        };
      } else if (cleanedText.includes('fever') || cleanedText.includes('headache') || cleanedText.includes('body pain') || cleanedText.includes('cold')) {
        responseText = `Based on your symptoms of fever/flu/headache, your clinical triage severity is rated Medium. ${isHighStress ? "Your registered high stress levels directly trigger muscular tension, potentially intensifying headache severity. " : ""}${isSmoker ? "Also, your smoking status increases airway mucosal susceptibility. " : ""}Please rest and monitor temperatures.`;
        triage = {
          severity: 'Medium',
          possibleCauses: ['Viral Influenza', 'Common Seasonal Rhinovirus', 'Acute Pharyngitis', 'Mild Dehydration'],
          remedies: [
            'Take ample fluids (warm soups, electrolyte water)',
            hasAllergies ? `Ensure medication does not cross-react with your allergy: ${currentUser.allergies}` : 'Paracetamol 650mg for fever control',
            'Complete bed rest for 24-48 hours'
          ],
          recommendedSpecialty: 'General Physician'
        };
      } else if (cleanedText.includes('skin') || cleanedText.includes('rash') || cleanedText.includes('itch') || cleanedText.includes('allergy')) {
        responseText = `I have detected symptoms relating to skin irritation or dermal rashes. Triage severity is rated Low. ${hasAllergies ? `Since you have noted allergies: "${currentUser.allergies}", this could be an acute hypersensitivity flare-up. Avoid contact with potential triggers.` : 'Avoid scratching the affected region to prevent bacterial superinfections.'}`;
        triage = {
          severity: 'Low',
          possibleCauses: hasAllergies ? ['Allergic Contact Dermatitis', 'Urticaria Flare-up'] : ['Contact Dermatitis', 'Mild Atopic Eczema', 'Urticaria (Hives)', 'Fungal Skin Infestation'],
          remedies: ['Apply cold compress or calamine lotion', 'Avoid harsh chemical soaps', 'Keep the region dry and hydrated'],
          recommendedSpecialty: 'Dermatologist'
        };
      } else if (cleanedText.includes('stomach') || cleanedText.includes('pain') || cleanedText.includes('acidity') || cleanedText.includes('vomit')) {
        responseText = `You have flagged abdominal discomfort or gastroduodenal symptoms. Keep a watch for dehydration signs and trace blood. ${isDrinker ? "Since you indicated an active alcohol habit, please note that alcohol directly compromises the stomach mucosal barrier, triggering acid reflux/gastritis." : "Maintain a light, non-spicy diet."}`;
        triage = {
          severity: 'Low',
          possibleCauses: ['Acute Gastroenteritis', 'Acid Peptic Disease / Reflux', 'Irritable Bowel Syndrome flare-up'],
          remedies: ['Sip warm water with ginger', 'Avoid heavy dairy, oils, and caffeine', 'Take antacids like Pantoprazole on advice'],
          recommendedSpecialty: 'General Physician'
        };
      } else {
        responseText = `I have analyzed your query. To give a precise symptom classification, please specify: duration, temperature, or any localized pain. ${currentUser ? `${hasChronic ? `Considering your medical history of ${currentUser.chronicConditions}, ` : ""}I advise a physical review with our general wellness team.` : "I recommend a quick clinical review with our general wellness team."}`;
        triage = {
          severity: 'Low',
          possibleCauses: ['General physiological fatigue', 'Minor localized immune response'],
          remedies: ['Stay hydrated', 'Ensure 8 hours of sleep', 'Review symptoms if they persist beyond 48h'],
          recommendedSpecialty: 'General Physician'
        };
      }

      const aiMsg: Message = {
        id: `m-ai-${Date.now()}`,
        sender: 'seva-ai',
        text: responseText,
        timestamp: new Date(),
        triageDetails: triage
      };

      setMessages(prev => [...prev, aiMsg]);

      // If emergency, pop the SOS trigger
      if (triage?.severity === 'Emergency') {
        setTimeout(() => {
          onActivateSOS();
        }, 1500);
      }

    }, 1800);
  };

  const handleVoiceSimulation = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate speech detection
      setTimeout(() => {
        setIsListening(false);
        const sampleSpoken = "I have had a high fever and severe headache since yesterday morning";
        handleSend(sampleSpoken);
      }, 3500);
    }
  };

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-6">
        {/* Floating SOS Button */}
        <div className="flex flex-col items-center gap-1.5 mr-2">
          <div className="relative">
            <div className="absolute inset-0 bg-emergency rounded-full animate-ping opacity-75 duration-1000" />
            <motion.button 
              onClick={onActivateSOS}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative bg-emergency hover:bg-emergency-dark text-white shadow-2xl shadow-emergency/50 w-14 h-14 rounded-full transition-all flex items-center justify-center cursor-pointer border-[3px] border-white"
            >
              <AlertTriangle className="w-6 h-6" strokeWidth={2} />
            </motion.button>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-500 font-bold text-[11px] uppercase tracking-widest shadow-sm border border-red-100">SOS</span>
        </div>

        {/* Floating Seva AI Button */}
        <motion.button 
          id="seva-ai-floating-btn"
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-important hover:bg-important-hover text-important-dark shadow-xl shadow-important/30 flex items-center gap-2 cursor-pointer transition-all relative"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#112B12] ring-2 ring-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#112B12] ring-2 ring-white" />
          <Sparkles className="w-6 h-6 text-important-dark animate-pulse" />
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
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">Seva AI Clinical Assistant</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-soft animate-pulse" />
                    <span>Active Clinical Triage Protocol</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shield Notice */}
            <div className="px-4 py-2 bg-brand-light border-b border-brand-soft flex items-center gap-2 text-xs text-brand-dark">
              <Shield className="w-3.5 h-3.5" />
              <span>Diagnostic advice generated is for preliminary screening.</span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-neutral-50/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.sender === 'user' 
                      ? 'bg-brand text-white rounded-br-none' 
                      : 'bg-white text-neutral-800 shadow-sm border border-neutral-100 rounded-bl-none'
                  }`}>
                    {/* Message Text */}
                    <p className="text-sm leading-relaxed">{msg.text}</p>

                    {/* AI Triage Cards */}
                    {msg.triageDetails && (
                      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-neutral-400">Clinical Screening</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.triageDetails.severity === 'Emergency' 
                              ? 'bg-emergency-light text-emergency animate-pulse' 
                              : msg.triageDetails.severity === 'High'
                              ? 'bg-orange-100 text-orange-600'
                              : msg.triageDetails.severity === 'Medium'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-success-light text-success'
                          }`}>
                            {msg.triageDetails.severity} Severity
                          </span>
                        </div>

                        {/* Remedies */}
                        <div>
                          <span className="text-xs font-semibold text-neutral-500 block mb-1">Immediate Safety Steps:</span>
                          <ul className="text-xs text-neutral-600 space-y-1 list-disc pl-4">
                            {msg.triageDetails.remedies.map((rem, idx) => (
                              <li key={idx}>{rem}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Special Routing */}
                        <div className="bg-brand-light/60 p-2.5 rounded-xl border border-brand-soft flex items-center justify-between">
                          <div className="text-[11px]">
                            <span className="text-neutral-400 block">Recommended Care:</span>
                            <span className="font-bold text-neutral-800">{msg.triageDetails.recommendedSpecialty}</span>
                          </div>
                          
                          {msg.triageDetails.severity === 'Emergency' ? (
                            <button 
                              onClick={onActivateSOS}
                              className="px-3 py-1.5 bg-emergency hover:bg-emergency-dark text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                              TRIGGER SOS
                            </button>
                          ) : (
                            <button 
                              onClick={() => onBookSpecialty(msg.triageDetails!.recommendedSpecialty)}
                              className="px-3 py-1.5 bg-important hover:bg-important-hover text-important-dark rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>Book Consult</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

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

            {/* Voice Wave Animation when Listening */}
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

            {/* Input Action Tray */}
            <div className="p-3 bg-white border-t border-neutral-100 flex items-center gap-2">
              <button 
                onClick={handleVoiceSimulation}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-emergency text-white animate-pulse' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                placeholder="Type symptoms (fever, headache, skin rash, chest pain...)"
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
