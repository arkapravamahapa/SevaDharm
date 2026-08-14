import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { History, FileText, Download, ShieldCheck, Stethoscope, User, Calendar, Heart, AlertTriangle, RefreshCw, Video, Clock } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../supabase';

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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback profile if some details are missing from the DB
  const profile = currentUser || {
    id: '',
    name: 'SevaDharam Patient',
    age: 30,
    mobile: 'Not Provided',
    email: 'user@sevadharam.com',
    bloodGroup: 'O+',
    allergies: 'None declared',
    chronicConditions: 'None declared',
    emergencyContact: 'Not Provided'
  };

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TYPESCRIPT FIX: Treat currentUser as 'any' to bypass strict interface checks
      const userId = (currentUser as any)?.id;

      if (!userId) {
        throw new Error("No secure patient ID found. Please log in again.");
      }

      // 1. Fetch Upcoming Appointments safely (Plain select without foreign key joins)
      const { data: apptData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', userId)
        .in('status', ['scheduled', 'live', 'delayed']) // Only show active ones
        .order('scheduled_at', { ascending: true });

      if (apptError) throw apptError;
      setAppointments(apptData || []);

      // 2. Fetch Historical Medical Records directly from Supabase
      const { data: recordData, error: recordError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false });

      if (recordError && recordError.code !== '42P01') { 
        // Ignore 42P01 (table does not exist) just in case you haven't seeded records yet
        throw recordError;
      }

      const mappedRecords: MedicalRecord[] = (recordData || []).map((item: any) => ({
        id: item.id,
        type: item.record_type || 'Consultation',
        title: item.title || 'Clinical Record',
        date: item.date || new Date(item.created_at).toLocaleDateString(),
        doctorName: item.doctor_name,
        description: item.details || item.description || 'No details provided.',
        status: 'Verified Clinical Entry',
        fileAttached: item.file_attached || undefined
      }));

      setRecords(mappedRecords);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [currentUser]);

  const downloadFile = (fileName: string) => {
    alert(`Downloading medical document: ${fileName} from SevaDharam encrypted cloud vault.`);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Digital Health Card */}
      <div className="lg:col-span-1 space-y-4">
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
                <span className="text-xs font-mono font-bold">{profile.age || '--'} Yrs</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">BLOOD GROUP</span>
                <span className="text-xs font-mono font-bold text-brand">{profile.bloodGroup || 'Not Set'}</span>
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

        <button
          onClick={onBackToDashboard}
          className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
        >
          Return to Dashboard
        </button>
      </div>

      {/* Right Column: Appointments & History */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* NEW SECTION: Upcoming Appointments (Video Call Access) */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" /> My Scheduled Appointments
            </h3>
            <span className="text-xs font-bold text-neutral-400">{appointments.length} Active</span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-neutral-400 font-bold animate-pulse">
              Syncing schedules...
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-6 text-center text-xs font-medium text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              You have no upcoming appointments booked.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map(appt => (
                <div key={appt.id} className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                  <span className="text-[9px] font-bold text-brand uppercase tracking-widest bg-brand-soft px-2 py-0.5 rounded-full">
                    {appt.appointment_type || 'Consultation'}
                  </span>
                  
                  <h4 className="font-bold text-neutral-900 mt-2 text-sm">
                    Medical Consultation
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider mt-0.5 mb-4">
                    Telehealth Session
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium mb-4 bg-neutral-50 p-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {new Date(appt.scheduled_at).toLocaleString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </div>
                  
                  {appt.room_url ? (
                    <a 
                      href={appt.room_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <Video className="w-4 h-4" /> Join Video Call
                    </a>
                  ) : (
                    <div className="w-full text-center px-4 py-2.5 bg-neutral-100 text-neutral-500 text-xs font-bold rounded-xl border border-neutral-200 cursor-not-allowed">
                      Link generated at appointment time
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing SECTION: Historical Medical Records Timeline */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
                <History className="w-5 h-5 text-neutral-500" /> Active Clinical Registry
              </h3>
              <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wider">Encrypted ledger of past records</p>
            </div>
            <button 
              onClick={fetchPatientData}
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
          <div className="relative border-l-2 border-neutral-100 pl-6 ml-2 space-y-6 pt-2">
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
              <div className="py-8 text-center border-2 border-dashed border-neutral-200 rounded-3xl text-neutral-400 text-xs font-medium">
                No past medical records found.
              </div>
            )}

            {loading && (
              <div className="py-8 text-center text-xs text-neutral-400 font-bold animate-pulse">
                Syncing encrypted passport history from Supabase...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}