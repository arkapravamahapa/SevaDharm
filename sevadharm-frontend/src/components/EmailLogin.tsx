import React, { useState } from 'react';
import { 
  ShieldCheck, X, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight, 
  Store, Stethoscope, User, Building2, Smartphone, Hash, FileCheck2
} from 'lucide-react';
import { supabase } from '../supabase';

export default function EmailLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState<'patient' | 'doctor' | 'pharmacy'>('pharmacy');
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');

  // Patient & Doctor Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Pharmacy Login Credentials
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyRegNo, setPharmacyRegNo] = useState('');
  const [pharmacyGstn, setPharmacyGstn] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');

  // OTP State
  const [otpToken, setOtpToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step 1: Send OTP via Supabase
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (loginRole === 'pharmacy') {
        if (!pharmacyName.trim()) throw new Error('Please enter your Pharmacy Name.');
        if (!pharmacyRegNo.trim()) throw new Error('Please enter Pharmacy Registration Number.');
        if (!pharmacyGstn.trim()) throw new Error('Please enter Pharmacy GSTN.');
        if (!ownerMobile.trim() || ownerMobile.trim().length < 10) throw new Error('Please enter a valid 10-digit Owner Mobile Number.');

        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: `${ownerMobile.trim()}@pharmacy.sevadharam.in`,
          options: {
            shouldCreateUser: true,
            data: {
              pharmacy_name: pharmacyName.trim(),
              pharmacy_reg_no: pharmacyRegNo.trim().toUpperCase(),
              gstn: pharmacyGstn.trim().toUpperCase(),
              mobile: ownerMobile.trim(),
              role: 'pharmacy'
            }
          }
        });

        if (otpError) throw otpError;

        setSuccessMsg(`Verification code sent to owner's mobile: +91 ${ownerMobile.trim()}`);
        setStep('OTP');
        setLoading(false);
        return;
      }

      if (isRegistering) {
        const formattedPhone = `+91${mobile.trim()}`;
        const { data: existingPhone } = await supabase
          .from('profiles')
          .select('phone')
          .eq('phone', formattedPhone)
          .maybeSingle();

        if (existingPhone) {
          throw new Error('This mobile number is already registered. Please switch to Login.');
        }

        const { data: existingEmail } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email.trim())
          .maybeSingle();

        if (existingEmail) {
          throw new Error('This email address is already registered. Please switch to Login.');
        }
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
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
        if (otpError?.message?.includes('Signups not allowed for otp')) {
          throw new Error('Account not found. Please click "New User? Register Profile" below.');
        }
        throw otpError;
      }

      setSuccessMsg(`Verification code sent to ${email}`);
      setStep('OTP');
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP via Supabase
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const verifyEmail = loginRole === 'pharmacy' 
        ? `${ownerMobile.trim()}@pharmacy.sevadharam.in`
        : email.trim();

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: verifyEmail,
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;

      if (data?.session?.user) {
        const userId = data.session.user.id;

        if (isRegistering && loginRole !== 'pharmacy') {
          const formattedPhone = `+91${mobile.trim()}`;
          await supabase
            .from('profiles')
            .upsert({
              id: userId,
              phone: formattedPhone,
              email: email.trim(),
              full_name: fullName,
              age: parseInt(age) || 0,
              role: loginRole
            });
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        setSuccessMsg('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          const finalRole = profile?.role || loginRole;
          if (finalRole === 'doctor') {
            window.location.replace('/portal/doctor-dashboard');
          } else if (finalRole === 'pharmacy') {
            window.location.replace('/portal/pharmacy-dashboard');
          } else {
            window.location.replace('/portal/dashboard'); 
          }
        }, 900);
      } else {
        throw new Error('Verification succeeded, but no active session was returned.');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900/50 backdrop-blur-md p-4 py-8">
      <div className="bg-white rounded-[28px] border border-[#f0dac5] shadow-[0_20px_60px_rgba(202,99,51,0.12)] p-6 md:p-8 max-w-xl w-full relative">
        
        {/* Close Button */}
        <button 
          onClick={() => window.history.back()}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-brand">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
              SEVADHARAM SECURE AUTHENTICATION
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight uppercase">
            {step === 'OTP' ? 'ENTER VERIFICATION OTP' : 
              loginRole === 'pharmacy' ? 'PHARMACY PORTAL LOGIN' : 
              loginRole === 'doctor' ? 'DOCTOR ACCESS PORTAL' : 
              (isRegistering ? 'CREATE PATIENT PROFILE' : 'PATIENT ACCESS PORTAL')}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm">
            {loginRole === 'pharmacy' 
              ? 'Enter verified Pharmacy credentials to access Marg POS integration and digital dispensing.'
              : 'Secure HIPAA-compliant healthcare access portal.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        {step === 'FORM' && (
          <div className="mb-6 grid grid-cols-3 gap-2 p-1.5 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl">
            <button
              type="button"
              onClick={() => { setLoginRole('pharmacy'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'pharmacy' 
                  ? 'bg-brand text-white shadow-md shadow-brand/20' 
                  : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pharmacy</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginRole('doctor'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'doctor' 
                  ? 'bg-brand text-white shadow-md shadow-brand/20' 
                  : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginRole('patient'); setError(null); setSuccessMsg(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'patient' 
                  ? 'bg-brand text-white shadow-md shadow-brand/20' 
                  : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-red-600 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Content */}
        {step === 'FORM' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            
            {loginRole === 'pharmacy' ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-brand" />
                    <span>Pharmacy Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="e.g. ABC Medical Store"
                    className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-brand" />
                      <span>Pharmacy Reg. Number</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pharmacyRegNo}
                      onChange={(e) => setPharmacyRegNo(e.target.value)}
                      placeholder="e.g. WB/PH/2024/8849"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-mono font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-brand" />
                      <span>GSTN</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={pharmacyGstn}
                      onChange={(e) => setPharmacyGstn(e.target.value)}
                      placeholder="e.g. 19AAACH7409R1ZZ"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-mono font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-brand" />
                    <span>Owner's Mobile Number</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-neutral-400 select-none">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={ownerMobile}
                      onChange={(e) => setOwnerMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl py-3 pl-12 pr-4 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all tracking-wider"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={loginRole === 'doctor' ? 'e.g., Dr. Aarav Sharma' : 'e.g., Rajesh Kumar'}
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                          AGE
                        </label>
                        <input
                          type="number"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="35"
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                          MOBILE NUMBER
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-neutral-400 select-none">+91</span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="98765 43210"
                            className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl py-3 pl-12 pr-4 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all tracking-wider"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">
                    {loginRole === 'doctor' ? 'DOCTOR EMAIL ADDRESS' : 'PATIENT EMAIL ADDRESS'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginRole === 'doctor' ? 'doctor@hospital.com' : 'patient@gmail.com'}
                    className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-brand transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {loginRole !== 'pharmacy' && (
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[10px] font-bold text-brand hover:underline cursor-pointer uppercase tracking-wider"
                >
                  {isRegistering ? 'Existing User? Sign In' : 'New User? Register Profile'}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand/20 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  SEND VERIFICATION CODE (OTP) <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Verification sent to
              </span>
              <p className="text-xs font-bold text-neutral-800">
                {loginRole === 'pharmacy' 
                  ? `Owner Mobile: +91 ${ownerMobile}` 
                  : email}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 text-center">
                ENTER 6-DIGIT OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl py-3.5 px-4 text-center text-xl font-mono tracking-widest outline-none focus:bg-white focus:border-brand transition-all font-bold text-neutral-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand/20 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'VERIFY & ACCESS PORTAL'
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('FORM'); setOtpToken(''); }}
              className="w-full text-center text-[10px] font-bold text-neutral-400 hover:text-brand transition-colors cursor-pointer uppercase tracking-wider"
            >
              ← Edit Login Details
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#f0dac5] flex items-center justify-center gap-1.5 text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
          <Lock className="w-3 h-3 text-brand" />
          <span>END-TO-END ENCRYPTED • PHARMACY &amp; CLINICAL COMPLIANCE ACTIVE</span>
        </div>

      </div>
    </div>
  );
}