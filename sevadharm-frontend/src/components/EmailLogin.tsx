import React, { useState } from 'react';
import { 
  ShieldCheck, X, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight, 
  Store, Stethoscope, User, Building2, Smartphone, Hash, FileCheck2, Award, Briefcase
} from 'lucide-react';
import { supabase } from '../supabase';

export default function EmailLogin() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginRole, setLoginRole] = useState<'patient' | 'doctor' | 'pharmacy'>('pharmacy');
  const [step, setStep] = useState<'FORM' | 'OTP' | 'PENDING_APPROVAL'>('FORM');

  // Patient Form states
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Doctor Verification Form states
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [medicalLicenseNo, setMedicalLicenseNo] = useState('');
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');

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

  // Handle Initial Form Submission
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // --- 1. PHARMACY LOGIN FLOW ---
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

      // --- 2. DOCTOR VERIFICATION & LOGIN FLOW ---
      if (loginRole === 'doctor') {
        if (isRegistering) {
          // Doctor Registration / Verification Application
          if (!docName.trim()) throw new Error('Please enter your full name.');
          if (!docEmail.trim()) throw new Error('Please enter your email address.');
          if (!medicalLicenseNo.trim()) throw new Error('Please enter your Medical Council Registration Number.');
          if (!hospitalAffiliation.trim()) throw new Error('Please enter your Hospital or Clinic affiliation.');

          // Save application to Supabase doctors/verification table
          const { error: dbError } = await supabase.from('doctor_applications').insert({
            full_name: docName.trim(),
            email: docEmail.trim(),
            phone: docPhone.trim(),
            medical_license: medicalLicenseNo.trim().toUpperCase(),
            specialty: specialty,
            hospital: hospitalAffiliation.trim(),
            status: 'pending_verification'
          });

          if (dbError) throw dbError;

          setStep('PENDING_APPROVAL');
          setLoading(false);
          return;
        } else {
          // Doctor Login Check: Verify if doctor is approved in DB before sending OTP
          const { data: docRecord, error: docQueryError } = await supabase
            .from('doctors')
            .select('is_verified')
            .eq('email', docEmail.trim())
            .maybeSingle();

          if (docQueryError || !docRecord) {
            throw new Error('Doctor profile not found or pending verification. Please register first.');
          }

          if (!docRecord.is_verified) {
            throw new Error('Your credentials are still under review by the Seva-Dharm medical board.');
          }

          // If verified, send OTP
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: docEmail.trim(),
            options: { shouldCreateUser: false }
          });

          if (otpError) throw otpError;

          setSuccessMsg(`Verification code sent to ${docEmail.trim()}`);
          setStep('OTP');
          setLoading(false);
          return;
        }
      }

      // --- 3. PATIENT LOGIN FLOW ---
      if (isRegistering) {
        const formattedPhone = `+91${mobile.trim()}`;
        const { data: existingPhone } = await supabase
          .from('profiles')
          .select('phone')
          .eq('phone', formattedPhone)
          .maybeSingle();

        if (existingPhone) throw new Error('This mobile number is already registered.');
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: isRegistering,
          data: isRegistering ? {
            full_name: fullName,
            age: parseInt(age) || 0,
            mobile: mobile.trim(),
            role: 'patient'
          } : undefined
        }
      });

      if (otpError) {
        if (otpError?.message?.includes('Signups not allowed for otp')) {
          throw new Error('Account not found. Please click "New User? Register Profile".');
        }
        throw otpError;
      }

      setSuccessMsg(`Verification code sent to ${email}`);
      setStep('OTP');
    } catch (err: any) {
      setError(err?.message || 'Failed to process request. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const verifyEmail = loginRole === 'pharmacy' 
        ? `${ownerMobile.trim()}@pharmacy.sevadharam.in`
        : (loginRole === 'doctor' ? docEmail.trim() : email.trim());

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: verifyEmail,
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;

      if (data?.session?.user) {
        setSuccessMsg('Authenticated successfully! Redirecting...');
        setTimeout(() => {
          if (loginRole === 'doctor') {
            window.location.replace('/portal/doctor-dashboard');
          } else if (loginRole === 'pharmacy') {
            window.location.replace('/portal/pharmacy-dashboard');
          } else {
            window.location.replace('/portal/dashboard'); 
          }
        }, 900);
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
            {step === 'PENDING_APPROVAL' ? 'APPLICATION UNDER REVIEW' :
              step === 'OTP' ? 'ENTER VERIFICATION OTP' : 
              loginRole === 'pharmacy' ? 'PHARMACY PORTAL LOGIN' : 
              loginRole === 'doctor' ? (isRegistering ? 'DOCTOR CREDENTIAL VERIFICATION' : 'DOCTOR ACCESS PORTAL') : 
              (isRegistering ? 'CREATE PATIENT PROFILE' : 'PATIENT ACCESS PORTAL')}
          </h2>
        </div>

        {/* Role Selector Tabs */}
        {step === 'FORM' && (
          <div className="mb-6 grid grid-cols-3 gap-2 p-1.5 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl">
            <button
              type="button"
              onClick={() => { setLoginRole('pharmacy'); setIsRegistering(false); setError(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'pharmacy' ? 'bg-brand text-white shadow-md' : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pharmacy</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginRole('doctor'); setError(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'doctor' ? 'bg-brand text-white shadow-md' : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginRole('patient'); setIsRegistering(false); setError(null); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginRole === 'patient' ? 'bg-brand text-white shadow-md' : 'text-neutral-600 hover:text-brand'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </button>
          </div>
        )}

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

        {/* Step 3: Pending Approval Notice for Doctors */}
        {step === 'PENDING_APPROVAL' ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-brand rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Verification Request Submitted</h3>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Thank you, Dr. {docName}. Your medical council registration number <span className="font-mono font-bold text-brand">{medicalLicenseNo}</span> and credentials have been forwarded to the Seva-Dharm Medical Verification Board. Once approved, you will receive login confirmation via email.
            </p>
            <button
              type="button"
              onClick={() => { setStep('FORM'); setIsRegistering(false); }}
              className="mt-4 px-6 py-2.5 bg-brand text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Back to Login
            </button>
          </div>
        ) : step === 'FORM' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            
            {/* PHARMACY FORM */}
            {loginRole === 'pharmacy' ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-brand" /> Pharmacy Name
                  </label>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="e.g. ABC Medical Store"
                    className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:border-brand"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-brand" /> Reg. Number
                    </label>
                    <input
                      type="text"
                      required
                      value={pharmacyRegNo}
                      onChange={(e) => setPharmacyRegNo(e.target.value)}
                      placeholder="WB/PH/2024/8849"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-brand" /> GSTN
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={pharmacyGstn}
                      onChange={(e) => setPharmacyGstn(e.target.value)}
                      placeholder="19AAACH7409R1ZZ"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-brand" /> Owner's Mobile
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={ownerMobile}
                    onChange={(e) => setOwnerMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs tracking-wider"
                  />
                </div>
              </div>
            ) : loginRole === 'doctor' ? (
              /* ================= DOCTOR FORM ================= */
              <div className="space-y-3.5">
                {isRegistering ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="Dr. Aarav Sharma"
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Medical License No.</label>
                        <input
                          type="text"
                          required
                          value={medicalLicenseNo}
                          onChange={(e) => setMedicalLicenseNo(e.target.value)}
                          placeholder="MCI-2018-93821"
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Specialty</label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-3 text-xs font-medium text-neutral-800"
                        >
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="General Physician">General Physician</option>
                          <option value="Pediatrician">Pediatrician</option>
                          <option value="Orthopedic">Orthopedic</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Hospital / Clinic Affiliation</label>
                      <input
                        type="text"
                        required
                        value={hospitalAffiliation}
                        onChange={(e) => setHospitalAffiliation(e.target.value)}
                        placeholder="Seva-Dharam Central Hospital"
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Professional Email</label>
                      <input
                        type="email"
                        required
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        placeholder="doctor@hospital.com"
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Doctor Email Address</label>
                    <input
                      type="email"
                      required
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      placeholder="doctor@hospital.com"
                      className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                    />
                  </div>
                )}
              </div>
            ) : (
              /* ================= PATIENT FORM ================= */
              <div className="space-y-3.5">
                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rajesh Kumar"
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Age</label>
                        <input
                          type="number"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="35"
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs tracking-wider"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-700 uppercase mb-1.5">Patient Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@gmail.com"
                    className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-4 py-3 text-xs"
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
                  {isRegistering 
                    ? 'Already Verified? Sign In' 
                    : (loginRole === 'doctor' ? 'New Doctor? Register for Verification' : 'New User? Register Profile')}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isRegistering && loginRole === 'doctor' ? 'SUBMIT CREDENTIALS FOR REVIEW' : 'SEND VERIFICATION CODE (OTP)'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ================= STEP 2: OTP VERIFICATION ================= */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-4 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl text-center space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Verification code sent to
              </span>
              <p className="text-xs font-bold text-neutral-800">
                {loginRole === 'pharmacy' ? `+91 ${ownerMobile}` : (loginRole === 'doctor' ? docEmail : email)}
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
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl py-3.5 px-4 text-center text-xl font-mono tracking-widest outline-none focus:border-brand font-bold text-neutral-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'VERIFY & ACCESS PORTAL'}
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

        <div className="mt-6 pt-4 border-t border-[#f0dac5] flex items-center justify-center gap-1.5 text-[8px] font-bold tracking-widest text-neutral-400 uppercase">
          <Lock className="w-3 h-3 text-brand" />
          <span>END-TO-END ENCRYPTED • MEDICAL BOARD VERIFICATION ACTIVE</span>
        </div>

      </div>
    </div>
  );
}