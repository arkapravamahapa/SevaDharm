import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, Video, User, History, CheckCircle,
  ArrowRight, X, FileText, CalendarPlus, Plus, Trash2
} from 'lucide-react';
import { UserProfile, Session } from '../types';
import VideoConsultation from './VideoConsultation';

interface DoctorDashboardProps {
  currentUser: UserProfile;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
  patientName?: string;
}

export default function DoctorDashboard({ currentUser }: DoctorDashboardProps) {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeCallRoomUrl, setActiveCallRoomUrl] = useState<string | null>(null);

  // --- Date & Time Slot Logic ---
  // Generate the next 7 days
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDayName = (date: Date, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [newTimeInput, setNewTimeInput] = useState('');

  // Mock data for time slots (In production, sync with your database)
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: 'ts1', date: formatDate(next7Days[0]), time: '10:00 AM', isBooked: true, patientName: 'Amit Patel' },
    { id: 'ts2', date: formatDate(next7Days[0]), time: '11:30 AM', isBooked: true, patientName: 'Sneha Rao' },
    { id: 'ts3', date: formatDate(next7Days[0]), time: '04:00 PM', isBooked: false },
    { id: 'ts4', date: formatDate(next7Days[1]), time: '09:00 AM', isBooked: false },
  ]);

  const handleAddSlot = () => {
    if (!newTimeInput) return;

    // Convert 24h time input to 12h format
    const [hours, minutes] = newTimeInput.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedTime = `${h % 12 || 12}:${minutes} ${ampm}`;

    const newSlot: TimeSlot = {
      id: Math.random().toString(36).substring(2, 9),
      date: formatDate(selectedDate),
      time: formattedTime,
      isBooked: false
    };

    // Prevent duplicates for the same date and time
    const isDuplicate = slots.some(s => s.date === newSlot.date && s.time === newSlot.time);
    if (!isDuplicate) {
      setSlots([...slots, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
    }
    setNewTimeInput('');
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const currentDaySlots = slots.filter(slot => slot.date === formatDate(selectedDate));

  // --- Mock Data for Sessions ---
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

      {/* Availability & Scheduling */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarPlus className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800">Manage Availability</h3>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {next7Days.map((date, idx) => {
              const isSelected = formatDate(date) === formatDate(selectedDate);
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? 'border-brand bg-brand text-white shadow-md shadow-brand/20'
                      : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-brand/30 hover:bg-brand-soft/30'
                    }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                    {formatDayName(date, idx)}
                  </span>
                  <span className="text-lg font-bold mt-1">
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots Manager for Selected Day */}
          <div className="pt-4 border-t border-neutral-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-neutral-900 font-bold text-sm">Slots for {formatDate(selectedDate)}</h4>
                <p className="text-xs text-neutral-500">Add time blocks when you are available for booking.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                  onClick={handleAddSlot}
                  disabled={!newTimeInput}
                  className="flex items-center gap-1 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentDaySlots.length === 0 ? (
                <div className="col-span-full p-4 border border-dashed border-neutral-200 rounded-xl text-center text-sm text-neutral-400">
                  No availability set for this date yet.
                </div>
              ) : (
                currentDaySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${slot.isBooked ? 'bg-neutral-50 border-neutral-200' : 'bg-brand-soft/20 border-brand/20'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${slot.isBooked ? 'text-neutral-400' : 'text-brand'}`} />
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{slot.time}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${slot.isBooked ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {slot.isBooked ? `Booked: ${slot.patientName}` : 'Available'}
                        </p>
                      </div>
                    </div>
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Remove slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

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

      {/* Session Modal */}
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedSession.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-brand-soft text-brand'
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