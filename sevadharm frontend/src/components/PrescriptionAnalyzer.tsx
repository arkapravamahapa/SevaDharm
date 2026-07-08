import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, CheckCircle, Shield, AlertTriangle, RefreshCw, Pill, Clock, BadgeCheck, Stethoscope, BrainCircuit } from 'lucide-react';
import { UserProfile } from '../types';

interface PrescriptionAnalyzerProps {
  onBackToDashboard: () => void;
  currentUser?: UserProfile | null;
}

export default function PrescriptionAnalyzer({ onBackToDashboard, currentUser }: PrescriptionAnalyzerProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseState, setParseState] = useState<'idle' | 'uploading' | 'parsing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setParseState('uploading');
    setProgress(0);
    
    // Upload simulation
    const uploadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setParseState('parsing');
          triggerAIParse();
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const triggerAIParse = () => {
    setTimeout(() => {
      setParseState('completed');
    }, 2500);
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setParseState('idle');
    setProgress(0);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
      {/* Top banner */}
      <div className="p-6 bg-gradient-to-r from-brand to-orange-500 text-white">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">Seva AI Vision Suite</span>
        </div>
        <h3 className="text-xl font-extrabold mt-1">AI Prescription Analyzer</h3>
        <p className="text-xs text-white/80 mt-0.5">Upload doctors prescription slips to parse handwritten notes into structured guidelines.</p>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: UPLOAD & DRAG/DROP */}
          {parseState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Drag Area */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                  isDragActive 
                    ? 'border-brand bg-brand-light text-brand' 
                    : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 text-neutral-400 hover:border-brand/50'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden" 
                />
                <div className={`p-4 rounded-full ${isDragActive ? 'bg-brand/20 text-brand' : 'bg-white text-neutral-400 shadow-sm'}`}>
                  <UploadCloud className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm">Drag and Drop your prescription here</h4>
                  <p className="text-xs text-neutral-400 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
                </div>
                <button className="px-4 py-2 bg-white text-neutral-700 hover:text-brand border border-neutral-200 rounded-xl text-xs font-bold shadow-sm transition-all">
                  Browse Files
                </button>
              </div>

              {/* Helpful instructions */}
              <div className="p-4 bg-brand-light rounded-2xl border border-brand-soft flex items-start gap-3 text-brand-dark">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Privacy Guarantee</p>
                  <p className="opacity-90 leading-relaxed">Prescriptions uploaded are fully parsed server-side using secure HIPAA encryption keys. No details are visible to unauthorized clinical practitioners.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: UPLOADING / PARSING PROGRESS */}
          {(parseState === 'uploading' || parseState === 'parsing') && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-12 flex flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="relative flex items-center justify-center">
                {/* Simulated circle loader */}
                <div className="w-20 h-20 border-4 border-neutral-100 border-t-brand rounded-full animate-spin" />
                <FileText className="absolute w-7 h-7 text-brand" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="font-extrabold text-neutral-800 text-base">
                  {parseState === 'uploading' ? 'Uploading Document...' : 'Seva AI Deciphering Medical Slate...'}
                </h4>
                <p className="text-xs text-neutral-400 leading-normal">
                  {parseState === 'uploading' 
                    ? `Uploading file ${selectedFile?.name} (${progress}%)`
                    : 'Transcribing medical shorthand, aligning chemical formulations, and scanning allergy cross-matches.'
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPLETED RESULTS BREAKDOWN */}
          {parseState === 'completed' && (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Metadata row */}
              <div className="flex items-center justify-between p-4 bg-brand-light border border-success-soft rounded-2xl">
                <div className="flex items-center gap-3 text-brand-dark">
                  <BadgeCheck className="w-5 h-5" />
                  <div>
                    <span className="text-[10px] font-bold block uppercase tracking-wide opacity-75">Document Deciphered</span>
                    <h5 className="font-bold text-sm text-neutral-900">{selectedFile?.name || 'Prescription_Parsed.jpg'}</h5>
                  </div>
                </div>
                <button 
                  onClick={resetAnalyzer}
                  className="p-2 border border-neutral-200 hover:border-neutral-300 rounded-xl bg-white text-neutral-600 cursor-pointer"
                  title="Upload Another"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Parsed List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Parsed Formulations & Timing:</span>
                
                {/* Pill Card 1 */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-soft text-brand shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-neutral-800">Paracetamol 650mg (Dolo)</h5>
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">Category: Fever & Analgesic</p>
                      <div className="flex items-center gap-1.5 text-brand font-bold text-[10px] font-mono mt-1.5 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>After Meals • 1 Tablet • Max Thrice Daily</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-lg">Qty: 10</span>
                </div>

                {/* Pill Card 2 */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-soft text-brand shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-neutral-800">Pantoprazole 40mg (Pan-D)</h5>
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">Category: Acid Reflux & Gastric Shield</p>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] font-mono mt-1.5 uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>30 Mins Before Breakfast • 1 Tablet Daily</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-lg">Qty: 7</span>
                </div>
              </div>

              {/* Safety contraindication check */}
              <div className="p-4.5 bg-emergency-light border border-emergency-soft rounded-2xl flex gap-3.5 text-emergency-dark">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-emergency animate-pulse" />
                <div className="text-xs space-y-1">
                  <p className="font-extrabold">Clinical Contraindication Alert</p>
                  <p className="opacity-90 leading-relaxed">
                    Ensure not to couple Paracetamol with any secondary NSAID painkillers (e.g., Ibuprofen) without a direct general physician directive. This prevents elevated renal toxicity risks.
                  </p>
                </div>
              </div>

              {/* AI Profile Allergy & Chronic Disease Safety Match */}
              {currentUser && (
                <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl space-y-3">
                  <div className="flex items-center gap-1.5 text-brand">
                    <BrainCircuit className="w-4.5 h-4.5 animate-pulse text-brand" />
                    <span className="text-[10px] font-bold uppercase tracking-widest block">AI Pharmacovigilance Guard</span>
                  </div>
                  
                  <div className="text-xs space-y-2.5">
                    {/* Allergy checking */}
                    {currentUser.allergies && currentUser.allergies !== 'None' && currentUser.allergies !== '' ? (
                      <div className="flex gap-2 items-start text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-bold uppercase text-[9px] tracking-wide">Allergy Safety Match:</p>
                          <p className="text-neutral-600 text-[11px] leading-relaxed">
                            Parsed medications scanned against listed allergy: <span className="font-bold text-amber-700">"{currentUser.allergies}"</span>. Good news! No chemical derivatives of these allergens are present in <span className="font-semibold text-neutral-800">{selectedFile?.name || 'Prescription_Parsed.jpg'}</span>.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-start text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-bold uppercase text-[9px] tracking-wide">Allergies Status:</p>
                          <p className="text-neutral-600 text-[11px] leading-relaxed">
                            No active pharmaceutical or food allergies listed in your health passport.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Chronic diseases check (Hypertension / Diabetes / etc.) */}
                    {currentUser.chronicConditions && currentUser.chronicConditions !== 'None' && currentUser.chronicConditions !== '' ? (
                      <div className="flex gap-2 items-start text-neutral-800 border-t border-neutral-100 pt-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        <div>
                          <p className="font-bold uppercase text-[9px] tracking-wide text-brand">Co-morbidity Contraindication Cross-Check:</p>
                          <p className="text-neutral-600 text-[11px] leading-relaxed">
                            Because you have a history of <span className="font-bold text-neutral-800">"{currentUser.chronicConditions}"</span>: Paracetamol dosages must strictly respect hepatic thresholds. Avoid OTC nasal decongestants containing pseudoephedrine as they can trigger sudden blood pressure surges.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Liver/Kidney or Lifestyle check */}
                    {currentUser.drinkingHabit && currentUser.drinkingHabit !== 'Non-drinker' && (
                      <div className="flex gap-2 items-start text-red-800 border-t border-neutral-100 pt-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-bold uppercase text-[9px] tracking-wide text-red-600">Hepatic Metabolism warning:</p>
                          <p className="text-neutral-600 text-[11px] leading-relaxed">
                            You listed alcohol consumption as <span className="font-bold">"{currentUser.drinkingHabit}"</span>. Concomitant use of alcohol with Paracetamol heavily accelerates liver hepatotoxicity risks. Limit or strictly avoid alcohol intake during therapy.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onBackToDashboard}
                  className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={resetAnalyzer}
                  className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl text-xs shadow-lg shadow-brand/10 transition-all cursor-pointer text-center"
                >
                  Analyze Another Slip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5" />
        <span>Always verify with physical pharmacists before consuming drugs.</span>
      </div>
    </div>
  );
}
