import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, FileText, Search, ExternalLink, 
  RefreshCw, UserCheck, Loader2, UserPlus, Database, UploadCloud, Stethoscope, Mail, Phone, MapPin, IndianRupee, Award, Building2, Activity, Navigation, Trash2 
} from 'lucide-react';
import { supabase } from '../supabase';

interface ProfileItem {
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
  const [activeTab, setActiveTab] = useState<'queue' | 'provision' | 'manage'>('queue');

  // QUEUE STATES
  const [pendingProfiles, setPendingProfiles] = useState<ProfileItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState(true);

  // MANAGE DIRECTORY STATES
  const [verifiedProfiles, setVerifiedProfiles] = useState<ProfileItem[]>([]);
  const [loadingManage, setLoadingManage] = useState(false);
  const [searchManage, setSearchManage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // PROVISION STATES
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
    setLoadingQueue(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) setPendingProfiles(data as ProfileItem[]);
    setLoadingQueue(false);
  };

  const fetchVerifiedProfiles = async () => {
    setLoadingManage(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });

    if (!error && data) setVerifiedProfiles(data as ProfileItem[]);
    setLoadingManage(false);
  };

  useEffect(() => {
    if (activeTab === 'queue') fetchPendingProfiles();
    if (activeTab === 'manage') fetchVerifiedProfiles();
  }, [activeTab]);

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
      const bedsAsNumber = Number(provForm.emergencyBeds) || 0; 

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: manualUserId,
          role: provForm.role,
          full_name: provForm.fullName,
          email: provForm.email.trim(),
          phone: `+91${provForm.phone.trim()}`,
          bio: provForm.bio || 'Verified provider in the SevaDharam network.',
          location: provForm.location, 
          lat: provForm.lat ? parseFloat(provForm.lat) : null,
          lng: provForm.lng ? parseFloat(provForm.lng) : null,
          avatar_url: avatar_url,
          verification_status: 'verified',
          is_profile_complete: true,
          fee: isDoc ? parseFloat(provForm.fee) || 500 : null,
          experience: isDoc ? parseInt(provForm.experience, 10) || 5 : null,
          center_type: !isDoc ? provForm.centerType : null,
          emergency_beds: !isDoc ? bedsAsNumber : null,
        });

      if (insertError) throw new Error(insertError.message);

      setProvSuccess(`${provForm.fullName} has been successfully deployed to production.`);
      setProvForm({ role: 'pharmacy', fullName: '', email: '', phone: '', specialty: '', fee: '500', location: '', lat: '', lng: '', experience: '5', bio: '', centerType: 'PRIVATE CENTER', emergencyBeds: '50' });
      setProvFile(null);
      setProvPreview(null);

    } catch (err: any) {
      setProvError(err.message || 'Failed to provision provider.');
    } finally {
      setProvLoading(false);
    }
  };
const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    try {
      // 1. Fetch the user's full profile to get their details
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !profile) throw new Error('Could not find profile data.');

      // 2. Update the profile status 
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ verification_status: newStatus })
        .eq('id', id)
        .select(); // .select() forces Supabase to throw an error if it blocks the update

      if (updateError) throw updateError;
      
      // Catch the "Silent Failure" if Supabase security blocks it
      if (!updated || updated.length === 0) {
        throw new Error("Supabase blocked the update (Row Level Security). Please disable RLS on the 'profiles' table in your Supabase dashboard.");
      }

      // 3. If approved, copy their data into the specific public directory table!
      if (newStatus === 'verified') {
        const role = profile.role?.toLowerCase() || 'doctor';

        if (role === 'doctor') {
          const { error: insertError } = await supabase.from('doctors').upsert({
            id: profile.id,
            name: profile.full_name,
            specialty: profile.bio || 'General Physician',
            experience_years: profile.experience || 0,
            hospital_affiliation: profile.location || 'Calcutta',
            consultation_fee: profile.fee || 500,
            is_available: true
          });
          if (insertError) throw new Error(`Doctor directory insert failed: ${insertError.message}`);
        } 
        else if (role === 'pharmacy') {
          const { error: insertError } = await supabase.from('pharmacies').upsert({
            id: profile.id,
            name: profile.full_name,
            location: profile.location || 'Calcutta'
          });
          if (insertError) throw new Error(`Pharmacy directory insert failed: ${insertError.message}`);
        }
        else if (role === 'hospital') {
          const { error: insertError } = await supabase.from('hospitals').upsert({
            id: profile.id,
            name: profile.full_name,
            location: profile.location || 'Calcutta',
            emergency_beds: profile.emergency_beds || 0,
            center_type: profile.center_type || 'Private Center'
          });
          if (insertError) throw new Error(`Hospital directory insert failed: ${insertError.message}`);
        }
      }

      // 4. Update the UI successfully
      setPendingProfiles(prev => prev.filter(p => p.id !== id));
      alert(`${profile.full_name} was successfully ${newStatus} and published to the website!`);

    } catch (err: any) {
      console.error('Approval Error:', err);
      alert(`Action failed: ${err.message}`);
    }
  };

  const filteredVerified = verifiedProfiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchManage.toLowerCase()) || 
    p.location?.toLowerCase().includes(searchManage.toLowerCase())
  );

  function handleDeleteProvider(id: string, full_name: string, role: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Enterprise Command Center
            </div>
            <h1 className="text-2xl font-black tracking-tight">Platform Administration</h1>
          </div>
          <button onClick={() => window.location.replace('/portal/dashboard')} className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer">
            Exit to Main Portal
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-px overflow-x-auto">
          <button onClick={() => setActiveTab('queue')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'queue' ? 'border-brand text-brand' : 'border-transparent text-neutral-500 hover:text-neutral-600'}`}>
            Verification Queue
          </button>
          <button onClick={() => setActiveTab('provision')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'provision' ? 'border-brand text-brand' : 'border-transparent text-neutral-500 hover:text-neutral-600'}`}>
            Provision Provider
          </button>
          <button onClick={() => setActiveTab('manage')} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'manage' ? 'border-brand text-brand' : 'border-transparent text-neutral-500 hover:text-neutral-600'}`}>
            Manage & Delete Directory
          </button>
        </div>

        {/* TAB 1: QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-4 animate-in fade-in">
            {loadingQueue ? (
              <div className="py-20 text-center text-neutral-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand" /></div>
            ) : pendingProfiles.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">Queue is clear. No pending registrations.</div>
            ) : (
              pendingProfiles.map(profile => (
                <div key={profile.id} className="bg-white shadow-sm border border-neutral-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <UserCheck className="w-6 h-6 text-neutral-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 text-sm">{profile.full_name}</h3>
                      <p className="text-xs text-neutral-500">{profile.email} • {profile.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => handleUpdateStatus(profile.id, 'rejected')} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-400 font-bold text-xs rounded-xl cursor-pointer">Reject</button>
                    <button onClick={() => handleUpdateStatus(profile.id, 'verified')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-neutral-900 font-bold text-xs rounded-xl cursor-pointer">Approve</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PROVISION */}
        {activeTab === 'provision' && (
          <div className="animate-in fade-in max-w-3xl">
            <div className="bg-white shadow-sm border border-neutral-200 rounded-3xl p-8">
              <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-6">Direct Platform Injection</h2>

              {provError && <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-xs font-bold">{provError}</div>}
              {provSuccess && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-400 text-xs font-bold">{provSuccess}</div>}

              <form onSubmit={handleProvisionSubmit} className="space-y-5">
                <div className="flex items-center gap-6 pb-2">
                  <label className="relative cursor-pointer group shrink-0">
                    <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${provPreview ? 'border-brand' : 'border-neutral-200 bg-neutral-50'}`}>
                      {provPreview ? <img src={provPreview} alt="" className="w-full h-full object-cover" /> : <><UploadCloud className="w-5 h-5 text-neutral-500 mb-1" /><span className="text-[8px] font-bold text-neutral-500">IMAGE</span></>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <div className="flex gap-3 flex-1">
                    <button type="button" onClick={() => setProvForm({...provForm, role: 'doctor'})} className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold uppercase ${provForm.role === 'doctor' ? 'border-brand bg-brand/10 text-neutral-900' : 'border-neutral-200 bg-white border border-neutral-200 text-neutral-500'}`}>Doctor</button>
                    <button type="button" onClick={() => setProvForm({...provForm, role: 'pharmacy'})} className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold uppercase ${provForm.role === 'pharmacy' ? 'border-brand bg-brand/10 text-neutral-900' : 'border-neutral-200 bg-white border border-neutral-200 text-neutral-500'}`}>Hospital</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Entity Name</label>
                    <input type="text" required value={provForm.fullName} onChange={(e) => setProvForm({...provForm, fullName: e.target.value})} placeholder="Name" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Full Location / Address</label>
                    <input type="text" required value={provForm.location} onChange={(e) => setProvForm({...provForm, location: e.target.value})} placeholder="Address, Kolkata" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Latitude</label>
                    <input type="number" step="any" value={provForm.lat} onChange={(e) => setProvForm({...provForm, lat: e.target.value})} placeholder="22.5726" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Longitude</label>
                    <input type="number" step="any" value={provForm.lng} onChange={(e) => setProvForm({...provForm, lng: e.target.value})} placeholder="88.3639" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>

                  {provForm.role === 'doctor' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Fee (₹)</label>
                        <input type="number" required value={provForm.fee} onChange={(e) => setProvForm({...provForm, fee: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Experience (Years)</label>
                        <input type="number" value={provForm.experience} onChange={(e) => setProvForm({...provForm, experience: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Center Type</label>
                        <select value={provForm.centerType} onChange={(e) => setProvForm({...provForm, centerType: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none">
                          <option value="PRIVATE CENTER">Private Center</option>
                          <option value="GOVERNMENT HOSPITAL">Government Hospital</option>
                          <option value="TRUST / NGO FACILITY">Trust / NGO Facility</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Emergency Beds</label>
                        <input type="number" min="0" required value={provForm.emergencyBeds} onChange={(e) => setProvForm({...provForm, emergencyBeds: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Email</label>
                    <input type="email" required value={provForm.email} onChange={(e) => setProvForm({...provForm, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Phone</label>
                    <input type="tel" required maxLength={10} value={provForm.phone} onChange={(e) => setProvForm({...provForm, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none" />
                  </div>
                </div>

                <button type="submit" disabled={provLoading} className="w-full py-4 bg-brand hover:bg-[#d16c41] text-neutral-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                  {provLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deploy to Production'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE & DELETE DIRECTORY */}
        {activeTab === 'manage' && (
          <div className="space-y-4 animate-in.fade-in">
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search live directory to manage..."
                  value={searchManage}
                  onChange={e => setSearchManage(e.target.value)}
                  className="w-full bg-white border border-neutral-200 border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-brand"
                />
              </div>
              <button onClick={fetchVerifiedProfiles} className="p-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-neutral-900 rounded-xl transition-all cursor-pointer">
                <RefreshCw className={`w-4 h-4 ${loadingManage ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingManage ? (
              <div className="py-20 text-center text-neutral-500"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand" /></div>
            ) : filteredVerified.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-xs">No active verified providers found in registry.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredVerified.map(profile => (
                  <div key={profile.id} className="bg-white shadow-sm border border-neutral-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-neutral-500" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${profile.role === 'doctor' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {profile.role}
                          </span>
                          <h3 className="font-bold text-neutral-800 text-sm">{profile.full_name}</h3>
                        </div>
                        <p className="text-xs text-neutral-500">{profile.email} • {profile.location || 'Kolkata'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteProvider(profile.id, profile.full_name, profile.role)}
                      disabled={deletingId === profile.id}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer w-full md:w-auto justify-center disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" /> {deletingId === profile.id ? 'Removing...' : 'Remove from Platform'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}