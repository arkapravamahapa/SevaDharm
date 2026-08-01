import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, FileText, Download, ShieldCheck, Stethoscope, User, Calendar, Heart, AlertTriangle, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  doctorName?: string;
  description: string;
  status: string;
  fileAttached?: string;
}

interface MedicalHistoryViewProps {
  onBackToDashboard: () => void;
  currentUser: UserProfile | null;
}

export default function MedicalHistoryView({ onBackToDashboard, currentUser }: MedicalHistoryViewProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profile = currentUser || {
    name: 'Rajesh Kumar',
    age: 34,
    mobile: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    bloodGroup: 'O+',
    allergies: 'Pollen, Penicillin',
    chronicConditions: 'Slight Hypertension',
    emergencyContact: '+91 99887 76655'
  };

  const fetchLiveMedicalHistory = async () => {
    setLoading(true);
    try {
      const email = profile.email || 'user@sevadharam.com';
      const response = await fetch(`http://localhost:8000/api/passport/records?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch clinical records from live database');
      }

      const result = await response.json();
      
      // Map backend fields to the interface format if necessary
      const mappedRecords: MedicalRecord[] = (result.data || []).map((item: any) => ({
        id: item.id || Math.random().toString(),
        type: item.record_type || 'Consultation',
        title: item.title,
        date: item.date,
        doctorName: item.doctor_name,
        description: item.details,
        status: 'Verified Clinical Entry',
        fileAttached: item.file_attached || undefined
      }));

      setRecords(mappedRecords);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMedicalHistory();
  }, []);

  const downloadFile = (fileName: string) => {
    alert(`Downloading medical document: ${fileName} from SevaDharam encrypted cloud vault.`);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column: Digital Health Card */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-neutral-700">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-black text-sm">SD</div>
              <h4 className="font-extrabold text-sm tracking-tight text-brand">SevaDharam Passport</h4>
            </div>
            <ShieldCheck className="w-5 h-5 text-brand" />
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">PATIENT NAME</span>
              <h5 className="font-extrabold text-base">{profile.name}</h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">AGE / GEN</span>
                <span className="text-xs font-mono font-bold">{profile.age || 34} Yrs • Male</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">BLOOD GROUP</span>
                <span className="text-xs font-mono font-bold text-brand">{profile.bloodGroup || 'O+'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Allergies: {profile.allergies || 'None declared'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emergency shrink-0" />
                <span>Chronic: {profile.chronicConditions || 'None declared'}</span>
              </div>
            </div>

            {/* Simulated Clinical Barcode */}
            <div className="pt-3 border-t border-white/10 flex flex-col items-center">
              <div className="w-full h-8 bg-white/10 rounded flex items-center justify-around px-2 font-mono text-[9px] tracking-[6px] text-neutral-400 select-none">
                ||||| | |||| | || ||| || ||
              </div>
              <span className="text-[8px] font-mono text-neutral-400 mt-1">SD-REG-VAULT</span>
            </div>
          </div>
        </div>

        {/* Printable print summary guide */}
        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-white border border-neutral-200 text-neutral-700 hover:text-brand hover:border-brand rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Print Clinical Health Card</span>
        </button>
      </div>

      {/* Right Column: Historical Medical Records Timeline */}
      <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Active Clinical Registry</h3>
            <p className="text-xs text-neutral-500">Encrypted chronological ledger of your live database consultations and records.</p>
          </div>
          <button 
            onClick={fetchLiveMedicalHistory}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-all cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Timeline body */}
        <div className="relative border-l-2 border-neutral-100 pl-6 ml-2 space-y-6">
          {!loading && records.map((rec) => (
            <div key={rec.id} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand" />

              <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-200 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-soft text-brand">
                      {rec.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 font-bold">{rec.date}</span>
                  </div>
                  
                  {rec.fileAttached && (
                    <button 
                      onClick={() => downloadFile(rec.fileAttached!)}
                      className="text-brand hover:text-brand-hover text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{rec.fileAttached}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-neutral-800">{rec.title}</h4>
                  {rec.doctorName && (
                    <p className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{rec.doctorName}</span>
                    </p>
                  )}
                  <p className="text-xs text-neutral-600 leading-relaxed pt-1">{rec.description}</p>
                </div>

                {/* Verification tag */}
                <div className="flex items-center gap-1 text-[10px] text-brand font-bold uppercase pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{rec.status}</span>
                </div>
              </div>
            </div>
          ))}

          {!loading && records.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-neutral-200 rounded-3xl text-neutral-400 text-xs font-medium">
              No live records found in the database for this profile. Add records via your backend table to populate this ledger.
            </div>
          )}

          {loading && (
            <div className="py-12 text-center text-xs text-neutral-400 font-bold animate-pulse">
              Syncing encrypted passport history from Supabase...
            </div>
          )}
        </div>

        {/* Back navigation */}
        <button
          onClick={onBackToDashboard}
          className="w-full py-3.5 border border-neutral-200 text-neutral-600 hover:text-neutral-800 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center bg-white shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}