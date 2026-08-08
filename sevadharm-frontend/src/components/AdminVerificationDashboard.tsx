import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, FileText, Search, ExternalLink, RefreshCw, UserCheck, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

interface PendingProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatar_url: string; // The photo they just uploaded
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export default function AdminVerificationDashboard() {
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'doctor' | 'pharmacy'>('all');
  const [search, setSearch] = useState('');

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

  // Fetch immediately on load
  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    // Enterprise Security: This only works because the database RLS policy allows admins
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: newStatus })
      .eq('id', id);

    if (!error) {
      // Remove them from the queue instantly so the screen feels fast
      setProfiles(prev => prev.filter(p => p.id !== id));
    } else {
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const filtered = profiles.filter(p => {
    const matchesRole = filterRole === 'all' || p.role === filterRole;
    const matchesSearch = p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                          p.email?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#de7649] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Enterprise Admin Portal
            </div>
            <h1 className="text-2xl font-black tracking-tight">Provider Verification Queue</h1>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={() => window.location.replace('/portal/dashboard')}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Back to Main Portal
            </button>
            <button 
              onClick={fetchPendingProfiles}
              className="px-4 py-2 bg-[#de7649] hover:bg-[#d16c41] text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* Filters & Search */}
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
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
        </div>

        {/* Dynamic Verification Queue */}
        {loading ? (
          <div className="py-20 flex flex-col items-center text-neutral-500">
             <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#de7649]" />
             <span className="text-xs font-bold uppercase tracking-widest">Loading secure queue...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-neutral-800/40 rounded-2xl border border-neutral-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Queue Clear</p>
            <p className="text-xs text-neutral-500 mt-1">No pending registrations require verification at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map(profile => (
              <div 
                key={profile.id} 
                className="bg-neutral-800/60 border border-neutral-700/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                
                <div className="flex items-start gap-4 max-w-2xl w-full">
                  {/* Photo / Logo Preview */}
                  <div className="w-16 h-16 rounded-xl border border-neutral-600 bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>

                  {/* Text Details */}
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
                        <FileText className="w-3.5 h-3.5" /> View Uploaded Photo Full Size <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Admin Actions */}
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
    </div>
  );
}