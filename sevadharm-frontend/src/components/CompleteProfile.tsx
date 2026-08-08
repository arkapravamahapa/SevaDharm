import React, { useState, useEffect } from 'react';
import { ShieldCheck, UploadCloud, User, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function CompleteProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('provider');

  // Form States
  const [bio, setBio] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    // Grab the user's role so we can customize the text (Doctor vs Pharmacy)
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role) setUserRole(data.role);
      }
    }
    fetchRole();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Create a preview URL so they can see the image they just selected
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user session found. Please log in again.");

      let avatar_url = null;

      // 1. Upload the image to Supabase Storage (if they selected one)
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrlData.publicUrl;
      }

      // 2. Update their profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          // We append specialty to bio so we don't need to create a whole new database column
          bio: specialty ? `${specialty} | ${bio}` : bio, 
          avatar_url: avatar_url,
          is_profile_complete: true,
          verification_status: 'pending' // Locks them until admin approves
        })
        .eq('id', user.id);

      if (updateError) throw new Error(updateError.message);

      setSuccess("Profile submitted successfully! Redirecting...");
      
      // 3. Send them to their dashboard after 2 seconds
      setTimeout(() => {
        if (userRole === 'doctor') window.location.replace('/portal/doctor-dashboard');
        else if (userRole === 'pharmacy') window.location.replace('/portal/pharmacy-dashboard');
        else window.location.replace('/portal/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[28px] border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 max-w-lg w-full relative">
        
        {/* Header */}
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
            COMPLETE YOUR PROFILE
          </h2>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            Please provide your professional details for administrative verification.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-600 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center pt-2 pb-4">
            <label className="relative cursor-pointer group">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${avatarPreview ? 'border-[#de7649]' : 'border-neutral-300 group-hover:border-[#de7649] bg-neutral-50'}`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-[#de7649] transition-colors mb-1" />
                    <span className="text-[9px] font-bold text-neutral-400 group-hover:text-[#de7649]">UPLOAD</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <span className="text-[10px] font-bold text-neutral-400 uppercase mt-2 tracking-wider">
              {userRole === 'pharmacy' ? 'Store Logo / Photo' : 'Professional Photo'}
            </span>
          </div>

          {/* Specialty / Clinic Name */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3" /> 
              {userRole === 'pharmacy' ? 'Pharmacy / Hospital Name' : 'Medical Specialty (e.g. Cardiologist)'}
            </label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder={userRole === 'pharmacy' ? 'City Care Pharmacy' : 'General Physician'}
              className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all"
            />
          </div>

          {/* Bio / Description */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Professional Description & Address
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your experience, qualifications, and full clinic address..."
              className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs font-medium text-neutral-800 outline-none focus:bg-white focus:border-[#f07b43] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-[0_8px_16px_rgba(222,118,73,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SUBMIT FOR VERIFICATION'}
          </button>
        </form>

      </div>
    </div>
  );
}