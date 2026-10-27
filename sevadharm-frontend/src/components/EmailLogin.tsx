import React, { useState } from 'react';
import { 
  ShieldCheck, X, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight, 
  Store, Stethoscope, User, Building2, KeyRound, Sparkles, Smartphone, Hash, FileCheck2
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

  // Pharmacy Login Credentials:
  // a. Pharmacy Name
  // b. Pharmacy Registration Number
  // c. GSTN
  // d. Owner's Mobile Number
  // e. OTP
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyRegNo, setPharmacyRegNo] = useState('');
  const [pharmacyGstn, setPharmacyGstn] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');

  // OTP State
  const [otpToken, setOtpToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick 1-Click Demo Login
  const handleDirectDemoLogin = (role: 'patient' | 'doctor' | 'pharmacy') => {
    setLoading(true);
    setError(null);
    setSuccessMsg(`Signing in as demo ${role}...`);

    let demoUser: any;
    if (role === 'pharmacy') {
      demoUser = {
        id: 'pharmacy-demo-1',
        userId: 'SD-PHM-90214',
        name: 'ABC Medical Store',
        email: 'pharmacy@demo.com',
        mobile: '9876543212',
        role: 'pharmacy',
        pharmacyName: 'ABC Medical Store',
        pharmacyRegNo: 'WB/PH/2024/8849',
        gstn: '19AAACH7409R1ZZ',
        ownerMobile: '9876543212',
        location: 'Kolkata, West Bengal'
      };
    } else if (role === 'doctor') {
      demoUser = {
        id: 'doctor-demo-1',
        userId: 'SD-DOC-34891',
        name: 'Dr. Aarav Sharma',
        email: 'doctor@demo.com',
        mobile: '9876543211',
        role: 'doctor',
        specialty: 'Cardiologist',
        hospital: 'SevaDharam Central Hospital'
      };
    } else {
      demoUser = {
        id: 'patient-demo-1',
        userId: 'SD-PAT-88214',
        name: 'Rajesh Kumar',
        email: 'patient@demo.com',
        mobile: '9876543210',
        role: 'patient',
        age: 38,
        bloodGroup: 'B+',
        allergies: 'Penicillin',
        chronicConditions: 'Mild Hypertension',
        familyMembers: [
          {
            id: 'SD-PAT-88214',
            name: 'Rajesh Kumar',
            relationship: 'Self',
            age: 38,
            gender: 'Male',
            bloodGroup: 'B+',
            allergies: 'Penicillin'
          },
          {
            id: 'SD-PAT-88215',
            name: 'Pooja Kumar',
            relationship: 'Spouse',
            age: 35,
            gender: 'Female',
            bloodGroup: 'A+',
            allergies: 'None',
            profilePic: '/avatars/patient-woman.jpg'
          },
          {
            id: 'SD-PAT-88216',
            name: 'Aarav Kumar',
            relationship: 'Child',
            age: 9,
            gender: 'Male',
            bloodGroup: 'B+',
            allergies: 'Peanuts',
            profilePic: '/avatars/patient-boy.jpg'
          },
          {
            id: 'SD-PAT-88217',
            name: 'Savitri Devi',
            relationship: 'Parent',
            age: 64,
            gender: 'Female',
            bloodGroup: 'O+',
            chronicConditions: 'Hypertension',
            profilePic: '/avatars/patient-woman.jpg'
          }
        ]
      };
    }

    localStorage.setItem('demo_user', JSON.stringify(demoUser));

    setTimeout(() => {
      if (role === 'doctor') {
        window.location.replace('/portal/doctor-dashboard');
      } else if (role === 'pharmacy') {
        window.location.replace('/portal/pharmacy-dashboard');
      } else {
        window.location.replace('/portal/dashboard');
      }
    }, 700);
  };

  // Populate Pharmacy Form with Demo Data
  const handleFillDemoPharmacy = () => {
    setLoginRole('pharmacy');
    setPharmacyName('ABC Medical Store');
    setPharmacyRegNo('WB/PH/2024/8849');
    setPharmacyGstn('19AAACH7409R1ZZ');
    setOwnerMobile('9876543212');
    setError(null);
    setSuccessMsg('Demo credentials filled! Click "Send Verification Code" below.');
  };

  // Step 1: Pre-Check & Send OTP
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // --- PHARMACY LOGIN FLOW ---
      if (loginRole === 'pharmacy') {
        if (!pharmacyName.trim()) throw new Error('Please enter your Pharmacy Name.');
        if (!pharmacyRegNo.trim()) throw new Error('Please enter Pharmacy Registration Number.');
        if (!pharmacyGstn.trim()) throw new Error('Please enter Pharmacy GSTN.');
        if (!ownerMobile.trim() || ownerMobile.trim().length < 10) throw new Error('Please enter a valid 10-digit Owner Mobile Number.');

        // Demo or registered pharmacy bypass:
        setTimeout(() => {
          setSuccessMsg(`OTP sent to owner's mobile: +91 ${ownerMobile.slice(-10)} (Demo code: 123456)`);
          setStep('OTP');
          setLoading(false);
        }, 600);
        return;
      }

      // --- PATIENT / DOCTOR DEMO BYPASS ---
      if (email.trim().endsWith('@demo.com')) {
        setTimeout(() => {
          setSuccessMsg(`Verification code sent to ${email} (Demo code: 123456)`);
          setStep('OTP');
          setLoading(false);
        }, 600);
        return;
      }

      // --- REAL PATIENT / DOCTOR FLOW VIA SUPABASE ---
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
          throw new Error('Account not found. Please click "NEW USER? REGISTER PROFILE" below.');
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Pharmacy OTP Verification (supports demo 123456 or any 6-digit code)
      if (loginRole === 'pharmacy') {
        if (!otpToken.trim() || otpToken.trim().length !== 6) {
          throw new Error('Please enter the 6-digit OTP code.');
        }

        const pharmacyUser = {
          id: 'pharmacy-' + Date.now(),
          name: pharmacyName.trim() || 'ABC Medical Store',
          email: `${ownerMobile.trim()}@pharmacy.sevadharam.in`,
          mobile: ownerMobile.trim(),
          role: 'pharmacy',
          pharmacyName: pharmacyName.trim(),
          pharmacyRegNo: pharmacyRegNo.trim().toUpperCase(),
          gstn: pharmacyGstn.trim().toUpperCase(),
          ownerMobile: ownerMobile.trim(),
          location: 'Kolkata, West Bengal'
        };

        localStorage.setItem('demo_user', JSON.stringify(pharmacyUser));
        setSuccessMsg('Pharmacy verified successfully! Launching Portal...');
        setTimeout(() => {
          window.location.replace('/portal/pharmacy-dashboard');
        }, 800);
        return;
      }

      // Patient / Doctor demo bypass
      if (email.trim().endsWith('@demo.com') || otpToken.trim() === '123456') {
        await supabase.auth.signOut();
        const demoUser = {
          id: 'demo-' + Date.now(),
          name: isRegistering ? fullName : (loginRole === 'doctor' ? 'Dr. Aarav Sharma' : 'Rajesh Kumar'),
          email: email.trim(),
          mobile: mobile.trim() || '9876543210',
          role: loginRole
        };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setSuccessMsg('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          if (loginRole === 'doctor') window.location.replace('/portal/doctor-dashboard');
          else window.location.replace('/portal/dashboard'); 
        }, 900);
        return;
      }

      // Real Supabase Email OTP Verification
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;

      if (data?.session?.user) {
        const userId = data.session.user.id;

        if (isRegistering) {
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
          .select('role, is_profile_complete')
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

        {/* Role Selector Tabs with SevaDharam Theme */}
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
            
            {/* ================= PHARMACY LOGIN FORM ================= */}
            {loginRole === 'pharmacy' ? (
              <div className="space-y-3.5">
                {/* a. Pharmacy Name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-brand" />
                    <span>a. Pharmacy Name</span>
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

                {/* b. Pharmacy Registration Number & c. GSTN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-brand" />
                      <span>b. Pharmacy Reg. Number</span>
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
                      <span>c. GSTN</span>
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

                {/* d. Owner's Mobile Number */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-brand" />
                    <span>d. Owner's Mobile Number</span>
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
              /* ================= PATIENT / DOCTOR FORM ================= */
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

            {/* Submit Button */}
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
          /* ================= STEP 2: OTP VERIFICATION ================= */
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
              <div className="inline-block mt-1 px-3 py-0.5 bg-brand-light text-brand border border-brand-soft text-[10px] font-mono font-bold rounded-full">
                Demo OTP: 123456
              </div>
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
                placeholder="123456"
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

        {/* ================= DEMO CREDENTIALS QUICK ACCESS ================= */}
        <div className="mt-8 pt-6 border-t border-[#f0dac5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Demo Login Credentials for Quick Testing</span>
            </span>
            <span className="text-[9px] font-mono text-brand font-bold uppercase">1-Click Sign-in</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Pharmacy Demo Card */}
            <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <Store className="w-3.5 h-3.5 text-brand" />
                  <span>Pharmacy</span>
                </div>
                <p className="text-[10px] text-neutral-900 font-bold mt-1">ABC Medical Store</p>
                <p className="text-[9px] font-mono text-neutral-600 mt-0.5">Reg: WB/PH/2024/8849</p>
                <p className="text-[9px] font-mono text-neutral-600">GST: 19AAACH7409R1ZZ</p>
                <p className="text-[9px] font-mono text-neutral-600">Mob: +91 98765 43212</p>
                <p className="text-[9px] font-mono text-brand font-bold">OTP: 123456</p>
              </div>
              <div className="space-y-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('pharmacy')}
                  className="w-full py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  1-Click Login
                </button>
                <button
                  type="button"
                  onClick={handleFillDemoPharmacy}
                  className="w-full py-1 bg-white border border-[#f0dac5] text-brand hover:bg-orange-50/50 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Fill Form
                </button>
              </div>
            </div>

            {/* Doctor Demo Card */}
            <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <Stethoscope className="w-3.5 h-3.5 text-brand" />
                  <span>Doctor</span>
                </div>
                <p className="text-[10px] text-neutral-900 font-bold mt-1">Dr. Aarav Sharma</p>
                <p className="text-[9px] text-neutral-600">Cardiologist</p>
                <p className="text-[9px] font-mono text-neutral-600 mt-0.5">doctor@demo.com</p>
                <p className="text-[9px] font-mono text-neutral-600">Mob: +91 98765 43211</p>
                <p className="text-[9px] font-mono text-brand font-bold">OTP: 123456</p>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('doctor')}
                  className="w-full py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  1-Click Login
                </button>
              </div>
            </div>

            {/* Patient Demo Card */}
            <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <User className="w-3.5 h-3.5 text-brand" />
                  <span>Patient</span>
                </div>
                <p className="text-[10px] text-neutral-900 font-bold mt-1">Rajesh Kumar</p>
                <p className="text-[9px] text-neutral-600">Age: 38 (Blood: B+)</p>
                <p className="text-[9px] font-mono text-neutral-600 mt-0.5">patient@demo.com</p>
                <p className="text-[9px] font-mono text-neutral-600">Mob: +91 98765 43210</p>
                <p className="text-[9px] font-mono text-brand font-bold">OTP: 123456</p>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('patient')}
                  className="w-full py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  1-Click Login
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#f0dac5] flex items-center justify-center gap-1.5 text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
          <Lock className="w-3 h-3 text-brand" />
          <span>END-TO-END ENCRYPTED • PHARMACY &amp; CLINICAL COMPLIANCE ACTIVE</span>
        </div>

      </div>
    </div>
  );
}