import React, { useEffect, useState } from 'react';
import { 
  Video, User, CheckCircle2, ArrowRight, Home, UserCircle, 
  LogOut, AlertTriangle, Sparkles, Calendar, History, Loader2 
} from 'lucide-react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';

// Define the structure of your real database rows
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
  appointment_type?: string; // e.g., 'Video Consult', 'In-Person'
  diagnosis?: string;
}

interface DoctorDashboardProps {
  currentUser?: UserProfile;
}

export default function DoctorDashboard({ currentUser }: DoctorDashboardProps = {}) {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [liveSessions, setLiveSessions] = useState<Appointment[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Appointment[]>([]);
  const [previousSessions, setPreviousSessions] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Get the currently logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        window.location.replace('/login');
        return;
      }

      // 2. Fetch the Doctor's real profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setDoctor(profileData);
      }

      // 3. Fetch real appointments assigned to this doctor
      // NOTE: Ensure your table is named 'appointments' and has 'doctor_id'
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (!apptError && appointmentsData) {
        // Automatically sort data based on the 'status' column
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

  // Helper function to format ISO dates to "Oct 25, 2026"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // Helper function to format ISO dates to "10:00 AM"
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

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
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition">
            <Home className="w-4 h-4" /> HOME
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition">
            <UserCircle className="w-4 h-4" /> PROFILE
          </button>
          <button onClick={handleLogout} className="p-2 bg-white rounded-full text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition">
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

        {/* LIVE SESSIONS */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#de7649]"></div>
            <h3 className="text-xs font-bold tracking-widest text-gray-800 uppercase">Live Sessions</h3>
          </div>
          
          {liveSessions.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-white p-6 rounded-2xl border border-gray-100">No live sessions at the moment.</p>
          ) : (
            <div className="space-y-4">
              {liveSessions.map((session) => (
                <div key={session.id} className="bg-white border border-[#f0dac5] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#fdfaf6] border border-[#f0dac5] flex items-center justify-center text-[#de7649]">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{session.patient_name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        🕒 Scheduled for {formatTime(session.scheduled_at)}
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 bg-[#de7649] hover:bg-[#c84b31] text-white text-xs font-bold rounded-full shadow-md transition-all">
                    JOIN NOW
                  </button>
                </div>
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
                <div key={session.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer group">
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
                <div key={session.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{session.patient_name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>📅 {formatDate(session.scheduled_at)}</span>
                        {session.diagnosis && (
                          <span className="px-2 py-0.5 bg-gray-50 rounded text-gray-600 border border-gray-100">
                            Diagnosis: {session.diagnosis}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#de7649] hover:text-[#c84b31] tracking-widest uppercase transition">
                    VIEW NOTES
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
        <button className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center transition">
          <AlertTriangle className="w-5 h-5 mb-0.5" />
          <span className="text-[8px] font-bold tracking-wider">SOS</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-4 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-full shadow-xl font-bold text-sm transition">
          <Sparkles className="w-5 h-5" />
          Talk to Gemini AI
        </button>
      </div>

    </div>
  );
}