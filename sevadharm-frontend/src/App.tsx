import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabase';
import {
  Heart, ShieldCheck, Activity, PhoneCall, AlertTriangle,
  Sparkles, Stethoscope, Microscope, Pill, FileText,
  MapPin, Clock, History, UserCheck, LogOut, ArrowRight, User, Check, Edit, X, Home
} from 'lucide-react';
import { Booking, UserProfile } from './types';
import LandingPage from './components/LandingPage';
import BlogsPage from "./components/BlogsPage";
import EmailLogin from './components/EmailLogin'; 
import AuthModal from './components/AuthModal';
import SevaAIBot from './components/SevaAIBot';
import DoctorsSection from './components/DoctorsSection';
import SymptomChecker from './components/SymptomChecker';
import PrescriptionAnalyzer from './components/PrescriptionAnalyzer';
import MedicineStore from './components/MedicineStore';
import HospitalLocator from './components/HospitalLocator';
import DiagnosticCenter from './components/DiagnosticCenter';
import MedicalHistoryView from './components/MedicalHistoryView';
import EmergencySOS from './components/EmergencySOS';
import AdminPage from './components/AdminPage';
import UserProfileModal from './components/UserProfileModal';
import DoctorDashboard from './components/DoctorDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';

import iconTriage from '@/assets/icons/icon_triage.png';
import iconDoctor from '@/assets/icons/icon_doctor.png';
import iconPrescription from '@/assets/icons/icon_prescription.png';
import iconReminder from '@/assets/icons/icon_reminder.png';
import iconHospital from '@/assets/icons/icon_hospital.png';
import iconLab from '@/assets/icons/icon_lab.png';
import iconTranslator from '@/assets/icons/icon_translator.png';
import iconPassport from '@/assets/icons/icon_passport.png';
import iconProfile from '@/assets/icons/icon_profile.png';
import iconEmergency from '@/assets/icons/icon_emergency.png';
import logoImg from '@/assets/logo.png';

// --- Initialize Supabase Client ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mcngpubbgfwirhmafezv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_actual_supabase_anon_key';

export default function App() {
  // Navigation & Auth
  const location = useLocation();
  const navigate = useNavigate();
  
  const activePage = location.pathname === '/blogs' ? 'blogs' :
    location.pathname === '/login' ? 'login' :
    location.pathname.startsWith('/portal') ? 'portal' : 'landing';
    
  const portalTab = location.pathname.startsWith('/portal/') ?
    location.pathname.split('/')[2] || 'dashboard' : 'dashboard';
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSevaAiOpen, setIsSevaAiOpen] = useState(false);
  const [isReminderDismissed, setIsReminderDismissed] = useState(false);
  
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  
  // Profile completion edit modal
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [activeModalSection, setActiveModalSection] = useState<'vitals' | 'habits' | 'lifestyle' | 'metrics'>('vitals');
  const [profileForm, setProfileForm] = useState({
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: '',
    smokingHabit: '' as 'Non-smoker' | 'Occasional' | 'Heavy' | '',
    drinkingHabit: '' as 'Non-drinker' | 'Social' | 'Regular' | '',
    stressLevel: '' as 'Low' | 'Medium' | 'High' | '',
    sleepHours: '' as number | '',
    activityLevel: '' as 'Sedentary' | 'Lightly Active' | 'Highly Active' | '',
    dietType: '' as 'Veg' | 'Non-Veg' | 'Vegan' | '',
    weight: '' as number | '',
    height: '' as number | '',
  });

  // --- Supabase Session Listener ---
  useEffect(() => {
    // 1. Get the session initially on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          setCurrentUser(JSON.parse(demoUser));
        } catch (e) {
          console.error('Failed to parse demo user');
        }
      } else if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Patient',
          email: session.user.email || '',
          mobile: session.user.user_metadata?.mobile || '',
          role: session.user.user_metadata?.role || 'patient',
        } as unknown as UserProfile);
      } else {
        setCurrentUser(null);
      }
      setIsLoadingSession(false);
    });

    // 2. Listen for log in/out events triggered anywhere in the app
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          setCurrentUser(JSON.parse(demoUser));
        } catch (e) {
          setCurrentUser(null);
        }
      } else if (session?.user) {
        setCurrentUser((prev) => ({
          ...prev,
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Patient',
          email: session.user.email || '',
          mobile: session.user.user_metadata?.mobile || '',
          role: session.user.user_metadata?.role || 'patient',
        } as unknown as UserProfile));
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync profileForm whenever modal opens or currentUser changes
  useEffect(() => {
    if (currentUser && isProfileEditOpen) {
      setProfileForm({
        bloodGroup: currentUser.bloodGroup || '',
        allergies: currentUser.allergies || '',
        chronicConditions: currentUser.chronicConditions || '',
        emergencyContact: currentUser.emergencyContact || '',
        smokingHabit: currentUser.smokingHabit || '',
        drinkingHabit: currentUser.drinkingHabit || '',
        stressLevel: currentUser.stressLevel || '',
        sleepHours: currentUser.sleepHours || '',
        activityLevel: currentUser.activityLevel || '',
        dietType: currentUser.dietType || '',
        weight: currentUser.weight || '',
        height: currentUser.height || '',
      });
    }
  }, [isProfileEditOpen, currentUser]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setProfileForm({
      bloodGroup: profile.bloodGroup || '',
      allergies: profile.allergies || '',
      chronicConditions: profile.chronicConditions || '',
      emergencyContact: profile.emergencyContact || '',
      smokingHabit: profile.smokingHabit || '',
      drinkingHabit: profile.drinkingHabit || '',
      stressLevel: profile.stressLevel || '',
      sleepHours: profile.sleepHours || '',
      activityLevel: profile.activityLevel || '',
      dietType: profile.dietType || '',
      weight: profile.weight || '',
      height: profile.height || '',
    });
    setIsReminderDismissed(false);
    if (profile.role === 'doctor') {
      navigate('/portal/doctor-dashboard');
    } else if (profile.role === 'pharmacy') {
      navigate('/portal/pharmacy-dashboard');
    } else {
      navigate('/portal/dashboard');
    }
  };

  const handleLogOut = async () => {
    await supabase.auth.signOut(); // Ensure we tell Supabase to log out
    localStorage.removeItem('demo_user');
    setCurrentUser(null);
    setIsReminderDismissed(false);
    navigate('/');
  };

  const handleAddBooking = (booking: Booking) => {
    setUserBookings(prev => [booking, ...prev]);
  };

  const handleBookSpecialty = (specialty: string) => {
    setSpecialtyFilter(specialty);
    navigate('/portal/doctors');
    setIsSevaAiOpen(false);
  };

  const handleActivateSOS = () => {
    navigate('/portal/emergency');
    setIsSevaAiOpen(false);
  };

  const handleEnterModule = (tab: string) => {
    navigate(`/portal/${tab}`);
  };

  const handleSaveProfileExtras = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        bloodGroup: profileForm.bloodGroup || undefined,
        allergies: profileForm.allergies || undefined,
        chronicConditions: profileForm.chronicConditions || undefined,
        emergencyContact: profileForm.emergencyContact || undefined,
        smokingHabit: profileForm.smokingHabit || undefined,
        drinkingHabit: profileForm.drinkingHabit || undefined,
        stressLevel: profileForm.stressLevel || undefined,
        sleepHours: profileForm.sleepHours !== '' ? Number(profileForm.sleepHours) : undefined,
        activityLevel: profileForm.activityLevel || undefined,
        dietType: profileForm.dietType || undefined,
        weight: profileForm.weight !== '' ? Number(profileForm.weight) : undefined,
        height: profileForm.height !== '' ? Number(profileForm.height) : undefined,
      });
    }
    setIsProfileEditOpen(false);
  };

  const calculateProfileCompletion = () => {
    if (!currentUser) return 0;
    const fields: (keyof UserProfile)[] = [
      'bloodGroup', 'allergies', 'chronicConditions', 'emergencyContact',
      'smokingHabit', 'drinkingHabit', 'stressLevel', 'sleepHours',
      'activityLevel', 'dietType', 'weight', 'height'
    ];
    let completedCount = 0;
    fields.forEach(f => {
      const val = currentUser[f];
      if (val !== undefined && val !== null && val !== '' && val !== 'None') {
        completedCount++;
      }
    });
    const baseFieldsCount = 4;
    const totalFieldsCount = fields.length + baseFieldsCount;
    const filledBaseFields = 4;
    return Math.round(((filledBaseFields + completedCount) / totalFieldsCount) * 100);
  };

  const getIncompleteProfileSections = () => {
    if (!currentUser) return [];
    const missing: string[] = [];
    if (!currentUser.bloodGroup || !currentUser.allergies || !currentUser.chronicConditions || !currentUser.emergencyContact) {
      missing.push('Clinical Vitals');
    }
    if (!currentUser.smokingHabit || !currentUser.drinkingHabit || !currentUser.dietType) {
      missing.push('Habits & Diet');
    }
    if (!currentUser.stressLevel || !currentUser.sleepHours || !currentUser.activityLevel) {
      missing.push('Lifestyle & Stress');
    }
    if (!currentUser.weight || !currentUser.height) {
      missing.push('Body Metrics');
    }
    return missing;
  };

  const completionPercent = calculateProfileCompletion();

  // Show a loading spinner while waiting for Supabase to grab the secure session
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-[#f07b43] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Loading Secure Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans select-none antialiased">
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {activePage === 'landing' ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage
              onEnterApp={() => {
                if (!currentUser) {
                  navigate('/login'); 
                } else {
                  if (currentUser.role === 'doctor') {
                    navigate('/portal/doctor-dashboard');
                  } else if (currentUser.role === 'pharmacy') {
                    navigate('/portal/pharmacy-dashboard');
                  } else {
                    navigate('/portal/dashboard');
                  }
                }
              }}
              onEnterModule={(tab) => {
                if (!currentUser && tab !== 'symptoms' && tab !== 'emergency' && tab !== 'hospitals') {
                  navigate('/login'); 
                } else {
                  handleEnterModule(tab);
                }
              }}
              onTriggerAuth={() => navigate('/login')} 
              currentUser={currentUser}
              onLogOut={handleLogOut}
              onEnterBlogs={() => navigate('/blogs')}
            />
          </motion.div>
        ) : activePage === 'login' ? (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col min-h-screen"
          >
            <EmailLogin />
          </motion.div>
        ) : activePage === 'blogs' ? (
          <motion.div
            key="blogs-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-screen"
          >
            <BlogsPage
              onBack={() => navigate('/')}
              onArticleClick={(id) => console.log('Navigate to article', id)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="portal-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-screen"
          >
            <header className="glass-panel h-20 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30">
              <div
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-all"
                title="Go to Home Page"
              >
                <img src={logoImg} alt="SevaDharam Logo" className="h-8 w-auto object-contain" />
                <div>
                  <h1 className="font-bold text-sm text-neutral-900 tracking-tight uppercase leading-none">SevaDharam</h1>
                  <p className="text-[8px] font-mono font-bold uppercase text-neutral-400 tracking-widest mt-0.5">Clinical Care Portal</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                {currentUser && (
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Clinical Registry</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-700">
                          {currentUser.role === 'doctor' ? 'Doctor: ' : currentUser.role === 'pharmacy' ? 'Pharmacy: ' : 'Patient: '}
                          {currentUser.name}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
                {currentUser && (!currentUser.role || currentUser.role === 'patient') && (
                  <div
                    onClick={() => setIsProfileEditOpen(true)}
                    className="cursor-pointer p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 rounded-2xl flex items-center gap-3 transition-all"
                    title="Complete Progressive Profile"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Profile Status:</span>
                        <span className="text-[9px] font-bold text-brand">{completionPercent}%</span>
                      </div>
                      <div className="w-24 h-1 bg-neutral-200 rounded-2xl overflow-hidden">
                        <div className="h-full bg-brand transition-all duration-500" style={{ width: `${completionPercent}%` }} />
                      </div>
                    </div>
                    <Edit className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-700" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-2.5 md:px-3.5 py-2 glass-btn-secondary text-neutral-800 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
                  title="Return to Home Page"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Home</span>
                </button>

                {currentUser ? (
                  <>
                    <button
                      onClick={() => setIsProfileViewOpen(true)}
                      className="px-2.5 md:px-3.5 py-2 glass-btn-secondary text-neutral-800 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
                      title="View Patient Profile"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px]">Profile</span>
                    </button>

                    <button
                      onClick={handleLogOut}
                      className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-2xl transition-all cursor-pointer"
                      title="Logout Patient Portal"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')} 
                    className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-brand/20"
                  >
                    Log In
                  </button>
                )}
              </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
              <AnimatePresence mode="wait">
                {portalTab === 'dashboard' && (
                  <motion.div
                    key="portal-dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-64 h-64 bg-brand-soft rounded-full blur-3xl -z-10 opacity-40" />
                      <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
                          Namaste, <span className="italic font-serif text-brand font-medium">{currentUser?.name || 'Patient'}</span>!
                        </h2>
                        <p className="text-neutral-500 text-sm max-w-xl leading-normal">
                          Welcome back to SevaDharam. Use Seva AI to screen symptoms, consult panel doctors, parse diagnostics, and secure emergency ambulance dispatches.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSevaAiOpen(true)}
                        className="px-6 py-3.5 glass-btn-primary text-white text-xs font-bold uppercase tracking-widest rounded-2xl cursor-pointer flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Launch Seva AI Diagnostic</span>
                      </button>
                    </div>
                    {completionPercent < 100 && (
                      <div className="p-4 bg-brand-light border border-brand-soft rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-brand-dark">
                        <div className="flex items-center gap-2.5 text-xs">
                          <UserCheck className="w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-bold uppercase tracking-wider text-[10px]">Progressive Profile Completion</span>
                            <p className="opacity-90 text-[11px] mt-0.5">Adding allergies and blood group helps Seva AI compute hyper-specific dosage advice.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsProfileEditOpen(true)}
                          className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full"
                        >
                          Complete Profile
                        </button>
                      </div>
                    )}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Explore Healthcare Suites</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Tile 1: Symptom Checker */}
                        <div
                          onClick={() => navigate('/portal/symptoms')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconTriage} alt="Quick Symptom Analyser" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Quick Symptom Analyser</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Screen discomfort indexes and discover target care options.</p>
                          </div>
                        </div>
                        {/* Tile 2: Doctors index */}
                        <div
                          onClick={() => {
                            setSpecialtyFilter('');
                            navigate('/portal/doctors');
                          }}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconDoctor} alt="Certified Doctors Panel" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Certified Doctors Panel</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Schedule online/offline consultations across General & Advance tiers.</p>
                          </div>
                        </div>
                        {/* Tile 3: Prescription Analysis */}
                        <div
                          onClick={() => navigate('/portal/prescription')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconPrescription} alt="Prescription Analyser" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Prescription Analyser</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Upload handwritten drug slips to transcribe pills roster.</p>
                          </div>
                        </div>
                        {/* Tile 4: Medicine store & Reminders */}
                        <div
                          onClick={() => navigate('/portal/medicine')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconReminder} alt="Pharmacy & Alarms" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Pharmacy & Alarms</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Acquire medications and configure dosage alarm reminders.</p>
                          </div>
                        </div>
                        {/* Tile 5: Nearby Hospitals */}
                        <div
                          onClick={() => navigate('/portal/hospitals')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconHospital} alt="Hospital locator" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Hospital locator</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Live tracking of bed count availability across emergency rooms.</p>
                          </div>
                        </div>
                        {/* Tile 6: Diagnostics */}
                        <div
                          onClick={() => navigate('/portal/diagnostics')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconLab} alt="Home Lab Test kits" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Home Lab Test kits</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Book certified phlebotomist specimen collections from home.</p>
                          </div>
                        </div>
                        {/* Tile 7: Diagnostics report plain translator */}
                        <div
                          onClick={() => navigate('/portal/diagnostics')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconTranslator} alt="Diagnostic Report Simplifier" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Diagnostic Report Simplifier</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Decrypt complex diagnostics files into basic English metrics.</p>
                          </div>
                        </div>
                        {/* Tile 8: Medical history timeline */}
                        <div
                          onClick={() => navigate('/portal/history')}
                          className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-brand transition-all duration-300 cursor-pointer flex flex-col justify-between h-48 group"
                        >
                          <div className="flex items-center justify-center mb-2">
                            <img src={iconPassport} alt="Medical History" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-neutral-800 uppercase tracking-wider">Medical History</h4>
                            <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Timeline of consultations, active prescription records & passports.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {portalTab === 'symptoms' && (
                  <motion.div
                    key="portal-symptoms"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SymptomChecker
                      onBookSpecialty={handleBookSpecialty}
                      onActivateSOS={handleActivateSOS}
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                      currentUser={currentUser}
                    />
                  </motion.div>
                )}
                {portalTab === 'doctors' && (
                  <motion.div
                    key="portal-doctors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DoctorsSection
                      currentUser={currentUser}
                      onTriggerAuth={() => navigate('/login')} 
                      onAddBooking={handleAddBooking}
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                      initialSpecialtyFilter={specialtyFilter}
                    />
                  </motion.div>
                )}
                {portalTab === 'prescription' && (
                  <motion.div
                    key="portal-prescription"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PrescriptionAnalyzer
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                      currentUser={currentUser}
                    />
                  </motion.div>
                )}
                {portalTab === 'medicine' && (
                  <motion.div
                    key="portal-medicine"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MedicineStore
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                    />
                  </motion.div>
                )}
                {portalTab === 'hospitals' && (
                  <motion.div
                    key="portal-hospitals"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <HospitalLocator
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                      onActivateSOS={handleActivateSOS}
                    />
                  </motion.div>
                )}
                {portalTab === 'diagnostics' && (
                  <motion.div
                    key="portal-diagnostics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DiagnosticCenter
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                    />
                  </motion.div>
                )}
                {portalTab === 'history' && (
                  <motion.div
                    key="portal-history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MedicalHistoryView
                      currentUser={currentUser}
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                    />
                  </motion.div>
                )}
                {portalTab === 'emergency' && (
                  <motion.div
                    key="portal-emergency"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmergencySOS
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                    />
                  </motion.div>
                )}
                {portalTab === 'admin' && (
                  <motion.div
                    key="portal-admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AdminPage
                      onBackToDashboard={() => navigate('/portal/dashboard')}
                    />
                  </motion.div>
                )}
                {portalTab === 'doctor-dashboard' && currentUser && (
                  <motion.div
                    key="portal-doctor-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DoctorDashboard currentUser={currentUser} />
                  </motion.div>
                )}
                {portalTab === 'pharmacy-dashboard' && currentUser && (
                  <motion.div
                    key="portal-pharmacy-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PharmacyDashboard currentUser={currentUser} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
            <footer className="bg-[var(--color-navy)] text-white py-6 px-6 text-center text-xs mt-auto">
              <div className="flex items-center justify-center gap-2 mb-1.5 font-bold uppercase tracking-wider text-[10px] text-white/80">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Protected by active clinical security registries</span>
              </div>
              <p className="text-white/60">© 2026 SevaDharam Patient Care Platform. Meets clinical data privacy regulations.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive Profile edit Modal Drawer */}
      <AnimatePresence>
        {isProfileEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileEditOpen(false)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-neutral-100 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative z-10 space-y-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2 text-brand">
                  <UserCheck className="w-5 h-5" />
                  <h4 className="font-extrabold text-lg text-neutral-900 uppercase tracking-tight">Clinical & Lifestyle Intake</h4>
                </div>
                <button
                  onClick={() => setIsProfileEditOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSaveProfileExtras} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 border-b border-neutral-100 pb-2">
                  {[
                    { id: 'vitals', label: 'Vitals', step: '1' },
                    { id: 'habits', label: 'Habits', step: '2' },
                    { id: 'lifestyle', label: 'Lifestyle', step: '3' },
                    { id: 'metrics', label: 'Metrics', step: '4' }
                  ].map((tab) => {
                    const isActive = activeModalSection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveModalSection(tab.id as any)}
                        className={`py-2 text-center border-b-2 transition-all cursor-pointer ${isActive ? 'border-brand text-brand font-bold' : 'border-transparent text-neutral-400 hover:text-neutral-600 font-medium'
                          }`}
                      >
                        <p className="text-[10px] uppercase tracking-wider leading-none">{tab.label}</p>
                        <span className="text-[8px] font-mono opacity-60 block mt-1">Part {tab.step}</span>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait">
                  {activeModalSection === 'vitals' && (
                    <motion.div
                      key="vitals"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 pt-1"
                    >
                      <div className="border-b border-neutral-100 pb-1">
                        <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest block">Section 1: Clinical Vitals</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Blood Group</label>
                          <select
                            value={profileForm.bloodGroup}
                            onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          >
                            <option value="">Select Group</option>
                            {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map(bg => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Emergency Contact</label>
                          <input
                            type="tel"
                            value={profileForm.emergencyContact}
                            onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Drug & Food Allergies</label>
                        <input
                          type="text"
                          value={profileForm.allergies}
                          onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                          placeholder="e.g., Penicillin, Peanuts, Sulfa, None"
                          className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Chronic Conditions</label>
                        <input
                          type="text"
                          value={profileForm.chronicConditions}
                          onChange={(e) => setProfileForm({ ...profileForm, chronicConditions: e.target.value })}
                          placeholder="e.g., Hypertension, Diabetes, Thyroid, None"
                          className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                        />
                      </div>
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('habits')}
                          className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                        >
                          <span>Continue to Habits & Diet</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {activeModalSection === 'habits' && (
                    <motion.div
                      key="habits"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 pt-1"
                    >
                      <div className="border-b border-neutral-100 pb-1">
                        <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest block">Section 2: Habits & Diet</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Smoking Habit</label>
                          <select
                            value={profileForm.smokingHabit}
                            onChange={(e) => setProfileForm({ ...profileForm, smokingHabit: e.target.value as any })}
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          >
                            <option value="">Select Status</option>
                            <option value="Non-smoker">Non-smoker</option>
                            <option value="Occasional">Occasional</option>
                            <option value="Heavy">Heavy</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Drinking Habit</label>
                          <select
                            value={profileForm.drinkingHabit}
                            onChange={(e) => setProfileForm({ ...profileForm, drinkingHabit: e.target.value as any })}
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          >
                            <option value="">Select Status</option>
                            <option value="Non-drinker">Non-drinker</option>
                            <option value="Social">Social</option>
                            <option value="Regular">Regular</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Diet Preference</label>
                        <select
                          value={profileForm.dietType}
                          onChange={(e) => setProfileForm({ ...profileForm, dietType: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                        >
                          <option value="">Select Diet</option>
                          <option value="Veg">Vegetarian</option>
                          <option value="Non-Veg">Non-Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('vitals')}
                          className="flex-1 py-3.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('lifestyle')}
                          className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {activeModalSection === 'lifestyle' && (
                    <motion.div
                      key="lifestyle"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 pt-1"
                    >
                      <div className="border-b border-neutral-100 pb-1">
                        <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest block">Section 3: Lifestyle & Stress</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Daily Sleep (hrs)</label>
                          <input
                            type="number"
                            min="1"
                            max="24"
                            value={profileForm.sleepHours}
                            onChange={(e) => setProfileForm({ ...profileForm, sleepHours: e.target.value !== '' ? Number(e.target.value) : '' })}
                            placeholder="e.g., 7"
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Stress Level</label>
                          <select
                            value={profileForm.stressLevel}
                            onChange={(e) => setProfileForm({ ...profileForm, stressLevel: e.target.value as any })}
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          >
                            <option value="">Select Level</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Physical Activity Level</label>
                        <select
                          value={profileForm.activityLevel}
                          onChange={(e) => setProfileForm({ ...profileForm, activityLevel: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                        >
                          <option value="">Select Level</option>
                          <option value="Sedentary">Sedentary (Minimal Movement)</option>
                          <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                          <option value="Highly Active">Highly Active (Daily Exercise)</option>
                        </select>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('habits')}
                          className="flex-1 py-3.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('lifestyle')}
                          className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {activeModalSection === 'metrics' && (
                    <motion.div
                      key="metrics"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 pt-1"
                    >
                      <div className="border-b border-neutral-100 pb-1">
                        <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest block">Section 4: Body Metrics</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            min="1"
                            max="300"
                            value={profileForm.weight}
                            onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value !== '' ? Number(e.target.value) : '' })}
                            placeholder="e.g., 70"
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Height (cm)</label>
                          <input
                            type="number"
                            min="30"
                            max="250"
                            value={profileForm.height}
                            onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value !== '' ? Number(e.target.value) : '' })}
                            placeholder="e.g., 175"
                            className="w-full px-3 py-2.5 rounded-full border border-neutral-200 outline-none focus:border-brand bg-neutral-50 text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div className="pt-4 flex gap-3 sticky bottom-0 bg-white z-10 pb-2">
                        <button
                          type="button"
                          onClick={() => setActiveModalSection('lifestyle')}
                          className="flex-1 py-4 border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-[2] py-4 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center"
                        >
                          Save Clinical & Lifestyle Profile
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Complete Profile Reminder Banner */}
      <AnimatePresence>
        {currentUser && (!currentUser.role || currentUser.role === 'patient') && activePage === 'portal' && completionPercent < 100 && !isReminderDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 border-t border-neutral-800 shadow-2xl py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-white"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center text-brand shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest">PORTAL SECURE COMPLIANCE</span>
                  <span className="bg-brand/20 text-brand px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest">{completionPercent}% Complete</span>
                </div>
                <p className="text-xs text-neutral-300 font-medium leading-normal">
                  Complete your lifestyle & clinical profile details ({getIncompleteProfileSections().join(', ')}) to get better diagnosis & customized care.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={() => setIsProfileEditOpen(true)}
                className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-full flex items-center gap-1.5"
              >
                <span>Complete Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsReminderDismissed(true)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all rounded-full"
                title="Dismiss for now"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SevaAIBot
        isOpen={isSevaAiOpen}
        onToggle={() => setIsSevaAiOpen(!isSevaAiOpen)}
        onBookSpecialty={handleBookSpecialty}
        onActivateSOS={handleActivateSOS}
        currentUser={currentUser}
      />

      <AnimatePresence>
        {isProfileViewOpen && currentUser && (
          <UserProfileModal
            isOpen={isProfileViewOpen}
            onClose={() => setIsProfileViewOpen(false)}
            currentUser={currentUser}
            completionPercent={completionPercent}
            onEditClick={() => setIsProfileEditOpen(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}