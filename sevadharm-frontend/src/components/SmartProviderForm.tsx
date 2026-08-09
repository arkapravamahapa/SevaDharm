import React, { useState } from 'react';
import { 
  Stethoscope, Building2, UserCheck, Mail, Phone, MapPin, 
  IndianRupee, Award, Activity, Navigation, UploadCloud, Loader2, CheckCircle2, XCircle 
} from 'lucide-react';
import { supabase } from '../supabase';

export default function SmartProviderForm() {
  const [role, setRole] = useState<'doctor' | 'pharmacy'>('doctor');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    lat: '',
    lng: '',
    bio: '',
    // Doctor Specific
    specialty: 'Cardiologist',
    fee: '500',
    experience: '5',
    // Hospital Specific
    centerType: 'PRIVATE CENTER',
    emergencyBeds: '50'
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let avatar_url = null;
      const manualUserId = crypto.randomUUID();

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${manualUserId}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrlData.publicUrl;
      }

      const isDoc = role === 'doctor';

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: manualUserId,
          role: role,
          full_name: formData.fullName,
          email: formData.email.trim(),
          phone: `+91${formData.phone.trim()}`,
          bio: isDoc ? `${formData.specialty} | ${formData.bio}` : formData.bio,
          location: formData.location,
          lat: formData.lat ? parseFloat(formData.lat) : null,
          lng: formData.lng ? parseFloat(formData.lng) : null,
          avatar_url: avatar_url,
          verification_status: 'verified',
          is_profile_complete: true,
          // Conditional mapping based on smart form state
          fee: isDoc ? parseFloat(formData.fee) || 500 : null,
          experience: isDoc ? parseInt(formData.experience, 10) || 5 : null,
          center_type: !isDoc ? formData.centerType : null,
          emergency_beds: !isDoc ? parseInt(formData.emergencyBeds, 10) || 0 : null,
        });

      if (insertError) throw new Error(insertError.message);

      setSuccess(`Successfully provisioned and deployed ${formData.fullName} to live production.`);
      setFormData({
        fullName: '', email: '', phone: '', location: '', lat: '', lng: '', bio: '',
        specialty: 'Cardiologist', fee: '500', experience: '5', centerType: 'PRIVATE CENTER', emergencyBeds: '50'
      });
      setFile(null);
      setPreview(null);

    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-white shadow-2xl">
      <div className="mb-6 border-b border-neutral-800 pb-6">
        <h2 className="text-lg font-black tracking-tight uppercase">Enterprise Smart Form</h2>
        <p className="text-xs text-neutral-400 mt-1">Form fields dynamically adapt based on the selected registry profile.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-red-400 text-xs font-bold">
          <XCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /><span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Switcher (The Intelligence Trigger) */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Select Entity Classification</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all cursor-pointer ${
                role === 'doctor' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-800 bg-neutral-950 text-neutral-400'
              }`}
            >
              <Stethoscope className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Medical Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('pharmacy')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all cursor-pointer ${
                role === 'pharmacy' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-800 bg-neutral-950 text-neutral-400'
              }`}
            >
              <Building2 className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Hospital / Center</span>
            </button>
          </div>
        </div>

        {/* Media Uploader */}
        <div className="flex items-center gap-6">
          <label className="relative cursor-pointer group shrink-0">
            <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${preview ? 'border-[#de7649]' : 'border-neutral-700 group-hover:border-[#de7649] bg-neutral-950'}`}>
              {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <><UploadCloud className="w-5 h-5 text-neutral-500 mb-1" /><span className="text-[8px] font-bold text-neutral-500">UPLOAD</span></>}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <div className="text-xs text-neutral-400">
            <p className="font-bold text-white mb-1">Visual Identity Asset</p>
            Upload a certified headshot for practitioners or official logo infrastructure for hospital complexes.
          </div>
        </div>

        {/* Standard Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3 h-3" /> {role === 'doctor' ? 'Practitioner Full Name' : 'Hospital Center Name'}
            </label>
            <input
              type="text" required value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder={role === 'doctor' ? 'e.g., Dr. Anirban Roy' : 'e.g., Medica Superspecialty Hospital'}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Physical Street Address
            </label>
            <input
              type="text" required value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., 1278, Mukundapur, E.M. Bypass, Kolkata"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
            />
          </div>

          {/* GPS Mapping Fields */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-blue-400" /> Latitude Coordinate
            </label>
            <input
              type="number" step="any" value={formData.lat}
              onChange={(e) => setFormData({...formData, lat: e.target.value})}
              placeholder="22.5085"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-blue-400" /> Longitude Coordinate
            </label>
            <input
              type="number" step="any" value={formData.lng}
              onChange={(e) => setFormData({...formData, lng: e.target.value})}
              placeholder="88.3972"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
            />
          </div>

          {/* CONDITIONAL SMART FIELDS: DOCTOR */}
          {role === 'doctor' && (
            <>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5">Medical Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-3 h-3" /> Consultation Fee (₹)
                </label>
                <input
                  type="number" required value={formData.fee}
                  onChange={(e) => setFormData({...formData, fee: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3 h-3" /> Experience (Years)
                </label>
                <input
                  type="number" value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                />
              </div>
            </>
          )}

          {/* CONDITIONAL SMART FIELDS: HOSPITAL */}
          {role === 'pharmacy' && (
            <>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5">Facility Classification</label>
                <select
                  value={formData.centerType}
                  onChange={(e) => setFormData({...formData, centerType: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                >
                  <option value="PRIVATE CENTER">Private Center</option>
                  <option value="GOVERNMENT HOSPITAL">Government Hospital</option>
                  <option value="TRUST / NGO FACILITY">Trust / NGO Facility</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-red-400" /> Active Emergency Beds
                </label>
                <input
                  type="number" min="0" required value={formData.emergencyBeds}
                  onChange={(e) => setFormData({...formData, emergencyBeds: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Secure Contact Email
            </label>
            <input
              type="email" required value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="admin@hospital.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Contact Phone
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-neutral-500">+91</span>
              <input
                type="tel" required maxLength={10} value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="9876543210"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-[#de7649]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-4 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deploy Smart Form Data to Production'}
        </button>
      </form>
    </div>
  );
}