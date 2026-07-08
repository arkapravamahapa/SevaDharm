import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    email: '',
    otp: ''
  });
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!formData.name.trim() || !formData.age || !formData.mobile.trim() || !formData.email.trim()) {
        setError('Please fill in all details to secure your medical portal.');
        return;
      }
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        setError('Please enter a valid age (1-120).');
        return;
      }
      if (!/^\d{10}$/.test(formData.mobile.replace(/[\s-+]/g, '').slice(-10))) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    } else {
      if (!formData.mobile.trim()) {
        setError('Please enter your mobile number.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp.length < 4) {
      setError('Please enter the 4-digit code sent to your phone.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockProfile: UserProfile = {
        name: isSignUp ? formData.name : 'Rajesh Kumar',
        age: isSignUp ? parseInt(formData.age) : 34,
        mobile: formData.mobile,
        email: isSignUp ? formData.email : 'rajesh.kumar@example.com',
        bloodGroup: isSignUp ? 'O+' : 'O+',
        allergies: isSignUp ? 'None' : 'Pollen, Penicillin',
        chronicConditions: isSignUp ? 'None' : 'Slight Hypertension',
        emergencyContact: '+91 99887 76655'
      };
      onLoginSuccess(mockProfile);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl z-10"
      >
        {/* Accent Bar */}
        <div className="h-1.5 bg-brand" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-2xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2.5 bg-brand-soft text-brand rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">HIPAA SECURE REGISTRY</span>
              <h3 className="text-xl font-bold uppercase tracking-wider text-neutral-900 mt-0.5">
                {isSignUp ? 'Create Patient Profile' : 'Access Your Portal'}
              </h3>
            </div>
          </div>

          {step === 'details' ? (
            <form onSubmit={handleNext} className="space-y-4">
              {isSignUp ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Rajesh Kumar" 
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-brand transition-all outline-none text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Age</label>
                      <input 
                        type="number" 
                        name="age"
                        required
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="35" 
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-brand transition-all outline-none text-xs font-semibold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@domain.com" 
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-brand transition-all outline-none text-xs font-semibold"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <div>
                <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">Mobile Number (10 digits)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs">+91</span>
                  <input 
                    type="tel" 
                    name="mobile"
                    required
                    pattern="[0-9]{10}"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="98765 43210" 
                    className="w-full pl-14 pr-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:border-brand transition-all outline-none font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-emergency-light border border-emergency-soft text-emergency text-xs font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-brand hover:bg-brand-hover text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest hover:text-brand transition-all cursor-pointer"
                >
                  {isSignUp ? 'Already registered? Login here' : 'New patient? Register profile'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-neutral-600 text-xs leading-relaxed">
                  We have sent a verification code to <span className="font-semibold font-mono text-neutral-800">+91 {formData.mobile}</span>
                </p>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">For testing, enter any 4 digits (e.g., <span className="font-semibold font-mono text-brand">1234</span>)</p>
              </div>

              <div>
                <label className="block text-center text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Enter 4-Digit OTP</label>
                <input 
                  type="text" 
                  name="otp"
                  maxLength={4}
                  required
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="••••" 
                  className="w-40 mx-auto text-center tracking-widest text-xl font-bold font-mono px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand transition-all outline-none"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-emergency-light border border-emergency-soft text-emergency text-xs font-medium">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 bg-brand hover:bg-brand-hover text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Grant Access</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => setStep('details')}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-all text-center"
              >
                Back to Details
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            <Lock className="w-4 h-4 text-brand" />
            <span>End-to-end encrypted • Clinical compliance active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
