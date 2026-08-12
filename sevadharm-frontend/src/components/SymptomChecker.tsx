import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Activity, ChevronRight, RefreshCw, ArrowRight, HeartPulse, AlertTriangle, Check, UserCheck, BrainCircuit, Mic, Send } from 'lucide-react';
import { UserProfile } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface SymptomCheckerProps {
  onBookSpecialty: (specialty: string) => void;
  onActivateSOS: () => void;
  onBackToDashboard: () => void;
  currentUser?: UserProfile | null;
}

interface TriageOutcome {
  severity: string;
  color: 'emergency' | 'brand' | 'success';
  score: string;
  possibleCauses: string[];
  remedies: string[];
  specialty: string;
  urgent: boolean;
}

export default function SymptomChecker({ onBookSpecialty, onActivateSOS, onBackToDashboard, currentUser }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState<'input' | 'result'>('input');
  
  // AI States
  const [symptomInput, setSymptomInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [primarySymptom, setPrimarySymptom] = useState('');
  
  // API States
  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState<TriageOutcome | null>(null);

  const restartChecker = () => {
    setSymptomInput('');
    setIsRecording(false);
    setPrimarySymptom('');
    setOutcome(null);
    setCurrentStep('input');
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input. Please type your symptoms instead.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptomInput(prev => {
        const text = prev.trim();
        return text ? `${text} ${transcript}` : transcript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleCompileDiagnosis = async () => {
    if (!symptomInput.trim()) return;
    setIsLoading(true);
    setPrimarySymptom(symptomInput);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing.');
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are a medical triage AI. The user has described the following symptoms:
        "${symptomInput}"
        
        Analyze the symptoms and provide a JSON response matching the schema.
        CRITICAL RULES:
        1. DO NOT give any direct medicine advice (no pill names, no prescriptions, no over-the-counter drugs). NEVER RECOMMEND MEDICINES.
        2. Provide simple, instant home care tips and general advice on how to take care of the condition.
        3. Recommend the appropriate doctor specialty for these symptoms so the user can book an appointment.
        4. If the symptoms indicate a severe life-threatening emergency, set 'urgent' to true, and color to 'emergency'.
        5. For "severity" use terms like 'Standard Self-Care' or 'High Priority Care' or 'Emergency Care'.
        6. For "score" use terms like 'Low Risk' or 'Elevated Risk' or 'Critical'.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING },
              color: { type: Type.STRING, description: "Must be one of: emergency, brand, success" },
              score: { type: Type.STRING },
              possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
              remedies: { type: Type.ARRAY, items: { type: Type.STRING } },
              specialty: { type: Type.STRING },
              urgent: { type: Type.BOOLEAN }
            },
            required: ['severity', 'color', 'score', 'possibleCauses', 'remedies', 'specialty', 'urgent']
          }
        }
      });
      
      const data = JSON.parse(response.text || '{}');
      
      // Enforce valid colors
      const validColor = ['emergency', 'brand', 'success'].includes(data.color) ? data.color : 'brand';
      setOutcome({
        ...data,
        color: validColor
      });
      setCurrentStep('result');
    } catch (err) {
      console.error('Triage error:', err);
      setOutcome({
        severity: 'Standard Self-Care', color: 'success', score: 'Low Risk',
        possibleCauses: ['General discomfort'],
        remedies: ['Rest and monitor symptoms', 'Stay hydrated'],
        specialty: 'General Physician', urgent: false
      });
      setCurrentStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-neutral-100 shadow-xl overflow-hidden">
      {/* Top Triage banner */}
      <div className="p-6 bg-brand text-white border-b border-brand-hover">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Active Clinical Triage System</span>
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wider mt-1.5">Seva Triage Assistant</h3>
        <p className="text-xs text-white/80 mt-1">Accurate medical screening based on symptom classification rules.</p>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* STEP: INPUT */}
          {currentStep === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="mx-auto w-12 h-12 bg-brand-soft text-brand rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">AI Symptom Triage</h4>
                <p className="text-neutral-500 text-xs px-4 leading-relaxed">
                  Describe what happened, how you are feeling, and any symptoms. Seva AI will analyze your input to recommend medication and the right doctor.
                </p>
              </div>

              <div className="relative border-2 border-neutral-100 rounded-2xl overflow-hidden focus-within:border-brand transition-colors bg-neutral-50/50">
                <textarea
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g. I have a severe headache since yesterday and feel slightly nauseous..."
                  className="w-full p-4 bg-transparent resize-none outline-none text-sm text-neutral-700 min-h-[120px] font-medium"
                />
                <div className="bg-white border-t border-neutral-100 p-3 flex justify-between items-center">
                  <button
                    onClick={handleMicClick}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${isRecording ? 'bg-emergency-soft text-emergency animate-pulse' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'}`}
                    title="Speak your symptoms"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCompileDiagnosis}
                    disabled={isLoading || !symptomInput.trim()}
                    className="px-6 py-3 bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                      <>
                        <span>Analyze Symptoms</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}



          {/* STEP: RESULT */}
          {currentStep === 'result' && outcome && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-5"
            >
              {/* Severity Card */}
              <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                outcome.color === 'emergency'
                  ? 'bg-emergency-light border-emergency-soft text-emergency-dark'
                  : outcome.color === 'brand'
                  ? 'bg-brand-light border-brand-soft text-brand-dark'
                  : 'bg-brand-light border-success-soft text-brand-dark'
              }`}>
                <div className={`p-2.5 rounded-2xl ${
                  outcome.color === 'emergency' ? 'bg-emergency-soft' : outcome.color === 'brand' ? 'bg-brand-soft' : 'bg-brand-soft'
                }`}>
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest block opacity-75">Triage Rating</span>
                  <h4 className="text-lg font-bold uppercase tracking-wider">{outcome.severity}</h4>
                  <p className="text-xs mt-1 opacity-90 leading-relaxed">Based on standard health guidelines. Avoid self-medicating for long durations.</p>
                </div>
              </div>

              {/* AI Clinical & Lifestyle Insights correlation */}
              {currentUser && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-brand animate-pulse" />
                    <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-widest block">AI Patient Profile Synthesis:</span>
                  </div>
                  <div className="p-4 bg-brand/5 border border-brand/10 space-y-3.5 text-xs">
                    {/* General greeting */}
                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                      Patient: <span className="text-neutral-900 font-bold">{currentUser.name}</span> ({currentUser.age} yrs • Blood: {currentUser.bloodGroup || 'Not Specified'})
                    </p>

                    {/* Chronic Conditions */}
                    {currentUser.chronicConditions && currentUser.chronicConditions !== 'None' && currentUser.chronicConditions !== '' ? (
                      <div className="flex gap-2.5 items-start">
                        <span className="px-1.5 py-0.5 bg-brand/20 text-brand text-[9px] font-bold uppercase tracking-wider h-fit mt-0.5 shrink-0">Chronic Check</span>
                        <div className="space-y-1">
                          <p className="text-neutral-800 font-bold leading-none uppercase text-[10px]">History of {currentUser.chronicConditions}</p>
                          <p className="text-neutral-500 text-[11px] leading-relaxed">
                            Your underlying health factors can alter symptoms or escalate diagnostic priorities for <span className="lowercase font-bold text-brand">{primarySymptom}</span>. Please highlight this profile history during your direct clinical review.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5 items-start">
                        <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[9px] font-bold uppercase tracking-wider h-fit mt-0.5 shrink-0">Chronic Check</span>
                        <div className="space-y-0.5">
                          <p className="text-neutral-500 text-[11px] leading-relaxed font-semibold">
                            No active co-morbidities or chronic cardiovascular conditions registered. Reduces base risk factors.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Allergies check */}
                    {currentUser.allergies && currentUser.allergies !== 'None' && currentUser.allergies !== '' ? (
                      <div className="flex gap-2.5 items-start border-t border-neutral-100/50 pt-3">
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider h-fit mt-0.5 shrink-0">Allergy Match</span>
                        <div className="space-y-1">
                          <p className="text-neutral-800 font-bold leading-none uppercase text-[10px]">Known Allergies: {currentUser.allergies}</p>
                          <p className="text-neutral-500 text-[11px] leading-relaxed">
                            Pharmacovigilance Flag: Always cross-reference all suggested remedies, Dolo medications, and chemical combinations with your listed allergies.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Lifestyle and Habits Integration */}
                    {(currentUser.smokingHabit && currentUser.smokingHabit !== 'Non-smoker') || (currentUser.drinkingHabit && currentUser.drinkingHabit !== 'Non-drinker') || (currentUser.stressLevel === 'High') || (currentUser.sleepHours && currentUser.sleepHours < 7) ? (
                      <div className="flex gap-2.5 items-start border-t border-neutral-100 pt-3">
                        <span className="px-1.5 py-0.5 bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-wider h-fit mt-0.5 shrink-0">Lifestyle Stressors</span>
                        <div className="space-y-2 text-neutral-600 text-[11px] leading-normal font-medium">
                          {currentUser.smokingHabit && currentUser.smokingHabit !== 'Non-smoker' && (
                            <p>• <span className="font-bold text-neutral-800 uppercase tracking-wide text-[9px]">Smoking Habit ({currentUser.smokingHabit}):</span> Increases mucosal irritation and chronic respiratory load, raising severity risks for flu/respiratory distress.</p>
                          )}
                          {currentUser.stressLevel === 'High' && (
                            <p>• <span className="font-bold text-neutral-800 uppercase tracking-wide text-[9px]">High Stress Levels:</span> Triggers chronic cortisol surges, compromising immune efficacy and directly compounding migraine or cardiovascular tension symptoms.</p>
                          )}
                          {currentUser.sleepHours && currentUser.sleepHours < 7 && (
                            <p>• <span className="font-bold text-neutral-800 uppercase tracking-wide text-[9px]">Inadequate Sleep ({currentUser.sleepHours} hrs):</span> Impairs physiological recovery rates and decreases cognitive and physical stress thresholds.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5 items-start border-t border-neutral-100 pt-3">
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider h-fit mt-0.5 shrink-0">Habits Check</span>
                        <p className="text-neutral-500 text-[11px] leading-relaxed font-semibold">
                          Excellent: Non-smoker lifestyle, active recovery, and low environmental habits optimize healing prognoses.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Possible Causes list */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Potential Classifications:</span>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                  {outcome.possibleCauses.map((cause, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      <span className="uppercase tracking-wider">{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate remedies */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Triage Care Guidelines:</span>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs text-neutral-600 leading-relaxed list-decimal pl-6">
                  {outcome.remedies.map((rem, idx) => (
                    <p key={idx} className="mb-1 leading-relaxed">
                      <span className="font-bold text-neutral-800">{idx + 1}.</span> {rem}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action routing */}
              <div className="p-4 bg-neutral-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Direct Specialty Routing</span>
                  <h5 className="font-bold text-sm text-brand-soft uppercase tracking-wider mt-0.5">Consult {outcome.specialty}</h5>
                </div>
                
                {outcome.urgent ? (
                  <button 
                    onClick={onActivateSOS}
                    className="px-4 py-2.5 bg-emergency hover:bg-emergency-dark text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                  >
                    ACTIVATE SOS
                  </button>
                ) : (
                  <button 
                    onClick={() => onBookSpecialty(outcome.specialty)}
                    className="px-4.5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Footer buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={restartChecker}
                  className="flex-1 py-3 border border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restart Assessment</span>
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold uppercase tracking-widest text-[10px] rounded-2xl transition-all cursor-pointer text-center"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-center gap-1.5 uppercase font-bold tracking-wider">
        <Shield className="w-3.5 h-3.5" />
        <span>Seva Triage does not substitute physical examinations.</span>
      </div>
    </div>
  );
}