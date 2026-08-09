import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Video, User, History, CheckCircle, ArrowRight, X, FileText } from 'lucide-react';
import { UserProfile, Session } from '../types';
import VideoConsultation from './VideoConsultation';

interface DoctorDashboardProps {
  currentUser: UserProfile;
}

export default function DoctorDashboard({ currentUser }: DoctorDashboardProps) {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeCallRoomUrl, setActiveCallRoomUrl] = useState<string | null>(null);

  // Mock data for the dashboard (In production, fetch from Supabase bookings table)
  const liveSessions: Session[] = [
    { id: '1', patientName: 'Amit Patel', time: '10:00 AM', status: 'Waiting' }
  ];

  const upcomingSessions: Session[] = [
    { id: '2', patientName: 'Sneha Rao', date: 'Oct 25, 2026', time: '11:30 AM', type: 'Video Consult' },
    { id: '3', patientName: 'Vikram Singh', date: 'Oct 25, 2026', time: '02:00 PM', type: 'In-Person' }
  ];

  const previousSessions: Session[] = [
    { id: '4', patientName: 'Riya Sharma', date: 'Oct 24, 2026', diagnosis: 'Viral Fever', status: 'Completed' },
    { id: '5', patientName: 'Karan Desai', date: 'Oct 23, 2026', diagnosis: 'Migraine', status: 'Completed' }
  ];

  // If an active video call is launched, render the encrypted Daily.co video view full screen
  if (activeCallRoomUrl) {
    return (
      <VideoConsultation 
        roomUrl={activeCallRoomUrl} 
        onLeaveCall={() => setActiveCallRoomUrl(null)} 
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-soft rounded-full blur-3xl -z-10 opacity-40" />
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
            Welcome, <span className="italic font-serif text-brand font-medium">{currentUser?.name || 'Doctor'}</span>
          </h2>
          <p className="text-neutral-500 text-sm max-w-xl leading-normal">
            Manage your consultations, track patient history, and connect with your scheduled appointments.
          </p>
        </div>
      </div>

      {/* Live Sessions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800">Live Sessions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveSessions.map(session => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedSession(session)}
              className="bg-white p-5 rounded-2xl border border-brand/20 shadow-sm shadow-brand/5 flex items-center justify-between cursor-pointer hover:border-brand/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{session.patientName}</h4>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> Scheduled for {session.time}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Use a secure daily.co demo room or generate dynamic room URL from backend
                  setActiveCallRoomUrl('https://sevadharam.daily.co/telehealth-consultation-room');
                }}
                className="px-4 py-2 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-hover transition-colors cursor-pointer"
              >
                Join Now
              </button>
            </motion.div>
          ))}
          {liveSessions.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No live sessions at the moment.</p>
          )}
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800">Upcoming Scheduled</h3>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
          {upcomingSessions.map((session, idx) => (
            <div key={session.id} onClick={() => setSelectedSession(session)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors ${idx !== upcomingSessions.length - 1 ? 'border-b border-neutral-100' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{session.patientName}</h4>
                  <div className="flex gap-3 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                    <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{session.type}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-brand hover:bg-brand-soft rounded-full transition-colors cursor-pointer">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Previous Sessions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800">Previous Sessions</h3>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
          {previousSessions.map((session, idx) => (
            <div key={session.id} onClick={() => setSelectedSession(session)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors ${idx !== previousSessions.length - 1 ? 'border-b border-neutral-100' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{session.patientName}</h4>
                  <div className="flex gap-3 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {session.date}</span>
                    <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">Diagnosis: {session.diagnosis}</span>
                  </div>
                </div>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline cursor-pointer">
                View Notes
              </button>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSession(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedSession.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-brand-soft text-brand'
                }`}>
                  {selectedSession.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedSession.patientName}</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Session ID: #{selectedSession.id.padStart(5, '0')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Date & Time</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-brand" /> {selectedSession.date || 'Today'}, {selectedSession.time}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Type</span>
                      <span className="flex items-center gap-1"><Video className="w-4 h-4 text-brand" /> {selectedSession.type || 'Video Consult'}</span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Status</span>
                      <span className={`font-bold ${selectedSession.status === 'Completed' ? 'text-emerald-600' : 'text-amber-500'}`}>{selectedSession.status || 'Upcoming'}</span>
                    </div>
                  </div>
                </div>
                
                {selectedSession.diagnosis && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Clinical Notes</h4>
                    <div className="flex items-start gap-2 text-sm text-neutral-700">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span>Diagnosis: <strong>{selectedSession.diagnosis}</strong>. Patient advised to rest and take prescribed medication for 5 days.</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button onClick={() => setSelectedSession(null)} className="flex-1 py-3 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer">Close</button>
                 {selectedSession.status !== 'Completed' && (
                  <button onClick={() => {
                    setSelectedSession(null);
                    setActiveCallRoomUrl('https://sevadharam.daily.co/telehealth-consultation-room');
                  }} className="flex-1 py-3 bg-brand text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-hover transition-colors cursor-pointer">Join Room</button>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}