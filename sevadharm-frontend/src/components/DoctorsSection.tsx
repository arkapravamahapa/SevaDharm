import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Award, Clock, DollarSign, Calendar as CalendarIcon, Check, BadgeCheck, FileText, ArrowLeft, CreditCard, Download, UserCheck, RefreshCw, AlertTriangle, UserPlus } from 'lucide-react';
import { Doctor, Booking, UserProfile } from '../types';
import { supabase } from '../supabase';

interface DoctorsSectionProps {
  onBackToDashboard?: () => void;
  currentUser: UserProfile | null;
  onTriggerAuth: () => void;
  onAddBooking: (booking: Booking) => void;
  initialSpecialtyFilter?: string;
}

// Helper to generate rolling available dates starting from today
const generateUpcomingDates = () => {
  return Array.from({ length: 7 }).map((_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    
    return {
      date: `${yyyy}-${mm}-${dd}`,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      status: offset >= 5 ? 'Few Slots' : 'Available'
    };
  });
};

export default function DoctorsSection({ 
  onBackToDashboard, 
  currentUser, 
  onTriggerAuth, 
  onAddBooking,
  initialSpecialtyFilter = '' 
}: DoctorsSectionProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialtyFilter);
  const [selectedTier, setSelectedTier] = useState<'All' | 'General' | 'Advance'>('All');
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState<'browse' | 'details' | 'schedule' | 'payment' | 'confirmation'>('browse');
  
  // Dynamically generate dates
  const upcomingDates = useMemo(() => generateUpcomingDates(), []);
  
  // Booking selections
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState<'online' | 'offline'>('online');
  
  // Payment states
  const [isPaying, setIsPaying] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  // SECTION 13 COMPLIANCE: Terms & Conditions Checkbox
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Fetch live doctors directly from Supabase Enterprise Registry
  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false });

      if (supabaseError) throw new Error(supabaseError.message);
      
      const mappedDoctors: Doctor[] = (data || []).map((doc: any) => {
        const bioParts = doc.bio ? doc.bio.split(' | ') : [];
        const parsedSpecialty = bioParts.length > 1 ? bioParts[0] : 'General Physician';
        const parsedDescription = bioParts.length > 1 ? bioParts[1] : doc.bio;

        let parsedSlots: string[] = [];
        if (Array.isArray(doc.available_slots)) {
          parsedSlots = doc.available_slots;
        } else if (typeof doc.available_slots === 'string' && doc.available_slots.trim() !== '') {
          try {
             const parsed = JSON.parse(doc.available_slots);
             if (Array.isArray(parsed)) parsedSlots = parsed;
          } catch(e) {
             parsedSlots = doc.available_slots.split(',').map((s: string) => s.trim());
          }
        }

        return {
          id: doc.id,
          name: doc.full_name || 'Unnamed Practitioner',
          specialty: parsedSpecialty,
          qualification: 'MBBS, MD',
          experience: doc.experience || 5, 
          rating: 4.8, 
          fee: doc.fee || 500, 
          tier: (doc.experience || 0) >= 10 ? 'Advance' : 'General', 
          image: doc.avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
          description: parsedDescription || 'Verified medical professional in the Seva Dharm network.',
          availableSlots: parsedSlots, 
          availableDays: Array.isArray(doc.available_days) && doc.available_days.length > 0
            ? doc.available_days 
            : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        };
      });
      
      setDoctors(mappedDoctors);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || doc.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleStartBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot('');
    setBookingStep('details');
  };

  const handleProceedToSchedule = () => {
    if (!currentUser) {
      onTriggerAuth();
      return;
    }
    if (!selectedDate) {
      setSelectedDate(upcomingDates[0].date);
    }
    setBookingStep('schedule');
  };

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      alert('Please select a preferred time slot.');
      return;
    }
    // Reset terms acceptance when entering payment screen
    setAcceptedTerms(false);
    setBookingStep('payment');
  };

  const calculateFees = (docFee: number) => {
    const platformFee = Math.round(docFee * 0.20);
    const totalFee = docFee + platformFee;
    return { docFee, platformFee, totalFee };
  };

  const handlePayAndConfirm = async () => {
    if (!selectedDoctor) return;
    setIsPaying(true);
    
    try {
      const fees = calculateFees(selectedDoctor.fee);
      
      const scheduledDateTime = new Date(`${selectedDate} ${selectedSlot}`).toISOString();
      const bookingId = `b-${Math.random().toString(36).slice(2, 9)}`;

      const { error: dbError } = await supabase.from('appointments').insert({
        id: bookingId,
        doctor_id: selectedDoctor.id,
        patient_id: (currentUser as any)?.id, 
        patient_name: currentUser?.name || 'SevaDharam Patient',
        patient_email: currentUser?.email || '',
        scheduled_at: scheduledDateTime,
        status: 'scheduled',
        appointment_type: consultType === 'online' ? 'Video Consult' : 'In-Person Visit'
      });

      if (dbError) throw dbError;

      const newBooking: Booking = {
        id: bookingId,
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: consultType,
        doctorFee: fees.docFee,
        platformFee: fees.platformFee,
        totalFee: fees.totalFee,
        status: 'upcoming',
        bookingTime: new Date().toLocaleString()
      };

      onAddBooking(newBooking);
      setLatestBooking(newBooking);
      setBookingStep('confirmation');

    } catch (err: any) {
      console.error("Booking Error: ", err);
      alert(`Failed to confirm booking: ${err.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const downloadICS = () => {
    if (!latestBooking) return;
    const { doctor, date, timeSlot, type } = latestBooking;
    
    const formattedDate = date.replace(/-/g, '');
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SevaDharam//NONSGML Consultation//EN
BEGIN:VEVENT
UID:${latestBooking.id}
DTSTAMP:${formattedDate}T000000Z
DTSTART:${formattedDate}T100000Z
DTEND:${formattedDate}T110000Z
SUMMARY:SevaDharam ${type === 'online' ? 'Video' : 'In-Person'} Consultation with ${doctor.name}
DESCRIPTION:Specialty: ${doctor.specialty}\\nTime: ${timeSlot}\\nPlatform Fee Paid. Please keep documents ready.
LOCATION:${type === 'online' ? 'SevaDharam Virtual Room' : doctor.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SevaDharam_Consultation_${doctor.name.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* Step 1: Browse Doctors */}
        {bookingStep === 'browse' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header / Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-neutral-900">Find Certified Practitioners</h3>
                <p className="text-neutral-500 text-sm">Live database registry of certified medical specialists.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedTier('All')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === 'All' ? 'bg-neutral-900 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  All Tiers
                </button>
                <button 
                  onClick={() => setSelectedTier('General')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === 'General' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  General Care
                </button>
                <button 
                  onClick={() => setSelectedTier('Advance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTier === 'Advance' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  Advance Care
                </button>
                <button 
                  onClick={fetchDoctors}
                  className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-all cursor-pointer"
                  title="Refresh Database"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Search and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search doctor or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-2xl border border-neutral-200 rounded-2xl outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-sm"
                />
              </div>

              {/* Specialty quick select */}
              <div className="md:col-span-2 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                {specialties.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec === 'All' ? '' : spec)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      (!selectedSpecialty && spec === 'All') || selectedSpecialty === spec
                        ? 'bg-brand/10 border border-brand/30 text-brand'
                        : 'bg-white/80 backdrop-blur-2xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doctor => (
                <motion.div 
                  key={doctor.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-5 flex gap-4">
                    {/* Doctor Avatar */}
                    <div className="relative shrink-0">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-20 h-20 rounded-2xl object-cover border border-neutral-100"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-extrabold tracking-wide text-white uppercase ${
                        doctor.tier === 'Advance' ? 'bg-indigo-600' : 'bg-brand'
                      }`}>
                        {doctor.tier}
                      </span>
                    </div>

                    {/* Quick Specs */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-brand uppercase tracking-wider">{doctor.specialty}</span>
                        {doctor.tier === 'Advance' && <BadgeCheck className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <h4 className="font-bold text-base text-neutral-900">{doctor.name}</h4>
                      <p className="text-xs text-neutral-500 font-medium leading-tight">{doctor.qualification}</p>
                      
                      {/* Rating / Experience */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span className="text-xs font-bold text-neutral-800">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Award className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold text-neutral-600">{doctor.experience} yrs exp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Foot section with Booking CTA */}
                  <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">CONSULTATION FEE</span>
                      <span className="text-lg font-mono font-bold text-neutral-800">₹{doctor.fee}</span>
                    </div>
                    <button 
                      onClick={() => handleStartBooking(doctor)}
                      className="px-4.5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      View Profile & Book
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* UPDATED: "Coming Soon" Maintenance State */}
              {!isLoading && filteredDoctors.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-brand/20 bg-brand-light/30 rounded-3xl flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Clock className="w-8 h-8 text-brand animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-neutral-900">Medical Panel Coming Soon</h3>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                      The live booking panel will be restored shortly.
                    </p>
                  </div>
                  <div className="inline-block px-4 py-2 mt-2 rounded-full bg-orange-100 text-brand-dark text-xs font-bold tracking-wider uppercase">
                    Status: Compliance Update
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Doctor Details View */}
        {bookingStep === 'details' && selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-3xl mx-auto bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-xl"
          >
            {/* Header image background */}
            <div className="h-28 bg-gradient-to-r from-brand-soft to-orange-100 relative">
              <button 
                onClick={() => setBookingStep('browse')}
                className="absolute left-6 top-6 p-2 bg-white rounded-xl shadow-md text-neutral-600 hover:text-neutral-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 pt-0 relative">
              {/* Doctor Header Profile */}
              <div className="flex flex-col sm:flex-row gap-6 -mt-12 items-start sm:items-end mb-6">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-brand-soft text-brand rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {selectedDoctor.specialty}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                      selectedDoctor.tier === 'Advance' ? 'bg-indigo-600' : 'bg-brand'
                    }`}>
                      {selectedDoctor.tier} Care
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-neutral-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-neutral-500 font-semibold">{selectedDoctor.qualification}</p>
                </div>
              </div>

              {/* Doctor Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-neutral-100 mb-6">
                <div className="text-center p-3 bg-neutral-50 rounded-2xl">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider mb-0.5">Rating</span>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    <span className="font-bold text-neutral-800 text-sm">{selectedDoctor.rating}</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-2xl">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider mb-0.5">Experience</span>
                  <span className="font-extrabold text-neutral-800 text-sm">{selectedDoctor.experience} Years</span>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-2xl">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider mb-0.5">Base Fee</span>
                  <span className="font-mono font-extrabold text-neutral-800 text-sm">₹{selectedDoctor.fee}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-2">Professional Biography</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{selectedDoctor.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wide mb-2">Patient Security & Compliance</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    Consultations are protected by active medical privacy legislation. Data is stored locally within your secure SevaDharam profile. Platform features 256-bit encrypted telemedicine lines.
                  </p>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setBookingStep('browse')}
                  className="flex-1 py-3.5 border border-neutral-200 text-neutral-600 hover:text-neutral-800 rounded-2xl text-sm font-bold transition-all cursor-pointer text-center"
                >
                  Back to Doctors
                </button>
                <button 
                  onClick={handleProceedToSchedule}
                  className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-sm font-bold transition-all cursor-pointer text-center"
                >
                  Configure Time Slot
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Calendar & Slot Selection */}
        {bookingStep === 'schedule' && selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-100 p-8 shadow-xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBookingStep('details')}
                className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:text-neutral-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold text-neutral-900">Schedule Appointment</h3>
            </div>

            {/* Choose Consult Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Consultation Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setConsultType('online')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    consultType === 'online' ? 'border-brand bg-brand-light' : 'border-neutral-100 hover:border-neutral-200 bg-white'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-900">Online Video Call</span>
                  <span className="text-[11px] text-neutral-500">HIPAA secure virtual clinic session</span>
                </button>
                <button 
                  onClick={() => setConsultType('offline')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    consultType === 'offline' ? 'border-brand bg-brand-light' : 'border-neutral-100 hover:border-neutral-200 bg-white'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-900">In-Person Visit</span>
                  <span className="text-[11px] text-neutral-500">Consult at registered clinic chambers</span>
                </button>
              </div>
            </div>

            {/* Date Picker (Dynamic from Today) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Available Dates</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {upcomingDates.slice(0,3).map((item) => (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDate(item.date)}
                    className={`p-3.5 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                      selectedDate === item.date ? 'border-brand bg-brand-light' : 'border-neutral-100 hover:border-neutral-200 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold block text-neutral-800">{item.label}</span>
                    <span className="text-[10px] text-neutral-400 mt-1 block">{item.status}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker (Pulled from Doctor profile) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Available Time Slots</label>
              
              {selectedDoctor.availableSlots.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center text-xs text-neutral-500 bg-neutral-50 font-medium">
                  This doctor has not configured any available time slots yet. Please check back later.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedDoctor.availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl font-mono text-xs font-semibold border-2 transition-all cursor-pointer text-center ${
                        selectedSlot === slot ? 'border-brand bg-brand text-white' : 'border-neutral-100 hover:border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proceed */}
            <button 
              onClick={handleProceedToPayment}
              disabled={!selectedSlot}
              className="w-full py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl shadow-lg shadow-brand/10 hover:shadow-brand/20 transition-all disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        )}

        {/* Step 4: Checkout & Fee Itemization */}
        {bookingStep === 'payment' && selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md mx-auto bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBookingStep('schedule')}
                className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:text-neutral-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold text-neutral-900">Checkout Summary</h3>
            </div>

            {/* Brief info */}
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
              <img src={selectedDoctor.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-sm text-neutral-800">{selectedDoctor.name}</h4>
                <p className="text-xs text-neutral-500">{selectedDoctor.specialty} • {consultType === 'online' ? 'Video Consult' : 'In-Person Chamber'}</p>
                <p className="text-xs text-brand font-medium font-mono mt-0.5">{selectedDate} at {selectedSlot}</p>
              </div>
            </div>

            {/* Transparency Fee Breakdown */}
            <div className="space-y-3.5 py-4 border-y border-neutral-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Doctor Consultation Fee</span>
                <span className="font-mono text-neutral-800 font-bold">₹{selectedDoctor.fee}.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Platform Fee (20%)</span>
                <span className="font-mono text-neutral-800 font-bold">₹{calculateFees(selectedDoctor.fee).platformFee}.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-medium">Clinical GST/Taxes</span>
                <span className="font-mono text-brand font-medium">FREE</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-dashed border-neutral-100">
                <span className="text-neutral-950 font-bold text-base">Total Amount Payable</span>
                <span className="font-mono text-brand font-extrabold text-xl">₹{calculateFees(selectedDoctor.fee).totalFee}.00</span>
              </div>
            </div>

            {/* NEW SECTION 13: Mandatory Legal Checkbox */}
            <div className="flex items-start gap-3 bg-red-50 p-3.5 rounded-xl border border-red-100">
              <input 
                type="checkbox" 
                id="refund-terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-brand bg-white border-neutral-300 rounded focus:ring-brand cursor-pointer"
              />
              <label htmlFor="refund-terms" className="text-[11px] text-neutral-600 font-medium leading-relaxed cursor-pointer select-none">
                I agree to the SevaDharam <span className="font-bold text-neutral-800">Cancellation & Refund Policy</span> (Section 12 & 13). 
                I understand that cancellations within 72 hours of the schedule, or failing to join a call, are <strong className="text-red-600">non-refundable</strong>.
              </label>
            </div>

            {/* Payment simulation button */}
            <button
              onClick={handlePayAndConfirm}
              disabled={isPaying || !acceptedTerms}
              className="w-full py-4.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-2xl shadow-lg shadow-success/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment Securely...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Now & Confirm Slot</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Step 5: Booking Confirmation Screen */}
        {bookingStep === 'confirmation' && latestBooking && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto bg-white rounded-3xl border border-neutral-100 p-8 shadow-2xl text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center text-brand animate-bounce">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-neutral-900">Appointment Booked!</h3>
              <p className="text-neutral-500 text-sm">Your medical consult is confirmed on our registry.</p>
            </div>

            {/* Medical Receipt details */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-bold uppercase">RECEIPT ID</span>
                <span className="font-mono text-neutral-700 font-bold">{latestBooking.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-bold uppercase">PRACTITIONER</span>
                <span className="font-semibold text-neutral-800">{latestBooking.doctor.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-bold uppercase">TIME & SLOT</span>
                <span className="font-mono text-neutral-700 font-bold">{latestBooking.date} @ {latestBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-bold uppercase">CONSULT TYPE</span>
                <span className="font-bold text-neutral-800 uppercase text-[10px] bg-brand-soft text-brand px-2 py-0.5 rounded-full">{latestBooking.type}</span>
              </div>
              <div className="border-t border-neutral-200/50 pt-2.5 flex justify-between text-sm">
                <span className="text-neutral-700 font-bold">Paid Successfully</span>
                <span className="font-mono text-brand font-extrabold">₹{latestBooking.totalFee}.00</span>
              </div>
            </div>

            {/* Action block */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={downloadICS}
                className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save to Calendar (.ics)</span>
              </button>
              <button
                onClick={() => {
                  setBookingStep('browse');
                  if (onBackToDashboard) onBackToDashboard();
                }}
                className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold shadow-lg shadow-brand/10 transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}