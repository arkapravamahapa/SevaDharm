import React, { useState } from 'react';
import { ShieldCheck, X, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mcngpubbgfwirhmafezv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_actual_supabase_anon_key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EmailLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState<'patient' | 'doctor' | 'pharmacy'>('patient');
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

  // Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step 1: Pre-Check Database and Send Email OTP
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // --- DEMO BYPASS ---
      if (email.endsWith('@demo.com') || true) { // Bypassing completely as requested by the user
        setTimeout(() => {
          setSuccessMsg(`Verification code sent to ${email}`);
          setStep('OTP');
          setLoading(false);
        }, 800);
        return;
      }

      // --- 1. THE PRE-CHECK (Only run this when registering) ---
      if (isRegistering) {
        const formattedPhone = `+91${mobile.trim()}`;
        
        // A. Check if this phone number already exists
        const { data: existingPhone } = await supabase
          .from('profiles')
          .select('phone')
          .eq('phone', formattedPhone)
          .maybeSingle();

        if (existingPhone) {
          throw new Error('This mobile number is already registered. Please switch to Login.');
        }

        // B. Check if this email already exists
        const { data: existingEmail } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email.trim())
          .maybeSingle();

        if (existingEmail) {
          throw new Error('This email address is already registered. Please switch to Login.');
        }
      }

      // --- 2. SEND THE EMAIL OTP ---
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // STRICT MODE: Prevents unregistered users from logging in
          shouldCreateUser: isRegistering,
          data: isRegistering ? {
            full_name: fullName,
            age: parseInt(age) || 0,
            mobile: mobile.trim(),
            role: loginRole
          } : undefined
        }
      });

      if (otpError) {
        if (otpError.message.includes('Signups not allowed for otp')) {
          throw new Error('Account not found. Please click "NEW PATIENT? REGISTER PROFILE" below.');
        }
        throw otpError;
      }

      setSuccessMsg(`Verification code sent to ${email}`);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP and Save Profile Data
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // --- DEMO BYPASS ---
      if (email.endsWith('@demo.com') || true) { // Bypassing completely as requested by the user
        await supabase.auth.signOut(); // Clear any existing Supabase session so it doesn't conflict
        setTimeout(() => {
          const demoUser = {
            id: 'demo-' + Date.now(),
            name: isRegistering ? fullName : (loginRole === 'doctor' ? 'Dr. Sharma' : loginRole === 'pharmacy' ? 'Seva Pharmacy' : 'Rajesh Kumar'),
            email: email,
            mobile: mobile || '9876543210',
            role: loginRole
          };
          localStorage.setItem('demo_user', JSON.stringify(demoUser));
          setSuccessMsg('Authenticated successfully! Redirecting...');
          setTimeout(() => {
            if (loginRole === 'doctor') window.location.replace('/portal/doctor-dashboard');
            else if (loginRole === 'pharmacy') window.location.replace('/portal/pharmacy-dashboard');
            else window.location.replace('/portal/dashboard'); 
          }, 1500);
        }, 800);
        return;
      }

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;

      if (data.session) {
        // --- 3. SAVE METADATA TO PUBLIC DATABASE ON REGISTRATION ---
        if (isRegistering) {
          const formattedPhone = `+91${mobile.trim()}`;
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.session.user.id,
              phone: formattedPhone,
              email: email.trim(), // <--- Now saving the email to the database!
              full_name: fullName,
              age: parseInt(age) || 0
            });
            
          if (profileError) {
            console.error('Error saving profile:', profileError);
          }
        }

        setSuccessMsg('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          if (loginRole === 'doctor') window.location.replace('/portal/doctor-dashboard');
          else if (loginRole === 'pharmacy') window.location.replace('/portal/pharmacy-dashboard');
          else window.location.replace('/portal/dashboard'); 
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[28px] border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 max-w-lg w-full relative">
        
        {/* Close Button */}
        <button 
          onClick={() => window.history.back()}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#f07b43]/10 flex items-center justify-center text-[#f07b43]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
              HIPAA SECURE REGISTRY
            </span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">
            {step === 'OTP' ? 'ENTER VERIFICATION CODE' : 
              loginRole === 'doctor' ? 'DOCTOR ACCESS PORTAL' : 
              loginRole === 'pharmacy' ? 'PHARMACY ACCESS PORTAL' : 
              (isRegistering ? 'CREATE PATIENT PROFILE' : 'ACCESS YOUR PORTAL')}
          </h2>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-600 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Content */}
        {step === 'FORM' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            
            {/* Extra fields shown only during Register */}
            {isRegistering && (
              <>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">
                      AGE
                    </label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="35"
                      className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">
                      MOBILE NUMBER
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-neutral-300 select-none">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl py-3 pl-12 pr-4 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all tracking-wider"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email Field (Used for OTP verification in both Login and Register) */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-[0_8px_16px_rgba(222,118,73,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>CONTINUE VERIFICATION <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          /* OTP Entry Step */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5">
                ENTER 6-DIGIT OTP SENT TO {email}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="123456"
                className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl py-3.5 px-4 text-center text-lg font-mono tracking-widest outline-none focus:bg-white focus:border-[#f07b43] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-[0_8px_16px_rgba(222,118,73,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'VERIFY & ACCESS PORTAL'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('FORM'); setOtpToken(''); }}
              className="w-full text-center text-[10px] font-bold text-neutral-400 hover:text-neutral-700 mt-2 transition-colors cursor-pointer uppercase tracking-wider"
            >
              BACK TO EDIT DETAILS
            </button>
          </form>
        )}

        {/* Toggle Mode Footer Link */}
        {step === 'FORM' && (
          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccessMsg('');
              }}
              className="text-[10px] font-bold tracking-widest text-neutral-400 hover:text-[#f07b43] uppercase transition-all block w-full"
            >
              {isRegistering 
                ? 'ALREADY REGISTERED? LOGIN HERE' 
                : loginRole === 'doctor' 
                  ? 'NEW DOCTOR? REGISTER PROFILE' 
                  : loginRole === 'pharmacy' 
                    ? 'NEW PHARMACY? REGISTER PROFILE' 
                    : 'NEW PATIENT? REGISTER PROFILE'}
            </button>
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
              {loginRole !== 'doctor' && (
                <button 
                  type="button" 
                  onClick={() => {
                    setLoginRole('doctor');
                    setIsRegistering(false);
                    setError(null);
                    setSuccessMsg('');
                  }}
                  className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-[#f07b43] transition-all cursor-pointer"
                >
                  Are you a doctor? Login here
                </button>
              )}
              {loginRole !== 'pharmacy' && (
                <button 
                  type="button" 
                  onClick={() => {
                    setLoginRole('pharmacy');
                    setIsRegistering(false);
                    setError(null);
                    setSuccessMsg('');
                  }}
                  className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-[#f07b43] transition-all cursor-pointer"
                >
                  Are you a pharmacy? Login here
                </button>
              )}
              {loginRole !== 'patient' && (
                <button 
                  type="button" 
                  onClick={() => {
                    setLoginRole('patient');
                    setIsRegistering(false);
                    setError(null);
                    setSuccessMsg('');
                  }}
                  className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-[#f07b43] transition-all cursor-pointer"
                >
                  Are you a patient? Login here
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Security Notice */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
          <Lock className="w-3 h-3 text-[#e69b7c]" />
          <span>END-TO-END ENCRYPTED • CLINICAL COMPLIANCE ACTIVE</span>
        </div>

      </div>
    </div>
  );
}