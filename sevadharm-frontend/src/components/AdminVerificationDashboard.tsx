import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, FileText, Search, ExternalLink, 
  RefreshCw, UserCheck, Loader2, UserPlus, Database, UploadCloud, Stethoscope, Mail, Phone, MapPin, IndianRupee, Award, Building2, Activity, Navigation 
} from 'lucide-react';
import { supabase } from '../supabase';

interface PendingProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatar_url: string;
  fee?: number;
  location?: string;
  experience?: number;
  center_type?: string;
  emergency_beds?: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function AdminVerificationDashboard() {
  const [activeTab, setActiveTab] = useState<'queue' | 'provision'>('queue');
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'doctor' | 'pharmacy'>('all');
  const [search, setSearch] = useState('');

  const [provLoading, setProvLoading] = useState(false);
  const [provSuccess, setProvSuccess] = useState<string | null>(null);
  const [provError, setProvError] = useState<string | null>(null);
  
  const [provForm, setProvForm] = useState({
    role: 'pharmacy',
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    fee: '500',
    location: '',
    lat: '',
    lng: '',
    experience: '5',
    bio: '',
    centerType: 'PRIVATE CENTER',
    emergencyBeds: '50' 
  });
  
  const [provFile, setProvFile] = useState<File | null>(null);
  const [provPreview, setProvPreview] = useState<string | null>(null);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').eq('verification_status', 'pending').order('created_at', { ascending: false });
    if (!error && data) setProfiles(data as PendingProfile[]);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'queue') fetchPendingProfiles();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    const { error } = await supabase.from('profiles').update({ verification_status: newStatus }).eq('id', id);
    if (!error) setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProvFile(file);
      setProvPreview(URL.createObjectURL(file)); 
    }
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvLoading(true);
    setProvError(null);
    setProvSuccess(null);

    try {
      let avatar_url = null;
      const manualUserId = crypto.randomUUID();

      if (provFile) {
        const fileExt = provFile.name.split('.').pop();
        const fileName = `${manualUserId}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, provFile);
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrlData.publicUrl;
      }

      const isDoc = provForm.role === 'doctor';
      // Strictly force this to be a number for Supabase
      const bedsAsNumber = Number(provForm.emergencyBeds) || 0; 
      const parsedLat = provForm.lat ? parseFloat(provForm.lat) : null;
      const parsedLng = provForm.lng ? parseFloat(provForm.lng) : null;

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: manualUserId,
          role: provForm.role,
          full_name: provForm.fullName,
          email: provForm.email.trim(),
          phone: `+91${provForm.phone.trim()}`,
          bio: provForm.bio || 'Verified provider in the SevaDharm network.',
          location: provForm.location, 
          lat: parsedLat,
          lng: parsedLng,
          avatar_url: avatar_url,
          verification_status: 'verified',
          is_profile_complete: true,
          fee: isDoc ? parseFloat(provForm.fee) || 500 : null,
          experience: isDoc ? parseInt(provForm.experience, 10) || 5 : null,
          center_type: !isDoc ? provForm.centerType : null,
          emergency_beds: !isDoc ? bedsAsNumber : null,
        });

      if (insertError) throw new Error(insertError.message);

      setProvSuccess(`${provForm.fullName} has been injected with ${!isDoc ? bedsAsNumber + ' Beds & GPS coordinates' : 'data'}.`);
      
      setProvForm({ ...provForm, fullName: '', email: '', phone: '', location: '', lat: '', lng: '', bio: '', emergencyBeds: '50' });
      setProvFile(null);
      setProvPreview(null);

    } catch (err: any) {
      setProvError(err.message || 'Failed to provision provider.');
    } finally {
      setProvLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#de7649] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Enterprise Command Center
            </div>
            <h1 className="text-2xl font-black tracking-tight">Platform Administration</h1>
          </div>
          <button onClick={() => window.location.replace('/portal/dashboard')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer">
            Exit to Main Portal
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-neutral-800 pb-px">
          <button onClick={() => setActiveTab('queue')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'queue' ? 'border-[#de7649] text-[#de7649]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>
            Verification Queue
          </button>
          <button onClick={() => setActiveTab('provision')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${activeTab === 'provision' ? 'border-[#de7649] text-[#de7649]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>
            Provision Provider
          </button>
        </div>

        {activeTab === 'queue' && (
          <div className="animate-in fade-in py-12 text-center text-neutral-500">
            Please switch to "Provision Provider" to inject live GPS data.
          </div>
        )}

        {activeTab === 'provision' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl">
            <div className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-8">
              
              <div className="mb-6 border-b border-neutral-700 pb-6">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Direct Platform Injection</h2>
              </div>

              {provError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-red-400 text-xs font-bold">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{provError}</span>
                </div>
              )}
              {provSuccess && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /><span>{provSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProvisionSubmit} className="space-y-5">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-2">
                  <label className="relative cursor-pointer group shrink-0">
                    <div className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${provPreview ? 'border-[#de7649]' : 'border-neutral-600 group-hover:border-[#de7649] bg-neutral-900'}`}>
                      {provPreview ? <img src={provPreview} alt="Preview" className="w-full h-full object-cover" /> : <><UploadCloud className="w-6 h-6 text-neutral-500 group-hover:text-[#de7649] mb-1" /><span className="text-[9px] font-bold text-neutral-500 group-hover:text-[#de7649]">UPLOAD IMAGE</span></>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Registry Classification</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${provForm.role === 'doctor' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        <input type="radio" name="role" value="doctor" checked={provForm.role === 'doctor'} onChange={(e) => setProvForm({...provForm, role: e.target.value})} className="hidden" />
                        <Stethoscope className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Doctor</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${provForm.role === 'pharmacy' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        <input type="radio" name="role" value="pharmacy" checked={provForm.role === 'pharmacy'} onChange={(e) => setProvForm({...provForm, role: e.target.value})} className="hidden" />
                        <Building2 className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Hospital Center</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3" /> {provForm.role === 'doctor' ? 'Provider Name' : 'Hospital Name'}
                    </label>
                    <input type="text" required value={provForm.fullName} onChange={(e) => setProvForm({...provForm, fullName: e.target.value})} placeholder={provForm.role === 'doctor' ? 'e.g., Dr. Rajesh Kumar' : 'e.g., Apollo Hospitals'} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Full Location / Address (Text)
                    </label>
                    <input type="text" required value={provForm.location} onChange={(e) => setProvForm({...provForm, location: e.target.value})} placeholder="Kolkata, West Bengal" className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                  </div>

                  {/* GPS COORDINATES SECTION */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Navigation className="w-3 h-3 text-blue-400" /> Exact Latitude (GPS)
                    </label>
                    <input type="number" step="any" value={provForm.lat} onChange={(e) => setProvForm({...provForm, lat: e.target.value})} placeholder="22.5726" className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Navigation className="w-3 h-3 text-blue-400" /> Exact Longitude (GPS)
                    </label>
                    <input type="number" step="any" value={provForm.lng} onChange={(e) => setProvForm({...provForm, lng: e.target.value})} placeholder="88.3639" className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                  </div>
                  <p className="md:col-span-2 text-[10px] text-neutral-500 -mt-2 mb-2 italic">Tip: Right-click any location on Google Maps to instantly copy its Latitude and Longitude.</p>

                  {/* Dynamic Fields */}
                  {provForm.role === 'doctor' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <IndianRupee className="w-3 h-3" /> Consultation Fee (₹)
                        </label>
                        <input type="number" required value={provForm.fee} onChange={(e) => setProvForm({...provForm, fee: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <Award className="w-3 h-3" /> Experience (Years)
                        </label>
                        <input type="number" value={provForm.experience} onChange={(e) => setProvForm({...provForm, experience: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" /> Center Type
                        </label>
                        <select value={provForm.centerType} onChange={(e) => setProvForm({...provForm, centerType: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]">
                          <option value="PRIVATE CENTER">Private Center</option>
                          <option value="GOVERNMENT HOSPITAL">Government Hospital</option>
                          <option value="TRUST / NGO FACILITY">Trust / NGO Facility</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-red-400" /> Active Emergency Beds
                        </label>
                        <input type="number" min="0" required value={provForm.emergencyBeds} onChange={(e) => setProvForm({...provForm, emergencyBeds: e.target.value})} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Portal Access Email
                    </label>
                    <input type="email" required value={provForm.email} onChange={(e) => setProvForm({...provForm, email: e.target.value})} placeholder="admin@domain.com" className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Registry Phone
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-neutral-500">+91</span>
                      <input type="tel" required maxLength={10} value={provForm.phone} onChange={(e) => setProvForm({...provForm, phone: e.target.value})} placeholder="98765 43210" className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-[#de7649]" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={provLoading} className="w-full mt-4 py-4 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  {provLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deploy Configuration & Coordinates'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}