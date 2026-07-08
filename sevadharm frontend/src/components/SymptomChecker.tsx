import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Activity, ChevronRight, RefreshCw, ArrowRight, HeartPulse, AlertTriangle, Check, UserCheck, BrainCircuit } from 'lucide-react';
import { UserProfile } from '../types';

interface SymptomCheckerProps {
  onBookSpecialty: (specialty: string) => void;
  onActivateSOS: () => void;
  onBackToDashboard: () => void;
  currentUser?: UserProfile | null;
}

export default function SymptomChecker({ onBookSpecialty, onActivateSOS, onBackToDashboard, currentUser }: SymptomCheckerProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'result'>('intro');
  
  // Quiz states
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [feverTemp, setFeverTemp] = useState('');
  const [painLevel, setPainLevel] = useState('Mild');
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);

  const handleSymptomSelect = (sym: string) => {
    setPrimarySymptom(sym);
    if (sym === 'Chest Pain / Heart tightness' || sym === 'Sudden severe shortness of breath') {
      onActivateSOS();
      return;
    }
    setCurrentStep('q1');
  };

  const handleToggleAdditional = (sym: string) => {
    setAdditionalSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const restartChecker = () => {
    setPrimarySymptom('');
    setDuration('');
    setFeverTemp('');
    setPainLevel('Mild');
    setAdditionalSymptoms([]);
    setCurrentStep('intro');
  };

  const getTriageOutcome = () => {
    const isChestOrBreath = primarySymptom.includes('Chest') || primarySymptom.includes('breath');
    const isHighFever = feverTemp === 'Above 102°F (38.9°C)';
    const isLongDuration = duration === 'More than 5 days';
    const isSeverePain = painLevel === 'Severe';

    if (isChestOrBreath) {
      return {
        severity: 'Critical Emergency',
        color: 'emergency',
        score: 'High Risk',
        possibleCauses: ['Myocardial Ischemia / Angina', 'Pulmonary embolism', 'Severe Asthmatic Bronchospasm'],
        remedies: ['Do not undergo physical effort.', 'Chew a standard Aspirin 325mg.', 'Call ambulance immediately.'],
        specialty: 'Cardiologist',
        urgent: true
      };
    }

    if (isHighFever || isSeverePain) {
      return {
        severity: 'High Priority Care',
        color: 'brand',
        score: 'Elevated Risk',
        possibleCauses: ['Acute Bacterial Infection', 'Influenza A / Dengue Virus', 'Pneumonia / Respiratory Infection'],
        remedies: ['Take Paracetamol 650mg strictly under advice.', 'Keep a cold, damp cloth on forehead.', 'Drink hydration fluids, track urine output.'],
        specialty: 'General Physician',
        urgent: false
      };
    }

    if (isLongDuration) {
      return {
        severity: 'Moderate Consultation',
        color: 'brand',
        score: 'Persistent Symptoms',
        possibleCauses: ['Chronic sinusitis', 'Immune deficiency', 'Secondary bacterial throat infection'],
        remedies: ['Gargle with warm salt water thrice daily.', 'Steam inhalation twice daily.', 'Ensure complete vocal and physical rest.'],
        specialty: 'General Physician',
        urgent: false
      };
    }

    // Default Low
    let recommendedSpecialty = 'General Physician';
    if (primarySymptom === 'Skin irritation / Rashes') recommendedSpecialty = 'Dermatologist';
    if (primarySymptom === 'Persistent Headaches') recommendedSpecialty = 'Neurologist';

    return {
      severity: 'Standard Self-Care',
      color: 'success',
      score: 'Low Risk',
      possibleCauses: ['Common Seasonal Rhinovirus (Cold)', 'Contact dermatitis', 'Tension-type Headache'],
      remedies: ['Ample sleep (7-8 hours).', 'Zinc and Vitamin-C supplements.', 'Avoid dust, pollen, or heavy allergens.'],
      specialty: recommendedSpecialty,
      urgent: false
    };
  };

  const outcome = getTriageOutcome();

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
          {/* STEP: INTRO */}
          {currentStep === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center">
                <div className="mx-auto w-12 h-12 bg-brand-soft text-brand rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">Preliminary Symptom Screening</h4>
                <p className="text-neutral-500 text-xs px-4 leading-relaxed">
                  Select your primary discomfort area to begin. For cardiac chest pains, SevaDharm will bypass questions and route to Emergency SOS directly.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Select primary symptom:</span>
                {[
                  'Fever, chills or heavy shivering',
                  'Persistent Headaches',
                  'Skin irritation / Rashes',
                  'Coughing, sore throat or nasal congestion',
                  'Chest Pain / Heart tightness',
                  'Sudden severe shortness of breath'
                ].map(sym => (
                  <button
                    key={sym}
                    onClick={() => handleSymptomSelect(sym)}
                    className="w-full text-left px-4 py-3 border border-neutral-200 rounded-2xl text-xs font-semibold hover:border-brand hover:bg-brand-light/30 text-neutral-700 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="uppercase tracking-wider">{sym}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-brand transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Q1 - Duration */}
          {currentStep === 'q1' && (
            <motion.div 
              key="q1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest">Step 1 of 4</span>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">How long have you experienced this?</h4>
              </div>

              <div className="space-y-2">
                {[
                  'Just started (Less than 24 hours)',
                  '1 to 3 days',
                  '3 to 5 days',
                  'More than 5 days'
                ].map(dur => (
                  <button
                    key={dur}
                    onClick={() => { setDuration(dur); setCurrentStep('q2'); }}
                    className="w-full text-left p-4 border border-neutral-200 rounded-2xl text-xs font-semibold hover:border-brand hover:bg-brand-light/20 text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Q2 - Temperature */}
          {currentStep === 'q2' && (
            <motion.div 
              key="q2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest">Step 2 of 4</span>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">Do you currently have a fever?</h4>
              </div>

              <div className="space-y-2">
                {[
                  'No fever / Normal body temp',
                  'Mild fever (99°F to 101°F)',
                  'Above 102°F (38.9°C)',
                  'I haven\'t checked my temperature'
                ].map(temp => (
                  <button
                    key={temp}
                    onClick={() => { setFeverTemp(temp); setCurrentStep('q3'); }}
                    className="w-full text-left p-4 border border-neutral-200 rounded-2xl text-xs font-semibold hover:border-brand hover:bg-brand-light/20 text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {temp}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Q3 - Pain Level */}
          {currentStep === 'q3' && (
            <motion.div 
              key="q3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest">Step 3 of 4</span>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">Rate the intensity of pain/discomfort:</h4>
              </div>

              <div className="space-y-2">
                {['Mild / Annoying but manageable', 'Moderate / Interferes with active work', 'Severe / Unbearable pain'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => { 
                      setPainLevel(lvl.startsWith('Severe') ? 'Severe' : lvl.startsWith('Moderate') ? 'Moderate' : 'Mild'); 
                      setCurrentStep('q4'); 
                    }}
                    className="w-full text-left p-4 border border-neutral-200 rounded-2xl text-xs font-semibold hover:border-brand hover:bg-brand-light/20 text-neutral-700 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: Q4 - Additional symptoms checkbox */}
          {currentStep === 'q4' && (
            <motion.div 
              key="q4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest">Step 4 of 4</span>
                <h4 className="font-bold uppercase tracking-wider text-neutral-800 text-sm">Select any additional symptoms present:</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'Nausea / Vomiting',
                  'Loss of taste / smell',
                  'Body weakness',
                  'Stiff neck',
                  'Dizziness / Vertigo',
                  'Heavy fatigue'
                ].map((sym) => {
                  const isChecked = additionalSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      onClick={() => handleToggleAdditional(sym)}
                      className={`p-3 rounded-2xl text-left border-2 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isChecked ? 'border-brand bg-brand-light text-neutral-900' : 'border-neutral-100 bg-white text-neutral-600'
                      }`}
                    >
                      <span className="uppercase tracking-wider">{sym}</span>
                      <span className={`w-4 h-4 rounded-2xl border flex items-center justify-center text-white ${
                        isChecked ? 'bg-brand border-brand' : 'border-neutral-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentStep('result')}
                className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all cursor-pointer"
              >
                Compile Diagnosis Report
              </button>
            </motion.div>
          )}

          {/* STEP: RESULT */}
          {currentStep === 'result' && (
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
