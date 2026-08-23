import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, FileText, AlertTriangle, RefreshCw, 
  BadgeCheck, BrainCircuit, ScanLine, User, 
  Stethoscope, Calendar, Building, Pill, Clock, Users
} from 'lucide-react';
import { UserProfile } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { supabase } from '../supabase'; // NEW: Added Supabase Import

interface PrescriptionAnalyzerProps {
  onBackToDashboard: () => void;
  currentUser?: UserProfile | null;
}

interface PrescriptionMetadata {
  doctor_name: string;
  patient_name: string;
  age: string;
  sex: string;
  date: string;
  clinic_details: string;
}

interface ParsedMedication {
  name: string;
  dosage?: string;
}

interface AIResponseData {
  is_prescription: boolean;
  reason_invalid?: string;
  metadata?: PrescriptionMetadata;
  medications?: ParsedMedication[];
}

export default function PrescriptionAnalyzer({ onBackToDashboard, currentUser }: PrescriptionAnalyzerProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseState, setParseState] = useState<'idle' | 'uploading' | 'parsing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AIResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Relation State
  const [relation, setRelation] = useState<string>('Self');
  
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
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    const MAX_SIZE = 5 * 1024 * 1024;
    
    if (file.size > MAX_SIZE) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf|webp)$/i)) {
      setError('Invalid file format. Please upload a JPG, PNG, WEBP, or PDF file.');
      return;
    }
    
    processFile(file);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setParseState('uploading');
    setProgress(0);
    
    const uploadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setParseState('parsing');
          analyzePrescriptionWithGemini(file);
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64String,
            mimeType: file.type || 'image/jpeg',
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // NEW: Save parsed data to Supabase Medical Records
  const saveToDatabase = async (parsedData: AIResponseData, file: File) => {
    try {
      const userId = (currentUser as any)?.id;
      if (!userId) return; // Skip if patient is not authenticated securely

      const extractedMeds = parsedData.medications?.map(m => m.name).join(', ') || 'No specific meds identified';

      const { error: dbError } = await supabase.from('medical_records').insert({
        patient_id: userId,
        record_type: 'Prescription Analysis',
        title: `AI Parsed Prescription (${relation})`,
        date: parsedData.metadata?.date || new Date().toISOString(),
        doctor_name: parsedData.metadata?.doctor_name || 'Seva AI Scanned',
        description: `Prescribed for: ${parsedData.metadata?.patient_name || relation}. Medications: ${extractedMeds}`,
        file_attached: file.name,
        relation: relation // Save the selected relationship!
      });

      if (dbError) console.error("Supabase Save Error:", dbError.message);
    } catch (err) {
      console.error("Failed to save to database:", err);
    }
  };

  const analyzePrescriptionWithGemini = async (file: File) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing. Please check your environment variables.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const imagePart = await fileToGenerativePart(file);

      const prompt = `
        Analyze this document image. Determine if it is a valid medical prescription slip.
        Extract the clinical details accurately. If it is not a prescription, set is_prescription to false and provide a reason.
        If it is a prescription, extract the doctor's name, patient's name, age, sex, date, clinic/hospital details, and a list of prescribed medications with their dosages.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [prompt, imagePart],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              is_prescription: { type: Type.BOOLEAN },
              reason_invalid: { type: Type.STRING },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  doctor_name: { type: Type.STRING },
                  patient_name: { type: Type.STRING },
                  age: { type: Type.STRING },
                  sex: { type: Type.STRING },
                  date: { type: Type.STRING },
                  clinic_details: { type: Type.STRING },
                },
              },
              medications: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                  },
                },
              },
            },
            required: ['is_prescription'],
          },
        },
      });

      if (!response.text) {
        throw new Error('No response received from Gemini AI.');
      }

      const parsedData: AIResponseData = JSON.parse(response.text);
      setAnalysisResult(parsedData);
      setParseState('completed');

      // Trigger the background database save if the document is valid
      if (parsedData.is_prescription) {
        saveToDatabase(parsedData, file);
      }

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || 'Error processing prescription image with AI.');
      } else {
        setError('An unexpected error occurred during AI analysis.');
      }
      setParseState('idle');
    }
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setParseState('idle');
    setProgress(0);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-100 shadow-2xl overflow-hidden">
      <div className="p-8 bg-gradient-to-br from-brand to-orange-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-48 h-48"/>
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white/90"/>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-white/90">Seva AI Vision Suite</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">Real-Time Prescription Decoder</h3>
          <p className="text-sm text-white/80 max-w-lg leading-relaxed">
            Upload patient slips for instantaneous AI-powered clinical text extraction and medication breakdown.
          </p>
        </div>
      </div>

      <div className="p-8 bg-neutral-50/30">
        <AnimatePresence mode="wait">
          {parseState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-3 shadow-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0"/>
                  <span>{error}</span>
                </div>
              )}

              {/* NEW: Relation Dropdown Menu */}
              <div className="space-y-2 bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand" /> Who is this prescription for?
                </label>
                <select 
                  value={relation} 
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
                >
                  <option value="Self">Myself</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other Relative</option>
                </select>
              </div>

              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-5 bg-white ${
                  isDragActive 
                    ? 'border-brand bg-brand-light/50 text-brand scale-[1.02]' 
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-400 hover:border-brand/40'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.webp"
                  className="hidden" 
                />
                <div className={`p-5 rounded-full shadow-sm transition-all duration-500 ${isDragActive ? 'bg-brand/20 text-brand' : 'bg-neutral-50 text-neutral-400'}`}>
                  <UploadCloud className="w-10 h-10 animate-bounce"/>
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-800 text-base">Drag and drop your prescription slip</h4>
                  <p className="text-xs text-neutral-400 mt-1.5 font-medium">Supports PDF, JPG, PNG, WEBP up to 5MB max</p>
                </div>
                <button className="px-6 py-2.5 bg-white text-neutral-700 hover:text-brand border border-neutral-200 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer">
                  Browse Files
                </button>
              </div>
            </motion.div>
          )}

          {(parseState === 'uploading' || parseState === 'parsing') && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-20 flex flex-col items-center justify-center space-y-6 text-center"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-neutral-100 border-t-brand rounded-full animate-spin" />
                <ScanLine className="absolute w-8 h-8 text-brand animate-pulse"/>
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="font-extrabold text-neutral-900 text-lg">
                  {parseState === 'uploading' ? 'Uploading Securely...' : 'Seva AI Vision Analyzing Document...'}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                  {parseState === 'uploading' 
                    ? `Transferring ${selectedFile?.name} (${progress}%)`
                    : 'Extracting medical entities and deciphering handwriting in real-time.'
                  }
                </p>
              </div>
            </motion.div>
          )}

          {parseState === 'completed' && analysisResult && (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center justify-between p-5 bg-white border border-neutral-100 shadow-sm rounded-3xl gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${analysisResult.is_prescription ? 'bg-brand-light/50 text-brand' : 'bg-red-50 text-red-600'}`}>
                    {analysisResult.is_prescription ? <BadgeCheck className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6"/>}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-base text-neutral-900">
                      {analysisResult.is_prescription ? 'Real-Time AI Scan Complete' : 'Invalid Document'}
                    </h5>
                    <p className="text-xs font-mono text-neutral-500 mt-0.5">Source: {selectedFile?.name}</p>
                    {/* Badge displaying relation selection */}
                    {analysisResult.is_prescription && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                        Saved for: {relation}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={onBackToDashboard} className="flex-1 md:flex-none px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-all cursor-pointer">
                    Dashboard
                  </button>
                  <button onClick={resetAnalyzer} className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all bg-white cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5"/> Scan New
                  </button>
                </div>
              </div>

              {!analysisResult.is_prescription ? (
                <div className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center space-y-4">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto"/>
                  <div>
                    <h3 className="text-lg font-black text-red-900 uppercase tracking-tight">Not a Valid Prescription</h3>
                    <p className="text-sm font-medium text-red-700 mt-2 max-w-lg mx-auto">
                      {analysisResult.reason_invalid || 'The uploaded file could not be verified as a medical prescription.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {analysisResult.metadata && (
                    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                      <div className="p-4 bg-neutral-900 text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand"/>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Extracted Clinical Metadata</span>
                      </div>
                      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                          <Stethoscope className="w-5 h-5 text-brand mt-0.5"/>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Doctor</p>
                            <p className="text-sm font-bold text-neutral-900 mt-1">{analysisResult.metadata.doctor_name || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-brand mt-0.5"/>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Patient Details</p>
                            <p className="text-sm font-bold text-neutral-900 mt-1">
                              {analysisResult.metadata.patient_name || 'Not specified'} <span className="text-neutral-400 font-medium">({analysisResult.metadata.age || 'N/A'}, {analysisResult.metadata.sex || 'N/A'})</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-brand mt-0.5"/>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</p>
                            <p className="text-sm font-bold text-neutral-900 mt-1">{analysisResult.metadata.date || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 sm:col-span-2 md:col-span-3">
                          <Building className="w-5 h-5 text-brand mt-0.5"/>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Clinic / Hospital</p>
                            <p className="text-sm font-bold text-neutral-900 mt-1">{analysisResult.metadata.clinic_details || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-brand"/> Extracted Medications
                    </h4>
                    
                    {(!analysisResult.medications || analysisResult.medications.length === 0) ? (
                      <div className="text-center py-12 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3"/>
                        <h4 className="font-bold text-neutral-900">No clear medications identified.</h4>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.medications.map((med, index) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={index} 
                            className="rounded-2xl border bg-white border-neutral-100 p-5 flex items-start gap-4 shadow-sm"
                          >
                            <div className="p-2.5 rounded-xl shrink-0 bg-neutral-100 text-neutral-600">
                              <Pill className="w-5 h-5"/>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Medicine {index + 1}</p>
                              <p className="text-base font-bold text-neutral-900">{med.name}</p>
                              {med.dosage && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-light/30 text-brand rounded-lg text-xs font-bold shadow-sm">
                                  <Clock className="w-3.5 h-3.5"/>
                                  <span>{med.dosage}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}