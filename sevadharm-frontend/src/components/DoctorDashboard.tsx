import React, { useEffect, useState, useMemo } from 'react';
import { 
  Video, User, CheckCircle2, ArrowRight, Home, UserCircle, 
  LogOut, AlertTriangle, Sparkles, Calendar, History, Loader2,
  Clock, CheckCircle, X, FileText, CalendarPlus, Plus, Trash2,
  Bell, AlertCircle, PhoneCall, Check, ExternalLink, RefreshCw, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import VideoConsultation from './VideoConsultation';

interface DoctorProfile {
  id: string;
  full_name: string;
  role: string;
  specialty?: string;
  avatar_url?: string;
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

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Active Video Call and Modals
  const [activeCallRoomUrl, setActiveCallRoomUrl] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Appointment | null>(null);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Postpone State
  const [postponeSession, setPostponeSession] = useState<Appointment | null>(null);
  const [postponeDate, setPostponeDate] = useState('');
  const [postponeTime, setPostponeTime] = useState('');

  // 7-Day Rolling Calendar State
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [newSlotType, setNewSlotType] = useState<'online' | 'offline'>('online');

  // Time Slots State
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  // Formatters
  const formatDateISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDateDisplay = (dateString: string | Date) => {
    const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeDisplay = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDayName = (date: Date, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Fetch Dashboard Data & Sync Real-Time
  const fetchDashboardData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        window.location.replace('/portal/dashboard');
        return;
      }

      // 1. Fetch Doctor Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setDoctor(profileData);
        if (profileData.available_slots && Array.isArray(profileData.available_slots)) {
          const loadedSlots: TimeSlot[] = profileData.available_slots.map((s: string, idx: number) => ({
            id: `slot-${idx}`,
            date: formatDateISO(next7Days[0]),
            time: s,
            type: 'online',
            isBooked: false
          }));
          setSlots(prev => prev.length === 0 ? loadedSlots : prev);
        }
      }

      // 2. Fetch Appointments
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (!apptError && appointmentsData) {
        setAppointments(appointmentsData as Appointment[]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Supabase Real-time Channel for Live Appointment updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAppt = payload.new as Appointment;
            setAppointments(prev => [newAppt, ...prev]);
            setNotificationBanner(`New Appointment Booked by ${newAppt.patient_name}!`);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Appointment;
            setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
            if (updated.status === 'delayed') {
              setNotificationBanner(`Appointment with ${updated.patient_name} marked as Delayed.`);
            }
          } else if (payload.eventType === 'DELETE') {
            setAppointments(prev => prev.filter(a => a.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtered Sessions
  const liveSessions = useMemo(() => {
    return appointments.filter(a => a.status === 'live');
  }, [appointments]);

  const upcomingSessions = useMemo(() => {
    return appointments.filter(a => a.status === 'scheduled' || a.status === 'delayed');
  }, [appointments]);

  const previousSessions = useMemo(() => {
    return appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
  }, [appointments]);

  // Slot Management
  const selectedDateStr = formatDateISO(selectedDate);
  const currentDaySlots = slots.filter(s => s.date === selectedDateStr);

  const handleAddSlot = async () => {
    if (!newTimeInput) return;
    const [hours, minutes] = newTimeInput.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedTime = `${h % 12 || 12}:${minutes} ${ampm}`;

    const newSlot: TimeSlot = {
      id: crypto.randomUUID(),
      date: selectedDateStr,
      time: formattedTime,
      type: newSlotType,
      isBooked: false
    };

    const isDuplicate = slots.some(s => s.date === newSlot.date && s.time === newSlot.time);
    if (!isDuplicate) {
      const updated = [...slots, newSlot].sort((a, b) => a.time.localeCompare(b.time));
      setSlots(updated);

      // Persist distinct time slots into profile
      if (doctor?.id) {
        const uniqueTimes = Array.from(new Set(updated.map(s => s.time)));
        await supabase
          .from('profiles')
          .update({ available_slots: uniqueTimes })
          .eq('id', doctor.id);
      }
    }
    setNewTimeInput('');
  };

  const handleDeleteSlot = async (id: string) => {
    const updated = slots.filter(s => s.id !== id);
    setSlots(updated);

    if (doctor?.id) {
      const uniqueTimes = Array.from(new Set(updated.map(s => s.time)));
      await supabase
        .from('profiles')
        .update({ available_slots: uniqueTimes })
        .eq('id', doctor.id);
    }
  };

  // Launch Video Consultation Room
  const handleStartConsultation = async (session: Appointment) => {
    const room = session.room_url || `https://sevadharam.daily.co/clinic`;
  
  await supabase
      .from('appointments')
      .update({ status: 'live', room_url: room })
      .eq('id', session.id);

    setActiveCallRoomUrl(room);
  };


  // Handle Postponing a Meeting
  const handlePostponeSession = async () => {
    if (!postponeSession || !postponeDate || !postponeTime) return;

    try {
      const scheduledDateTime = new Date(`${postponeDate} ${postponeTime}`).toISOString();
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          scheduled_at: scheduledDateTime, 
          status: 'scheduled', 
          notes: 'Doctor rescheduled the appointment to a new time.' 
        })
        .eq('id', postponeSession.id);

      if (error) throw error;

      setNotificationBanner(`Successfully postponed appointment with ${postponeSession.patient_name}.`);
      setPostponeSession(null);
      setPostponeDate('');
      setPostponeTime('');
      fetchDashboardData();

    } catch (err: any) {
      alert("Failed to postpone appointment: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/portal/dashboard');
  };

  if (activeCallRoomUrl) {
    return (
      <div className="p-4 bg-neutral-950 min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span> Live Patient Telehealth Session
            </h2>
            <button
              onClick={() => setActiveCallRoomUrl(null)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              End Call & Return
            </button>
          </div>
          <VideoConsultation
            roomUrl={activeCallRoomUrl}
            onLeaveCall={() => {
              setActiveCallRoomUrl(null);
              fetchDashboardData();
            }}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#de7649]" />
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Connecting Clinical Registry...</p>
      </div>
    );
  }

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

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-[#f0dac5]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-gray-800">
            {doctor?.full_name || 'Practitioner Online'}
          </span>
          <span className="text-[10px] text-neutral-400 font-bold uppercase">({doctor?.specialty || 'Physician'})</span>
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
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Welcome, <span className="text-[#de7649]">{doctor?.full_name || 'Doctor'}</span>
            </h2>
            <p className="text-neutral-500 mt-1 text-sm font-medium">
              Configure your 7-day consultation roster, initiate real-time video consults, and manage patient records.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#fdfaf6] px-4 py-2 rounded-2xl border border-[#f0dac5]">
            <span className="text-xs font-bold text-neutral-600">Active Bookings:</span>
            <span className="font-mono text-sm font-black text-[#de7649]">{appointments.length}</span>
          </div>
        </div>

        {/* 1. Schedule & Availability Builder (7-Day Rolling Calendar) */}
        <section className="bg-white rounded-3xl border border-[#f0dac5] p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-100 text-[#de7649] rounded-xl">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 uppercase tracking-wide">Manage 7-Day Availability</h3>
                <p className="text-xs text-neutral-400">Slots published here appear in real-time to booking patients.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ● Live Sync to Patient Portal
            </span>
          </div>

          {/* Day Selector Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {next7Days.map((date, idx) => {
              const isSelected = formatDateISO(date) === selectedDateStr;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center py-3.5 px-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#de7649] bg-[#de7649] text-white shadow-md shadow-[#de7649]/20 font-bold'
                      : 'border-neutral-200 bg-[#fdfaf6] text-neutral-600 hover:border-[#de7649]/50 hover:bg-orange-50/40'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                    {formatDayName(date, idx)}
                  </span>
                  <span className="text-lg font-black mt-1">
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

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {/* NEW POSTPONE BUTTON */}
                    <button
                      onClick={() => setPostponeSession(session)}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      title="Reschedule this appointment"
                    >
                      <CalendarDays className="w-3.5 h-3.5" /> Postpone
                    </button>

                    {/* Launch Consultation */}
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