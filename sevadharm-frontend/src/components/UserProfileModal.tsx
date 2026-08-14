import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Heart, Activity, Coffee, Moon, ArrowRight, X, Edit3, Droplet, UserCheck, Stethoscope, Award, Briefcase, Star, Building2, Package } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile & {
    avatar_url?: string;
    fee?: number;
    licenseNumber?: string;
  };
  onEditClick: () => void;
  completionPercent: number;
}

export default function UserProfileModal({ isOpen, onClose, currentUser, onEditClick, completionPercent }: UserProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-br from-brand-soft to-white p-6 sm:p-8 border-b border-brand/10 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-brand shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-soft to-transparent opacity-50" />
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover relative z-10" />
              ) : (
                <User className="w-10 h-10 relative z-10" />
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1 space-y-2 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 uppercase tracking-wider">{currentUser.name}</h2>
                  {currentUser.role === 'doctor' ? (
                    <p className="text-brand font-bold text-[11px] uppercase tracking-widest">{currentUser.experience ? `${currentUser.experience} Years Experience` : 'Medical Professional'}</p>
                  ) : currentUser.role === 'pharmacy' ? (
                    <p className="text-emerald-600 font-bold text-[11px] uppercase tracking-widest">Verified Partner</p>
                  ) : (
                    <p className="text-brand font-bold text-[11px] uppercase tracking-widest">{currentUser.age ? `${currentUser.age} Years Old` : 'Patient Profile'}</p>
                  )}
                </div>
                {(!currentUser.role || currentUser.role === 'patient') && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">Profile Status</span>
                    <span className="text-[10px] font-bold text-brand">{completionPercent}%</span>
                  </div>
                )}
                {currentUser.role === 'doctor' && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{currentUser.specialty || 'General Physician'}</span>
                  </div>
                )}
                {currentUser.role === 'pharmacy' && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Pharmacy</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-neutral-500">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-medium">{currentUser.mobile || 'Not Provided'}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-neutral-500">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-medium">{currentUser.email || 'Not Provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-neutral-50/50">
          
          {(!currentUser.role || currentUser.role === 'patient') && (
            <>
              {/* Section 1: Clinical Vitals */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand">
                  <Heart className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Clinical Vitals</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Blood Group" value={currentUser.bloodGroup} icon={<Droplet className="w-3.5 h-3.5" />} />
                  <InfoCard label="Body Metrics" value={currentUser.weight && currentUser.height ? `${currentUser.weight}kg, ${currentUser.height}cm` : undefined} icon={<UserCheck className="w-3.5 h-3.5" />} />
                  <InfoCard label="Allergies" value={currentUser.allergies} fullWidth />
                  <InfoCard label="Chronic Conditions" value={currentUser.chronicConditions} fullWidth />
                  <InfoCard label="Emergency Contact" value={currentUser.emergencyContact} />
                </div>
              </div>

              {/* Section 2: Lifestyle & Habits */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-widest">Lifestyle & Habits</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoCard label="Diet" value={currentUser.dietType} icon={<Coffee className="w-3.5 h-3.5" />} />
                  <InfoCard label="Activity Level" value={currentUser.activityLevel} />
                  <InfoCard label="Stress Level" value={currentUser.stressLevel} />
                  <InfoCard label="Smoking" value={currentUser.smokingHabit} />
                  <InfoCard label="Drinking" value={currentUser.drinkingHabit} />
                  <InfoCard label="Avg Sleep" value={currentUser.sleepHours ? `${currentUser.sleepHours} hrs` : undefined} icon={<Moon className="w-3.5 h-3.5" />} />
                </div>
              </div>
            </>
          )}

          {currentUser.role === 'doctor' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand">
                <Stethoscope className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Professional Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="Specialty" value={currentUser.specialty || 'General Medicine'} icon={<Star className="w-3.5 h-3.5" />} />
                <InfoCard label="Qualifications" value={currentUser.qualification || 'MBBS, MD'} icon={<Award className="w-3.5 h-3.5" />} />
                <InfoCard label="Experience" value={currentUser.experience ? `${currentUser.experience} Years` : undefined} icon={<Briefcase className="w-3.5 h-3.5" />} />
                <InfoCard label="Consultation Fee" value={currentUser.fee ? `₹${currentUser.fee} / Session` : undefined} icon={<Building2 className="w-3.5 h-3.5" />} />
                <InfoCard label="Areas of Expertise" value={currentUser.expertise} fullWidth />
              </div>
            </div>
          )}

          {currentUser.role === 'pharmacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Pharmacy Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="License Number" value={currentUser.licenseNumber || 'Verified License'} icon={<Award className="w-3.5 h-3.5" />} />
                <InfoCard label="Operating Hours" value="24x7" icon={<Activity className="w-3.5 h-3.5" />} />
                <InfoCard label="Service Area" value={((currentUser as any).address as string) || 'Standard Delivery Radius'} fullWidth icon={<Building2 className="w-3.5 h-3.5" />} />
                <InfoCard label="Delivery Status" value="Active - Accepting Orders" fullWidth icon={<Package className="w-3.5 h-3.5" />} />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {(!currentUser.role || currentUser.role === 'patient') && (
          <div className="p-6 bg-white border-t border-neutral-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider text-center sm:text-left">
              Keep your clinical profile updated for better Seva AI diagnosis.
            </p>
            <button
              onClick={() => {
                onClose();
                onEditClick();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile Details</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({ label, value, icon, fullWidth = false }: { label: string; value?: string; icon?: React.ReactNode; fullWidth?: boolean }) {
  const hasValue = value && value.trim() !== '' && value !== 'None';
  
  return (
    <div className={`p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon && <span className="text-neutral-400">{icon}</span>}
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-sm font-semibold ${hasValue ? 'text-neutral-800' : 'text-neutral-300 italic'}`}>
        {hasValue ? value : 'Not provided'}
      </div>
    </div>
  );
}