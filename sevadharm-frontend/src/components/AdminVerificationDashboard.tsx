import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, FileText, Search, ExternalLink, 
  RefreshCw, UserCheck, Loader2, UserPlus, Database, UploadCloud, Stethoscope, Mail, Phone, MapPin, IndianRupee, Award 
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
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function AdminVerificationDashboard() {
  const [activeTab, setActiveTab] = useState<'queue' | 'provision'>('queue');

  // QUEUE STATES
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'doctor' | 'pharmacy'>('all');
  const [search, setSearch] = useState('');

  // PROVISION STATES
  const [provLoading, setProvLoading] = useState(false);
  const [provSuccess, setProvSuccess] = useState<string | null>(null);
  const [provError, setProvError] = useState<string | null>(null);
  const [provForm, setProvForm] = useState({
    role: 'doctor',
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    fee: '500',
    location: 'Calcutta',
    experience: '5',
    bio: ''
  });
  const [provFile, setProvFile] = useState<File | null>(null);
  const [provPreview, setProvPreview] = useState<string | null>(null);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data as PendingProfile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'queue') {
      fetchPendingProfiles();
    }
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: newStatus })
      .eq('id', id);

    if (!error) {
      setProfiles(prev => prev.filter(p => p.id !== id));
    } else {
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const filteredQueue = profiles.filter(p => {
    const matchesRole = filterRole === 'all' || p.role === filterRole;
    const matchesSearch = p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                          p.email?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, provFile);

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: manualUserId,
          role: provForm.role,
          full_name: provForm.fullName,
          email: provForm.email.trim(),
          phone: `+91${provForm.phone.trim()}`,
          bio: provForm.specialty ? `${provForm.specialty} | ${provForm.bio}` : provForm.bio,
          fee: parseFloat(provForm.fee) || 500,
          location: provForm.location,
          experience: parseInt(provForm.experience, 10) || 5,
          avatar_url: avatar_url,
          verification_status: 'verified',
          is_profile_complete: true
        });

      if (insertError) throw new Error(insertError.message);

      setProvSuccess(`${provForm.fullName} has been successfully provisioned and deployed.`);
      
      setProvForm({
        role: 'doctor',
        fullName: '',
        email: '',
        phone: '',
        specialty: '',
        fee: '500',
        location: 'Calcutta',
        experience: '5',
        bio: ''
      });
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
          
          <button 
            onClick={() => window.location.replace('/portal/dashboard')}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Exit to Main Portal
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-neutral-800 pb-px">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'queue' ? 'border-[#de7649] text-[#de7649]' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Database className="w-4 h-4" /> Verification Queue
          </button>
          <button
            onClick={() => setActiveTab('provision')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'provision' ? 'border-[#de7649] text-[#de7649]' : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Provision Provider
          </button>
        </div>

        {activeTab === 'queue' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[#de7649]"
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  {(['all', 'doctor', 'pharmacy'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        filterRole === role ? 'bg-[#de7649] text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={fetchPendingProfiles}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all cursor-pointer"
                  title="Refresh Queue"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#de7649]" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading secure queue...</span>
              </div>
            ) : filteredQueue.length === 0 ? (
              <div className="py-20 text-center bg-neutral-800/40 rounded-2xl border border-neutral-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Queue Clear</p>
                <p className="text-xs text-neutral-500 mt-1">No pending registrations require verification at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredQueue.map(profile => (
                  <div 
                    key={profile.id} 
                    className="bg-neutral-800/60 border border-neutral-700/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 max-w-2xl w-full">
                      <div className="w-16 h-16 rounded-xl border border-neutral-600 bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="w-6 h-6 text-neutral-500" />
                        )}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            profile.role === 'doctor' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {profile.role}
                          </span>
                          <h3 className="text-base font-bold text-white">{profile.full_name || 'Unnamed Provider'}</h3>
                        </div>
                        <p className="text-xs text-neutral-400 font-mono">{profile.email} • {profile.phone || 'No phone provided'}</p>
                        {profile.bio && (
                          <p className="text-xs text-neutral-300 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 mt-2">
                            {profile.bio}
                          </p>
                        )}
                        {profile.avatar_url && (
                          <a 
                            href={profile.avatar_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#de7649] hover:underline font-bold pt-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Credential Document <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-700">
                      <button
                        onClick={() => handleUpdateStatus(profile.id, 'rejected')}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(profile.id, 'verified')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'provision' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl">
            <div className="bg-neutral-800/60 border border-neutral-700 rounded-3xl p-8">
              
              <div className="mb-6 border-b border-neutral-700 pb-6">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Direct Platform Injection</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Configure and deploy complete provider profiles including fees, images, location, and credentials.
                </p>
              </div>

              {provError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-red-400 text-xs font-bold">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{provError}</span>
                </div>
              )}

              {provSuccess && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{provSuccess}</span>
                </div>
              )}

              <form onSubmit={handleProvisionSubmit} className="space-y-5">
                
                {/* Image Upload & Role Selection */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-2">
                  <label className="relative cursor-pointer group shrink-0">
                    <div className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${provPreview ? 'border-[#de7649]' : 'border-neutral-600 group-hover:border-[#de7649] bg-neutral-900'}`}>
                      {provPreview ? (
                        <img src={provPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-neutral-500 group-hover:text-[#de7649] transition-colors mb-1" />
                          <span className="text-[9px] font-bold text-neutral-500 group-hover:text-[#de7649]">UPLOAD IMAGE</span>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Classification</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${provForm.role === 'doctor' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        <input type="radio" name="role" value="doctor" checked={provForm.role === 'doctor'} onChange={(e) => setProvForm({...provForm, role: e.target.value})} className="hidden" />
                        <Stethoscope className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Doctor</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${provForm.role === 'pharmacy' ? 'border-[#de7649] bg-[#de7649]/10 text-white' : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        <input type="radio" name="role" value="pharmacy" checked={provForm.role === 'pharmacy'} onChange={(e) => setProvForm({...provForm, role: e.target.value})} className="hidden" />
                        <MapPin className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Hospital / Pharmacy</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3" /> Full Name / Hospital Name
                    </label>
                    <input
                      type="text" required value={provForm.fullName} onChange={(e) => setProvForm({...provForm, fullName: e.target.value})}
                      placeholder={provForm.role === 'doctor' ? 'e.g., Dr. Rajesh Kumar' : 'e.g., City General Hospital'}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Stethoscope className="w-3 h-3" /> Specialty / Facility Type
                    </label>
                    <input
                      type="text" value={provForm.specialty} onChange={(e) => setProvForm({...provForm, specialty: e.target.value})}
                      placeholder={provForm.role === 'doctor' ? 'e.g., Cardiologist' : 'e.g., Multi-Specialty & ICU'}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>

                  {/* Consultation Fee & Location Inputs */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <IndianRupee className="w-3 h-3" /> Consultation Fee (₹)
                    </label>
                    <input
                      type="number" required value={provForm.fee} onChange={(e) => setProvForm({...provForm, fee: e.target.value})}
                      placeholder="500"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Practice Location / City
                    </label>
                    <input
                      type="text" required value={provForm.location} onChange={(e) => setProvForm({...provForm, location: e.target.value})}
                      placeholder="Calcutta"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Award className="w-3 h-3" /> {provForm.role === 'doctor' ? 'Experience (Years)' : 'Bed Capacity / Rating'}
                    </label>
                    <input
                      type="number" value={provForm.experience} onChange={(e) => setProvForm({...provForm, experience: e.target.value})}
                      placeholder="5"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Contact Email
                    </label>
                    <input
                      type="email" required value={provForm.email} onChange={(e) => setProvForm({...provForm, email: e.target.value})}
                      placeholder="provider@domain.com"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-neutral-500">+91</span>
                      <input
                        type="tel" required maxLength={10} value={provForm.phone} onChange={(e) => setProvForm({...provForm, phone: e.target.value})}
                        placeholder="98765 43210"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-[#de7649] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Professional Overview & Address
                  </label>
                  <textarea
                    required rows={3} value={provForm.bio} onChange={(e) => setProvForm({...provForm, bio: e.target.value})}
                    placeholder="Enter full qualifications, chamber details, and physical address..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={provLoading}
                  className="w-full mt-4 py-4 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-[0_8px_16px_rgba(222,118,73,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {provLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Inject Verified Provider to Production'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}