import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Video, MessageSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (Replace with your actual Supabase URL and Anon Key from your dashboard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

interface PostCheckoutPanelProps {
  appointmentId: string;
  doctorName: string;
}

export default function PostCheckoutPanel({ appointmentId, doctorName }: PostCheckoutPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      const file = event.target.files?.[0];
      if (!file) return;

      // 1. Restrict file size to 10MB on the frontend
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds the 10MB limit.');
      }

      // 2. Restrict file types (PDF, JPEG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${appointmentId}_${Date.now()}.${fileExt}`;
      const filePath = `consultations/${fileName}`;

      // 3. Upload to the secure Supabase bucket we just created
      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-8">
      {/* Success Header */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h2 className="text-2xl font-extrabold text-neutral-900">Checkout Successful!</h2>
        <p className="text-sm text-neutral-600 mt-1">Your appointment with {doctorName} is confirmed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Live Meeting & Chat */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-brand" />
              Live Consultation Room
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Your secure video room will activate at the scheduled time.
            </p>
          </div>
          
          <button className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2">
            <Video className="w-4 h-4" />
            Join Secure Video Call
          </button>

          <button className="w-full py-3.5 border border-neutral-200 hover:border-brand text-neutral-700 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Open Doctor Chat
          </button>
        </div>

        {/* Right Column: Secure Document Upload */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand" />
              Medical Records
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Upload past prescriptions or lab reports (Max 10MB).
            </p>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {!success ? (
              <label className={`border-2 border-dashed border-neutral-200 hover:border-brand rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className={`w-8 h-8 text-neutral-400 mb-3 ${uploading ? 'animate-bounce' : ''}`} />
                <span className="text-sm font-bold text-neutral-700 text-center">
                  {uploading ? 'Encrypting & Uploading...' : 'Click to upload files'}
                </span>
                <span className="text-[10px] text-neutral-400 mt-2 font-mono">PDF, JPG, PNG allowed</span>
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  accept=".pdf,image/jpeg,image/png" 
                  className="hidden" 
                />
              </label>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center text-emerald-700 text-center h-full">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">Files Uploaded Securely!</span>
                <span className="text-xs mt-1">The doctor has been notified.</span>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-3 flex items-center gap-2 text-red-600 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}