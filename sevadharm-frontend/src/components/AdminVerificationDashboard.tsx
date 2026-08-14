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
  credential_url?: string; // NEW: Added credential tracking
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
    role: 'doctor',
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
  
  // NEW: State for Credentials Document
  const [provCredentialFile, setProvCredentialFile] = useState<File | null>(null);

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

  // NEW: Handler for Credential Document
  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProvCredentialFile(e.target.files[0]);
    }
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvLoading(true);
    setProvError(null);
    setProvSuccess(null);

    try {
      let avatar_url = null;
      let credential_url = null;
      const manualUserId = crypto.randomUUID();

      // Upload Profile Image
      if (provFile) {
        const fileExt = provFile.name.split('.').pop();
        const fileName = `${manualUserId}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, provFile);
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrlData.publicUrl;
      }

      // NEW: Upload Medical Credential/License
      if (provCredentialFile) {
        const fileExt = provCredentialFile.name.split('.').pop();
        const fileName = `${manualUserId}-credential-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('credentials').upload(fileName, provCredentialFile);
        if (uploadError) throw new Error(`Credential upload failed: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage.from('credentials').getPublicUrl(fileName);
        credential_url = publicUrlData.publicUrl;
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
          credential_url: credential_url, // Save credential link
          verification_status: 'verified', // If provisioned by admin, skip queue
          is_profile_complete: true,
          fee: isDoc ? parseFloat(provForm.fee) || 500 : null,
          experience: isDoc ? parseInt(provForm.experience, 10) || 5 : null,
          center_type: !isDoc ? provForm.centerType : null,
          emergency_beds: !isDoc ? bedsAsNumber : null,
        });

      if (insertError) throw new Error(insertError.message);

      setProvSuccess(`${provForm.fullName} has been successfully deployed to production.`);
      setProvForm({ role: 'doctor', fullName: '', email: '', phone: '', specialty: '', fee: '500', location: '', lat: '', lng: '', experience: '5', bio: '', centerType: 'PRIVATE CENTER', emergencyBeds: '50' });
      setProvFile(null);
      setProvPreview(null);
      setProvCredentialFile(null); // Reset file

    } catch (err: any) {
      setProvError(err.message || 'Failed to provision provider.');
    } finally {
      setProvLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !profile) throw new Error('Could not find profile data.');

      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ verification_status: newStatus })
        .eq('id', id)
        .select(); 

      if (updateError) throw updateError;
      if (!updated || updated.length === 0) {
        throw new Error("Supabase blocked the update (Row Level Security). Please disable RLS on the 'profiles' table in your Supabase dashboard.");
      }

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

      setPendingProfiles(prev => prev.filter(p => p.id !== id));
      alert(`${profile.full_name} was successfully ${newStatus} and published!`);

    } catch (err: any) {
      console.error('Approval Error:', err);
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleDeleteProvider = async (id: string, full_name: string, role: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to completely remove ${full_name} and their login access from the platform?`
    );
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const roleTableMap: Record<string, string> = {
        doctor: 'doctors',
        pharmacy: 'pharmacies',
        hospital: 'hospitals',
      };

      const targetTable = roleTableMap[role?.toLowerCase()];
      if (targetTable) {
        await supabase.from(targetTable).delete().eq('id', id);
      }

      const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);
      if (profileError) throw profileError;

      const { error: authError } = await supabase.rpc('delete_auth_user', { uid: id });
      if (authError) throw authError;

      setVerifiedProfiles((prev) => prev.filter((p) => p.id !== id));
      alert(`${full_name}'s profile and login account were permanently deleted.`);
    } catch (err: any) {
      console.error('Failed to delete item:', err);
      alert(`Failed to remove provider: ${err.message || 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVerified = verifiedProfiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchManage.toLowerCase()) || 
    p.location?.toLowerCase().includes(searchManage.toLowerCase())
  );

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
                      
                      {/* NEW: View Credentials Button in Queue */}
                      {profile.credential_url && (
                        <a 
                          href={profile.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition"
                        >
                          <FileText className="w-3 h-3" /> View Credentials
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => handleUpdateStatus(profile.id, 'rejected')} className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-bold text-xs rounded-xl cursor-pointer transition">Reject</button>
                    <button onClick={() => handleUpdateStatus(profile.id, 'verified')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition">Approve</button>
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

              {provError && <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-600 text-xs font-bold">{provError}</div>}
              {provSuccess && <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-600 text-xs font-bold">{provSuccess}</div>}

              <form onSubmit={handleProvisionSubmit} className="space-y-5">
                <div className="flex items-center gap-6 pb-2">
                  <label className="relative cursor-pointer group shrink-0">
                    <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${provPreview ? 'border-brand' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'}`}>
                      {provPreview ? <img src={provPreview} alt="" className="w-full h-full object-cover" /> : <><UploadCloud className="w-5 h-5 text-neutral-500 mb-1" /><span className="text-[8px] font-bold text-neutral-500 text-center px-1">AVATAR<br/>IMAGE</span></>}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <div className="flex gap-3 flex-1">
                    <button type="button" onClick={() => setProvForm({...provForm, role: 'doctor'})} className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold uppercase transition ${provForm.role === 'doctor' ? 'border-brand bg-brand/10 text-brand' : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50'}`}>Doctor</button>
                    <button type="button" onClick={() => setProvForm({...provForm, role: 'pharmacy'})} className={`flex-1 py-3 rounded-xl border-2 text-xs font-bold uppercase transition ${provForm.role === 'pharmacy' ? 'border-brand bg-brand/10 text-brand' : 'border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50'}`}>Hospital</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Entity Name</label>
                    <input type="text" required value={provForm.fullName} onChange={(e) => setProvForm({...provForm, fullName: e.target.value})} placeholder="Name" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Full Location / Address</label>
                    <input type="text" required value={provForm.location} onChange={(e) => setProvForm({...provForm, location: e.target.value})} placeholder="Address, Kolkata" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Latitude</label>
                    <input type="number" step="any" value={provForm.lat} onChange={(e) => setProvForm({...provForm, lat: e.target.value})} placeholder="22.5726" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Longitude</label>
                    <input type="number" step="any" value={provForm.lng} onChange={(e) => setProvForm({...provForm, lng: e.target.value})} placeholder="88.3639" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>

                  {provForm.role === 'doctor' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Fee (₹)</label>
                        <input type="number" required value={provForm.fee} onChange={(e) => setProvForm({...provForm, fee: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Experience (Years)</label>
                        <input type="number" value={provForm.experience} onChange={(e) => setProvForm({...provForm, experience: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Center Type</label>
                        <select value={provForm.centerType} onChange={(e) => setProvForm({...provForm, centerType: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition">
                          <option value="PRIVATE CENTER">Private Center</option>
                          <option value="GOVERNMENT HOSPITAL">Government Hospital</option>
                          <option value="TRUST / NGO FACILITY">Trust / NGO Facility</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Emergency Beds</label>
                        <input type="number" min="0" required value={provForm.emergencyBeds} onChange={(e) => setProvForm({...provForm, emergencyBeds: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Email</label>
                    <input type="email" required value={provForm.email} onChange={(e) => setProvForm({...provForm, email: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Phone</label>
                    <input type="tel" required maxLength={10} value={provForm.phone} onChange={(e) => setProvForm({...provForm, phone: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-900 outline-none focus:border-brand transition" />
                  </div>

                  {/* NEW: Credential Upload Field */}
                  <div className="md:col-span-2 pt-2 border-t border-neutral-100">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-2">Medical License / Credentials (PDF or Image)</label>
                    <input 
                      type="file" 
                      accept=".pdf,image/*" 
                      onChange={handleCredentialChange} 
                      className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition cursor-pointer"
                    />
                    {provCredentialFile && <span className="text-[10px] text-green-600 font-bold mt-2 block">Attached: {provCredentialFile.name}</span>}
                  </div>
                </div>

                <button type="submit" disabled={provLoading} className="w-full py-4 bg-brand hover:bg-[#d16c41] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-4">
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
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-900 outline-none focus:border-brand transition"
                />
              </div>
              <button onClick={fetchVerifiedProfiles} className="p-2.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl transition-all cursor-pointer">
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
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${profile.role === 'doctor' ? 'bg-blue-500/20 text-blue-600' : 'bg-purple-500/20 text-purple-600'}`}>
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
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer w-full md:w-auto justify-center disabled:opacity-50"
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
