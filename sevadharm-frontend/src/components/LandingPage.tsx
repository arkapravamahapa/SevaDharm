import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import {
  Heart, ShieldCheck, Activity, Award, Star, Target, Users,
  Stethoscope, Microscope, Pill, FileText,
  MapPin, Clock, History, UserCheck, AlertTriangle, Sparkles, ChevronRight, BookOpen, Volume2, Menu, X
} from 'lucide-react';
import { TESTIMONIALS, BLOGS, DOCTORS } from '../data';
import heroDoctor from '@/assets/hero-doctor.png';
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

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterModule: (moduleTab: string) => void;
  onTriggerAuth: () => void;
  currentUser: any;
  onLogOut: () => void;
  onEnterBlogs?: () => void;
}

export default function LandingPage({ onEnterApp, onEnterModule, onTriggerAuth, currentUser, onLogOut, onEnterBlogs }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stagger animation helpers
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 }
    }
  };

  // Pop-in variant for entire sections — scale up from smaller + fade in
  const sectionPopVariants: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
        mass: 0.8
      }
    }
  };

  // Card pop — slightly more dramatic for individual cards
  const cardPopVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.88 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const services = [
    { title: 'Online Symptom Checker', icon: iconTriage, desc: 'Check your symptoms instantly with AI-powered analysis and get guidance on the next steps.', tab: 'symptoms', color: 'text-brand bg-brand-soft border-brand/20' },
    { title: 'Doctor Consultations', icon: iconDoctor, desc: 'Schedule certified practitioners across General or Advance tiers.', tab: 'doctors', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { title: 'Online Prescription Reader', icon: iconPrescription, desc: 'Upload your prescription online to read medicines, dosages, and instructions with AI-powered assistance.', tab: 'prescription', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { title: 'Medicine Reminders', icon: iconReminder, desc: 'Track formulations, configure alarms, and avoid dosage gaps.', tab: 'medicine', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Nearby Hospitals Locator', icon: iconHospital, desc: 'View distance metrics and real-time bed count tracking.', tab: 'hospitals', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { title: 'Diagnostic Labs Index', icon: iconLab, desc: 'Book blood/fever kits for home sample collection.', tab: 'diagnostics', color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { title: 'Lab Report Analyzer', icon: iconTranslator, desc: 'Upload your lab reports to understand test results, key health indicators, and what they may mean.', tab: 'diagnostics', color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { title: 'Medical History', icon: iconPassport, desc: 'Timeline storage for all clinical history, bills and prescriptions.', tab: 'history', color: 'text-neutral-700 bg-neutral-100 border-neutral-200' },
    { title: 'Complete Patient Profile', icon: iconProfile, desc: 'Fulfill details to customize specialized dosage parameters.', tab: 'history', color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' },
    { title: 'Emergency SOS Protocol', icon: iconEmergency, desc: 'Immediate automated ambulance dispatch with arrival ETA.', tab: 'emergency', color: 'text-emergency bg-emergency-soft border-emergency-soft' }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Sticky Header Navbar */}
      <nav className="sticky top-0 z-30 glass-panel h-20 px-6 md:px-12 flex items-center justify-between">
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-all"
          title="Go to Top"
        >
          <img src={logoImg} alt="Seva Dharam Logo" className="h-8 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight uppercase text-neutral-900">Seva Dharam</span>
        </div>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="#services" className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/60 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-700 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <Activity className="w-3.5 h-3.5" />
            Services
          </a>
          <a href="#doctors" className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/60 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-700 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <Users className="w-3.5 h-3.5" />
            Panel
          </a>
          <a href="#pricing" className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/60 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-700 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            Plans
          </a>
          {onEnterBlogs && (
            <button onClick={onEnterBlogs} className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white/60 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-700 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <BookOpen className="w-3.5 h-3.5" />
              Blogs
            </button>
          )}
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-700">Namaste, {currentUser.name}</span>
              <button
                onClick={onEnterApp}
                className="px-5 py-2 glass-btn-primary text-white text-xs font-bold uppercase tracking-widest cursor-pointer rounded-2xl"
              >
                Enter Portal
              </button>
              <button
                onClick={onLogOut}
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onTriggerAuth}
                className="px-5 py-2 glass-btn-secondary text-neutral-800 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-2xl"
              >
                Login
              </button>
              <button
                onClick={onEnterApp}
                className="px-5 py-2 glass-btn-primary text-white text-xs font-bold uppercase tracking-widest cursor-pointer rounded-2xl"
              >
                Start Now
              </button>
            </>
          )}
          <button 
            className="lg:hidden p-2 text-neutral-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-100 z-20 px-6 py-6 space-y-4 shadow-xl">
          <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-800 font-bold uppercase tracking-wider text-xs">
            <Activity className="w-5 h-5 text-brand" /> Services
          </a>
          <a href="#doctors" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-800 font-bold uppercase tracking-wider text-xs">
            <Users className="w-5 h-5 text-brand" /> Panel
          </a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-800 font-bold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-5 h-5 text-brand" /> Plans
          </a>
          {onEnterBlogs && (
            <button onClick={() => { setIsMobileMenuOpen(false); onEnterBlogs(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-800 font-bold uppercase tracking-wider text-xs text-left">
              <BookOpen className="w-5 h-5 text-brand" /> Blogs
            </button>
          )}
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="lg:col-span-7 space-y-8"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tighter mb-4 text-neutral-900">
              Virtual Medical Assistant for Smarter Healthcare
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-8 text-neutral-800">
              Seva Pehle, <span className="italic text-brand">Dharam Hamesha</span>
            </h2>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-xl">
              Your AI-powered virtual medical assistant for understanding symptoms, consulting doctors, analyzing prescriptions, and simplifying diagnostic reports.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onEnterApp}
              className="px-6 py-3 glass-btn-primary text-white text-xs font-bold uppercase tracking-widest cursor-pointer rounded-2xl"
            >
              Consult a Doctor
            </button>
            <button
              onClick={() => onEnterModule('symptoms')}
              className="px-6 py-3 glass-btn-secondary text-neutral-700 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-2xl"
            >
              Analyze Symptoms Free
            </button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-neutral-100 max-w-lg">
            <div className="flex flex-col">
              <span className="text-3xl font-light tracking-tight text-neutral-900">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">HIPAA Secure</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-light tracking-tight text-neutral-900">12k+</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Cured Patients</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-light tracking-tight text-neutral-900">4.9★</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">User Rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side interactive graphic simulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <img
            src={heroDoctor}
            alt="Seva Dharam Healthcare Platform"
            className="w-full max-w-lg object-contain"
          />
        </motion.div>
      </section>

      {/* 3. SERVICES SHOWCASE GRID */}
      <motion.section
        id="services"
        className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionPopVariants}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          className="text-center space-y-2 max-w-xl mx-auto"
        >
          <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block">VIRTUAL HEALTHCARE SERVICES</span>
          <h2 className="text-3xl font-light tracking-tight text-neutral-900">AI-Powered Healthcare Ecosystem</h2>
          <p className="text-neutral-500 text-xs leading-normal">
            Everything your family requires to monitor health parameters, purchase genuine formulations, and request immediate emergency responders.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {services.map((serv, idx) => (
            <motion.div
              key={idx}
              variants={cardPopVariants}
              whileHover={{ y: -8, borderColor: 'var(--color-brand)', boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.15)' }}
              onClick={() => onEnterModule(serv.tab)}
              className="p-6 bg-white/80 backdrop-blur-2xl border border-neutral-100 rounded-2xl transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-2">
                  <img src={serv.icon} alt={serv.title} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform mix-blend-multiply contrast-[1.2] brightness-[1.1]" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-sm leading-tight uppercase tracking-wider">{serv.title}</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-2">{serv.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold text-brand mt-6 uppercase tracking-widest group-hover:underline">
                <span>Access</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 4. DOCTOR CAROUSEL / HIGHLIGHT */}
      <motion.section
        id="doctors"
        className="bg-neutral-50 py-20 border-y border-neutral-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionPopVariants}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          >
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block">CREDENTIAL VERIFIED MEDICAL PANEL</span>
              <h3 className="text-3xl font-light tracking-tight text-neutral-900">Our Leading Practitioners</h3>
              <p className="text-xs text-neutral-500">Book direct consultations with senior consultants at standard rates.</p>
            </div>
            <button
              onClick={() => onEnterModule('doctors')}
              className="px-5 py-3 glass-btn-secondary text-neutral-700 rounded-2xl text-xs font-bold uppercase tracking-widest cursor-pointer shrink-0"
            >
              View Full Panel ({DOCTORS.length})
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {DOCTORS.slice(0, 3).map(doctor => (
              <motion.div
                key={doctor.id}
                variants={cardPopVariants}
                whileHover={{ y: -8, borderColor: 'var(--color-brand)', boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.15)' }}
                className="bg-white/80 backdrop-blur-2xl rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col justify-between transition-all"
              >
                <div className="p-6 flex gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 grayscale hover:grayscale-0 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand uppercase tracking-widest">{doctor.specialty}</span>
                    <h4 className="font-bold text-sm text-neutral-800 leading-tight uppercase tracking-wider">{doctor.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-medium">{doctor.qualification}</p>

                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-neutral-800">{doctor.rating}</span>
                      </div>
                      <span className="text-neutral-400 font-medium text-[10px] uppercase tracking-wide">{doctor.experience} Yrs Exp</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-700">₹{doctor.fee} BASE FEE</span>
                  <button
                    onClick={() => onEnterModule('doctors')}
                    className="px-4 py-2 glass-btn-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl cursor-pointer"
                  >
                    Schedule
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 5. PRICING / PLANS BAND */}
      <motion.section
        id="pricing"
        className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionPopVariants}
      >
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        >
          <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block">SECURE FAMILY COVERAGE</span>
          <h3 className="text-3xl font-light tracking-tight text-neutral-900">Simple Patient Care Tiers</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">No complex lock-ins. Pay for what you consume or select a holistic care tier.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* General Tier */}
          <motion.div
            variants={cardPopVariants}
            whileHover={{ y: -8, borderColor: 'var(--color-brand)', boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.15)' }}
            className="p-8 rounded-2xl border border-neutral-100 bg-white shadow-sm space-y-6 flex flex-col justify-between transition-all"
          >
            <div className="space-y-4">
              <span className="px-3 py-1 bg-brand-soft text-brand rounded-2xl text-[9px] font-bold uppercase tracking-widest">GENERAL ACCESSIBILITY</span>
              <div>
                <h4 className="text-xl font-bold uppercase tracking-wider text-neutral-900">Standard Care Panel</h4>
                <p className="text-xs text-neutral-400 mt-1">Pay-per-consult model for primary day-to-day general practitioners.</p>
              </div>

              <div className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-500 bg-neutral-50 p-3 border border-neutral-100 text-center">
                Rates visible per doctor
              </div>

              <ul className="text-xs text-neutral-500 space-y-3 pt-4 border-t border-neutral-100">
                <li className="flex items-center gap-2">✓ Verified general clinical specialists</li>
                <li className="flex items-center gap-2">✓ Dynamic 24/7 symptom triage & Seva AI access</li>
                <li className="flex items-center gap-2">✓ Upload handwriting prescription analyzing</li>
                <li className="flex items-center gap-2">✓ Map locator bed counts monitoring</li>
              </ul>
            </div>

            <button
              onClick={onEnterApp}
              className="w-full py-3 glass-btn-secondary text-neutral-900 font-bold text-xs uppercase tracking-widest rounded-2xl cursor-pointer"
            >
              Browse General Doctors
            </button>
          </motion.div>

          {/* Advance Tier */}
          <motion.div
            variants={cardPopVariants}
            whileHover={{ y: -8, boxShadow: '0 15px 35px -10px rgba(224, 90, 16, 0.2)' }}
            className="p-8 rounded-2xl border-2 border-brand bg-white shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden transition-all"
          >
            <span className="absolute top-4 right-4 bg-brand text-white px-2.5 py-1 text-[8px] font-bold tracking-widest uppercase rounded-2xl">POPULAR CHANNELS</span>

            <div className="space-y-4">
              <span className="px-3 py-1 bg-brand text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest">ADVANCED SPECIALTY</span>
              <div>
                <h4 className="text-xl font-bold uppercase tracking-wider text-neutral-900">Senior Consultations</h4>
                <p className="text-xs text-neutral-400 mt-1">Direct access lines to board-certified cardiologists, neurologists, and gynecologists.</p>
              </div>

              <div className="text-sm font-mono font-bold uppercase tracking-wider text-brand-dark bg-brand-soft p-3 border border-brand/10 text-center">
                Rates visible per doctor
              </div>

              <ul className="text-xs text-neutral-500 space-y-3 pt-4 border-t border-brand/10">
                <li className="flex items-center gap-2 text-neutral-700">✓ Senior MD, DM specialists (AIIMS, FACC accredited)</li>
                <li className="flex items-center gap-2 text-neutral-700">✓ Home lab phlebotomist executive bookings</li>
                <li className="flex items-center gap-2 text-neutral-700">✓ Automatic platform fee billing and itemization transparency</li>
                <li className="flex items-center gap-2 text-neutral-700">✓ Secure digital health barcode passports and printable logs</li>
              </ul>
            </div>

            <button
              onClick={onEnterApp}
              className="w-full py-3 glass-btn-primary text-white font-bold text-xs uppercase tracking-widest rounded-2xl cursor-pointer"
            >
              Consult Senior Specialists
            </button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 6. TESTIMONIALS CAROUSEL */}
      <motion.section
        className="bg-neutral-50 py-20 border-y border-neutral-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionPopVariants}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <motion.div
            className="text-center space-y-1"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          >
            <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block">PATIENT SATISFACTION INDEX</span>
            <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">What Our Families Say</h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                variants={cardPopVariants}
                whileHover={{ y: -6, borderColor: 'var(--color-brand)', boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.1)' }}
                className="p-6 bg-white/80 backdrop-blur-2xl border border-neutral-100 rounded-2xl shadow-sm space-y-4 transition-all"
              >
                <p className="text-xs text-neutral-500 leading-relaxed italic">"{t.text}"</p>

                <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
                  <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">{t.name}</h5>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 7. CURATED HEALTH BLOGS */}
      <motion.section
        className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionPopVariants}
      >
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        >
          <span className="text-xs font-mono font-bold text-brand uppercase tracking-widest block">SEVA DHARAM HEALTH JOURNAL</span>
          <h3 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">Preventive Care Education</h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {BLOGS.slice(0, 3).map(blog => (
            <motion.div
              key={blog.id}
              variants={cardPopVariants}
              whileHover={{ y: -8, borderColor: 'var(--color-brand)', boxShadow: '0 12px 30px -10px rgba(224, 90, 16, 0.15)' }}
              className="bg-white/80 backdrop-blur-2xl border border-neutral-100 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <img src={blog.image} alt="" className="w-full h-40 object-cover grayscale hover:grayscale-0 transition-all duration-300" />
              <div className="p-5 space-y-2">
                <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest">{blog.date} • {blog.author}</span>
                <h4 className="font-bold text-sm text-neutral-800 leading-snug uppercase tracking-wider">{blog.title}</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{blog.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {onEnterBlogs && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.2 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={onEnterBlogs}
              className="px-8 py-3 bg-white/80 backdrop-blur-2xl border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 hover:border-brand transition-all flex items-center gap-2 group shadow-sm"
            >
              Show More Blogs
              <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </motion.section>

      {/* 8. FOOTER */}
      <motion.footer
        className="bg-navy text-white py-12 px-6 md:px-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Seva Dharam Logo" className="h-8 w-auto object-contain" />
              <h4 className="font-bold text-base tracking-widest uppercase text-white">Seva Dharam</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We aim to bridge physical consulting gaps, making preliminary triage free, responsive, and available 24/7 across metropolitan hubs.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Services</h5>
            <ul className="text-xs text-neutral-400 space-y-1.5">
              <li><button onClick={() => onEnterModule('symptoms')} className="hover:text-brand cursor-pointer text-left">Symptom Evaluator</button></li>
              <li><button onClick={() => onEnterModule('doctors')} className="hover:text-brand cursor-pointer text-left">Practitioners Index</button></li>
              <li><button onClick={() => onEnterModule('prescription')} className="hover:text-brand cursor-pointer text-left">AI Script Decipher</button></li>
              <li><button onClick={() => onEnterModule('medicine')} className="hover:text-brand cursor-pointer text-left">Pharmacy & Alarms</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Emergency Operations</h5>
            <ul className="text-xs text-neutral-400 space-y-1.5">
              <li><button onClick={() => onEnterModule('emergency')} className="hover:text-brand text-emergency cursor-pointer text-left">🚨 SOS Protocol Dispatch</button></li>
              <li><button onClick={() => onEnterModule('hospitals')} className="hover:text-brand cursor-pointer text-left">Beds occupancy Index</button></li>
              <li><button onClick={() => onEnterModule('diagnostics')} className="hover:text-brand cursor-pointer text-left">Home Lab phlebotomists</button></li>
            </ul>
          </div>

          {/* <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Legalities & Badges</h5>
            <div className="space-y-2">
              <div className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-mono tracking-wide text-neutral-300 w-fit">
                HIPAA DATA SHIELD ACTIVE
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-mono tracking-wide text-neutral-300 w-fit">
                CE-RED CLINICAL VALIDATED RULES
              </div>
              
            </div>
          </div> */}
          <p className="text-[9px] text-neutral-500 leading-relaxed">All operations are hosted under secure development registries.</p>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-neutral-900 flex flex-col md:flex-row justify-between text-[11px] text-neutral-500 gap-4">
          <span>© 2026 Seva Dharam Clinical Care Platform. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Support Desk</a>
          </div>
        </div>
      </motion.footer>

    </div>
  );
}