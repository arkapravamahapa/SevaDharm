import React, { useEffect, useState, useMemo } from 'react';
import { 
  Video, User, CheckCircle2, ArrowRight, Home, UserCircle, 
  LogOut, AlertTriangle, Sparkles, Calendar, History, Loader2,
  Clock, CheckCircle, X, FileText, CalendarPlus, Plus, Trash2,
  Bell, AlertCircle as AlertCircleIcon, PhoneCall, Check, ExternalLink, RefreshCw, CalendarDays, UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';
import VideoConsultation from './VideoConsultation';

interface DoctorProfile {
  id: string;
  full_name: string;
  role: string;
  specialty?: string;
  avatar_url?: string;
  profilePic?: string;
  userId?: string;
  available_slots?: string[];
  available_days?: string[];
}

interface Appointment {
  id: string;
  doctor_id: string;
  patient_id?: string;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  scheduled_at: string;
  status: 'live' | 'scheduled' | 'completed' | 'cancelled' | 'delayed';
  appointment_type: 'online' | 'offline' | 'Video Consult' | 'In-Person Visit';
  room_url?: string;
  diagnosis?: string;
  notes?: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
  isBooked: boolean;
  patientName?: string;
}

interface DoctorDashboardProps {
  currentUser?: any;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigatePatient?: () => void;
}

export default function DoctorDashboard({
  currentUser,
  onLogout,
  onNavigateHome,
  onNavigatePatient
}: DoctorDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize doctor portal engine
    const engine = initPortalEngine(containerRef.current, {
      mode: 'doctor',
      currentUser,
      onLogout,
      onNavigateHome,
      onNavigatePatient
    });
    engineRef.current = engine;

    return () => {
      if (engineRef.current && typeof engineRef.current.destroy === 'function') {
        engineRef.current.destroy();
      }
    };
  }, [currentUser, onLogout, onNavigateHome, onNavigatePatient]);

  return (
    <div className="min-h-screen bg-[#fdfaf6] font-sans pb-24 text-neutral-900">
      
      {/* Top Header */}
      <header className="bg-[#f9eee3] px-6 py-4 flex items-center justify-between border-b border-[#f0dac5] sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c84b31] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xs">
            S
          </div>
          <div>
            <h1 className="font-black text-gray-900 tracking-tight leading-tight">SEVADHARAM</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Clinical Practitioner Portal</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-[#f0dac5] shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf6] border border-[#f0dac5] flex items-center justify-center text-brand font-bold text-xs shrink-0 overflow-hidden">
            {doctor?.profilePic || doctor?.avatar_url ? (
              <img src={doctor.profilePic || doctor.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-neutral-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-800">
                {doctor?.full_name || 'Dr. Sneha Roy'}
              </span>
              <span className="text-[10px] text-brand font-bold uppercase">({doctor?.specialty || 'Physician'})</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
              ID: {doctor?.userId || 'SD-DOC-55102'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setRefreshing(true); fetchDashboardData(); }} 
            className="p-2.5 bg-white hover:bg-neutral-100 rounded-xl border border-[#f0dac5] text-neutral-700 transition cursor-pointer"
            title="Refresh Schedules"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => window.location.replace('/portal/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-800 border border-[#f0dac5] transition cursor-pointer"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button 
            onClick={handleLogout} 
            className="p-2.5 bg-white hover:bg-red-50 text-neutral-700 hover:text-red-600 rounded-xl border border-[#f0dac5] transition cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Broadcast Notification Alert */}
      {notificationBanner && (
        <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 mx-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notificationBanner}</span>
          </div>
          <button onClick={() => setNotificationBanner(null)} className="cursor-pointer font-black text-sm">✕</button>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 mt-2">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#f0dac5] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {(currentUser?.profilePic || doctor?.avatar_url) && (
              <img 
                src={currentUser?.profilePic || doctor?.avatar_url} 
                alt="" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f0dac5] shadow-xs shrink-0" 
              />
            )}
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                Welcome, <span className="text-[#de7649]">{doctor?.full_name || currentUser?.name || 'Doctor'}</span>
              </h2>
              <p className="text-neutral-500 mt-1 text-sm font-medium">
                Configure your 30-day consultation roster, initiate real-time video consults, and manage patient records.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#fdfaf6] px-4 py-2 rounded-2xl border border-[#f0dac5]">
            <span className="text-xs font-bold text-neutral-600">Active Bookings:</span>
            <span className="font-mono text-sm font-black text-[#de7649]">{appointments.length}</span>
          </div>
        </div>

        {/* 1. Schedule & Availability Builder (30-Day Rolling Calendar) */}
        <section className="bg-white rounded-3xl border border-[#f0dac5] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-100 text-[#de7649] rounded-xl">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 uppercase tracking-wide">Manage 30-Day Availability</h3>
                <p className="text-xs text-neutral-400">Slots published here span up to 1 month ahead for patient bookings.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncGoogleCalendar}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Sync 30-day roster to Google Calendar"
              >
                <Calendar className="w-3.5 h-3.5" /> Sync 1-Month to Calendar
              </button>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● Live Sync
              </span>
            </div>
          </div>

          {/* Day Selector Horizontal Scrollable Bar for 30 Days */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {next30Days.map((date, idx) => {
              const isSelected = formatDateISO(date) === selectedDateStr;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center py-3 px-4 rounded-2xl border transition-all shrink-0 cursor-pointer min-w-[70px] ${
                    isSelected
                      ? 'border-[#de7649] bg-[#de7649] text-white shadow-md shadow-[#de7649]/20 font-bold'
                      : 'border-neutral-200 bg-[#fdfaf6] text-neutral-600 hover:border-[#de7649]/50 hover:bg-orange-50/40'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                    {idx === 0 ? 'Today' : idx === 1 ? 'Tom' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-base font-black mt-1">
                    {date.getDate()}
                  </span>
                  <span className={`text-[9px] font-semibold mt-0.5 ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Slot Injection Form */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-neutral-900 font-extrabold text-sm">
                  Active Slots for {formatDateDisplay(selectedDate)}
                </h4>
                <p className="text-xs text-neutral-500">Add online video consultation or in-person chamber timings.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={newSlotType} 
                  onChange={(e) => setNewSlotType(e.target.value as 'online' | 'offline')}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 outline-none"
                >
                  <option value="online">Online Video Consult</option>
                  <option value="offline">In-Person Chamber</option>
                </select>
                <input
                  type="time"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-[#de7649]"
                />
                <button
                  onClick={handleAddSlot}
                  disabled={!newTimeInput}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#de7649] hover:bg-[#c84b31] text-white rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>
            </div>

            {/* List of Slots for Selected Day */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {currentDaySlots.length === 0 ? (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-neutral-400 text-xs font-medium">
                  No slots configured for {formatDateDisplay(selectedDate)}. Add a time slot above to open bookings.
                </div>
              ) : (
                currentDaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      slot.isBooked 
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-400' 
                        : 'bg-[#fffaf5] border-[#f0dac5] text-neutral-900 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className={`w-4 h-4 ${slot.isBooked ? 'text-neutral-400' : 'text-[#de7649]'}`} />
                      <div>
                        <p className="text-xs font-extrabold font-mono">{slot.time}</p>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          slot.type === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {slot.type === 'online' ? 'Video' : 'In-Person'}
                        </span>
                      </div>
                    </div>
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 2. LIVE SESSIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
            <h3 className="text-xs font-extrabold tracking-widest text-neutral-800 uppercase">
              Live Consultations in Progress ({liveSessions.length})
            </h3>
          </div>
          
          {liveSessions.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-[#f0dac5] text-center text-xs font-semibold text-neutral-400 shadow-xs">
              No live calls active right now. Start upcoming sessions below when scheduled.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSessions.map(session => (
                <div
                  key={session.id}
                  className="bg-white p-5 rounded-3xl border-2 border-[#de7649] shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#de7649] flex items-center justify-center font-bold">
                      <Video className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-neutral-900">{session.patient_name}</h4>
                      <p className="text-xs text-neutral-500 font-mono">Started: {formatTimeDisplay(session.scheduled_at)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartConsultation(session)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" /> Re-Enter Call
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. UPCOMING SCHEDULED CONSULTATIONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-800">
              <Calendar className="w-4 h-4 text-[#de7649]" />
              <h3 className="text-xs font-extrabold tracking-widest uppercase">Upcoming Scheduled Appointments</h3>
            </div>
            <span className="text-xs text-neutral-400 font-semibold">{upcomingSessions.length} Patient(s) Waiting</span>
          </div>
          
          <div className="bg-white border border-[#f0dac5] rounded-3xl shadow-sm overflow-hidden divide-y divide-neutral-100">
            {upcomingSessions.length === 0 ? (
              <div className="p-8 text-center text-xs font-medium text-neutral-400">
                No upcoming appointments booked on the clinical registry yet.
              </div>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/80 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold shrink-0">
                      <User className="w-5 h-5 text-neutral-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-neutral-900">{session.patient_name}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-neutral-500 font-medium">
                        <span>📅 {formatDateDisplay(session.scheduled_at)}</span>
                        <span>🕒 {formatTimeDisplay(session.scheduled_at)}</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-[#de7649] text-[10px] font-bold rounded-md uppercase">
                          {session.appointment_type || 'Online Consult'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 self-end md:self-auto">
                    
                    {/* NEW: Normal Cancel Button */}
                    <button
                      onClick={() => handleDoctorCancel(session)}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="Cancel appointment (Refunds Patient)"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>

                    {/* UPDATED: Clean No-Show Button */}
                    <button
                      onClick={() => handlePatientNoShow(session)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="Mark patient as No-Show"
                    >
                      <UserX className="w-3.5 h-3.5" /> No-Show
                    </button>

                    <button
                      onClick={() => setPostponeSession(session)}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="Reschedule this appointment"
                    >
                      <CalendarDays className="w-3.5 h-3.5" /> Postpone
                    </button>

                    <button
                      onClick={() => handleStartConsultation(session)}
                      className="px-5 py-2.5 bg-[#de7649] hover:bg-[#c84b31] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" /> Start Meeting
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4. PREVIOUS SESSIONS & CLINICAL HISTORY */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-800">
            <History className="w-4 h-4 text-neutral-500" />
            <h3 className="text-xs font-extrabold tracking-widest uppercase">Previous Consultations Archive</h3>
          </div>
          
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-neutral-100">
            {previousSessions.length === 0 ? (
              <div className="p-6 text-center text-xs font-medium text-neutral-400">
                No past consultations found in your archive.
              </div>
            ) : (
              previousSessions.map((session) => (
                <div key={session.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-neutral-900">{session.patient_name}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Completed on {formatDateDisplay(session.scheduled_at)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSession(session)}
                    className="text-xs font-extrabold text-[#de7649] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    View Notes
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* POSTPONE / RESCHEDULE MODAL */}
      <AnimatePresence>
        {postponeSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostponeSession(null)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900">Postpone Session</h3>
                </div>
                <button onClick={() => setPostponeSession(null)} className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-neutral-500 font-medium">
                  Select a new date and time for your appointment with <span className="font-bold text-neutral-900">{postponeSession.patient_name}</span>. The patient will be notified automatically.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">New Date</label>
                    <input 
                      type="date" 
                      value={postponeDate}
                      onChange={(e) => setPostponeDate(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">New Time</label>
                    <input 
                      type="time" 
                      value={postponeTime}
                      onChange={(e) => setPostponeTime(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePostponeSession}
                disabled={!postponeDate || !postponeTime}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Confirm Reschedule
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Detail & Notes Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#de7649] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-neutral-900">{selectedSession.patient_name}</h3>
                    <p className="text-xs text-neutral-400 font-mono">ID: #{selectedSession.id.slice(0, 8)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-neutral-600">
                <div className="p-4 bg-neutral-50 rounded-2xl space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold uppercase text-neutral-400">Scheduled Date:</span>
                    <span className="font-bold text-neutral-800">{formatDateDisplay(selectedSession.scheduled_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold uppercase text-neutral-400">Time:</span>
                    <span className="font-bold text-neutral-800">{formatTimeDisplay(selectedSession.scheduled_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold uppercase text-neutral-400">Type:</span>
                    <span className="font-bold text-neutral-800 uppercase">{selectedSession.appointment_type}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Clinical Notes & Diagnosis</label>
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-800 font-medium">
                    {selectedSession.notes || selectedSession.diagnosis || 'No clinical notes added yet.'}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedSession(null)} 
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Emergency & AI Tools */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end z-40">
        <button className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center transition cursor-pointer">
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="text-[8px] font-black tracking-wider">SOS</span>
        </button>
        <button className="flex items-center gap-2 px-5 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-2xl shadow-xl font-bold text-xs transition cursor-pointer">
          <Sparkles className="w-4 h-4" /> Talk to Seva AI
        </button>
      </div>

    </div>
  );
}
