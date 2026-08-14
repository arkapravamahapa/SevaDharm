import React, { useEffect, useState, useMemo } from 'react';
import { 
  Video, User, CheckCircle2, ArrowRight, Home, UserCircle, 
  LogOut, AlertTriangle, Sparkles, Calendar, History, Loader2,
  Clock, CheckCircle, X, FileText, CalendarPlus, Plus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import VideoConsultation from './VideoConsultation';

// --- Types ---
interface DoctorProfile {
  id: string;
  full_name: string;
  role: string;
}

interface Appointment {
  id: string;
  patient_name: string;
  scheduled_at: string;
  status: 'live' | 'scheduled' | 'completed';
  appointment_type?: string; 
  diagnosis?: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
  patientName?: string;
}

export default function DoctorDashboard() {
  // Database States
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [liveSessions, setLiveSessions] = useState<Appointment[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Appointment[]>([]);
  const [previousSessions, setPreviousSessions] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [selectedSession, setSelectedSession] = useState<Appointment | null>(null);
  const [activeCallRoomUrl, setActiveCallRoomUrl] = useState<string | null>(null);

  // --- Date & Time Slot Logic ---
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDayName = (date: Date, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [newTimeInput, setNewTimeInput] = useState('');

  // Local Time Slots State
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: 'ts1', date: formatDate(next7Days[0]), time: '10:00 AM', isBooked: true, patientName: 'Amit Patel' },
    { id: 'ts3', date: formatDate(next7Days[0]), time: '04:00 PM', isBooked: false },
    { id: 'ts4', date: formatDate(next7Days[1]), time: '09:00 AM', isBooked: false },
  ]);

  // --- Data Fetching ---
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        window.location.replace('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setDoctor(profileData);

      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (!apptError && appointmentsData) {
        setLiveSessions(appointmentsData.filter(a => a.status === 'live'));
        setUpcomingSessions(appointmentsData.filter(a => a.status === 'scheduled'));
        setPreviousSessions(appointmentsData.filter(a => a.status === 'completed'));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleAddSlot = () => {
    if (!newTimeInput) return;
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

    const isDuplicate = slots.some(s => s.date === newSlot.date && s.time === newSlot.time);
    if (!isDuplicate) {
      setSlots([...slots, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
    }
    setNewTimeInput('');
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

  const currentDaySlots = slots.filter(slot => slot.date === formatDate(selectedDate));

  // --- Renders ---
  if (activeCallRoomUrl) {
    return (
      <VideoConsultation
        roomUrl={activeCallRoomUrl}
        onLeaveCall={() => setActiveCallRoomUrl(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#de7649]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] font-sans pb-20 relative">
      
      {/* HEADER */}
      <header className="bg-[#f9eee3] px-6 py-4 flex items-center justify-between border-b border-[#f0dac5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c84b31] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-black text-gray-900 tracking-tight leading-tight">SEVADHARAM</h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">Clinical Care Portal</p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Clinical Registry</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">Doctor: {doctor?.full_name || 'Loading...'}</span>
            <div className="w-2 h-2 rounded-full bg-[#de7649]"></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
            <Home className="w-4 h-4" /> HOME
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
            <UserCircle className="w-4 h-4" /> PROFILE
          </button>
          <button onClick={handleLogout} className="p-2 bg-white rounded-full text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8 mt-4">
        
        {/* WELCOME BANNER */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-light text-gray-800">
            Welcome, <span className="font-medium italic text-[#de7649]">{doctor?.full_name || 'Doctor'}</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Manage your consultations, track patient history, and connect with your scheduled appointments.
          </p>
        </div>

        {/* Availability & Scheduling */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarPlus className="w-4 h-4 text-[#de7649]" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800">Manage Availability</h3>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {next7Days.map((date, idx) => {
                const isSelected = formatDate(date) === formatDate(selectedDate);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'border-[#de7649] bg-[#de7649] text-white shadow-md shadow-[#de7649]/20'
                        : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-[#de7649]/30 hover:bg-[#de7649]/10'
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
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-700 focus:outline-none focus:border-[#de7649] focus:ring-1 focus:ring-[#de7649]"
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
                      className={`flex items-center justify-between p-3 rounded-xl border ${slot.isBooked ? 'bg-neutral-50 border-neutral-200' : 'bg-orange-50 border-orange-200'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${slot.isBooked ? 'text-neutral-400' : 'text-[#de7649]'}`} />
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{slot.time}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${slot.isBooked ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {slot.isBooked ? `Booked` : 'Available'}
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

        {/* LIVE SESSIONS */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-xs font-bold tracking-widest text-gray-800 uppercase">Live Sessions</h3>
          </div>
          
          {liveSessions.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">No live sessions at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveSessions.map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedSession(session)}
                  className="bg-white p-5 rounded-2xl border border-[#f0dac5] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#de7649] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fdfaf6] text-[#de7649] border border-[#f0dac5] flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900">{session.patient_name}</h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> Scheduled for {formatTime(session.scheduled_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCallRoomUrl('https://sevadharam.daily.co/telehealth-consultation-room');
                    }}
                    className="px-4 py-2 bg-[#de7649] text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#c84b31] transition-colors cursor-pointer"
                  >
                    Join Now
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* UPCOMING SCHEDULED */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <Calendar className="w-4 h-4" />
            <h3 className="text-xs font-bold tracking-widest uppercase">Upcoming Scheduled</h3>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-gray-500 italic p-6">No upcoming appointments scheduled.</p>
            ) : (
              upcomingSessions.map((session) => (
                <div key={session.id} onClick={() => setSelectedSession(session)} className="p-5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{session.patient_name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>📅 {formatDate(session.scheduled_at)}</span>
                        <span>🕒 {formatTime(session.scheduled_at)}</span>
                        {session.appointment_type && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                            {session.appointment_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#de7649] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* PREVIOUS SESSIONS */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-800">
            <History className="w-4 h-4" />
            <h3 className="text-xs font-bold tracking-widest uppercase">Previous Sessions</h3>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {previousSessions.length === 0 ? (
              <p className="text-sm text-gray-500 italic p-6">No previous sessions found.</p>
            ) : (
              previousSessions.map((session) => (
                <div key={session.id} onClick={() => setSelectedSession(session)} className="p-5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{session.patient_name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>📅 {formatDate(session.scheduled_at)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#de7649] hover:text-[#c84b31] tracking-widest uppercase transition cursor-pointer">
                    VIEW NOTES
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Session Details Modal */}
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
                  selectedSession.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-[#de7649]'
                }`}>
                  {selectedSession.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedSession.patient_name}</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Session ID: #{selectedSession.id.slice(0,6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Date & Time</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#de7649]" /> {formatDate(selectedSession.scheduled_at)}, {formatTime(selectedSession.scheduled_at)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Type</span>
                      <span className="flex items-center gap-1"><Video className="w-4 h-4 text-[#de7649]" /> {selectedSession.appointment_type || 'Video Consult'}</span>
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
                {selectedSession.status !== 'completed' && (
                  <button onClick={() => {
                    setSelectedSession(null);
                    setActiveCallRoomUrl('https://sevadharam.daily.co/telehealth-consultation-room');
                  }} className="flex-1 py-3 bg-[#de7649] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#c84b31] transition-colors cursor-pointer">Join Room</button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end z-40">
        <button className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center transition cursor-pointer">
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="text-[8px] font-bold tracking-wider">SOS</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full shadow-xl font-bold text-sm transition cursor-pointer">
          <Sparkles className="w-5 h-5" />
          Talk to Gemini AI
        </button>
      </div>

    </div>
  );
}