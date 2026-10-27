import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Heart, Activity, Coffee, Moon, ArrowRight, X, Edit3, 
  Droplet, UserCheck, Stethoscope, Award, Briefcase, Star, Building2, Package, 
  Camera, Upload, Trash2, Plus, Users, Copy, Check, ShieldCheck, Sparkles, 
  IdCard, AlertCircle
} from 'lucide-react';
import { UserProfile, FamilyMember } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onEditClick: () => void;
  completionPercent: number;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onEditClick, 
  completionPercent,
  onUpdateUser 
}: UserProfileModalProps) {
  if (!isOpen) return null;

  // Active Tab inside Profile Modal
  const isPatient = !currentUser.role || currentUser.role === 'patient';
  const isDoctor = currentUser.role === 'doctor';
  const isPharmacy = currentUser.role === 'pharmacy';

  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'family' | 'picture'>('profile');

  // Unique User ID
  const defaultPrefix = isDoctor ? 'SD-DOC' : isPharmacy ? 'SD-PHM' : 'SD-PAT';
  const uniqueId = currentUser.userId || `${defaultPrefix}-88214`;

  // Copied State
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Profile Picture Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentUser.profilePic || currentUser.avatar_url || null
  );
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        if (onUpdateUser) {
          onUpdateUser({ profilePic: base64, avatar_url: base64 });
        }
        setUploadSuccess('Profile picture updated successfully!');
        setTimeout(() => setUploadSuccess(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (onUpdateUser) {
      onUpdateUser({ profilePic: undefined, avatar_url: undefined });
    }
    setUploadSuccess('Profile picture removed (set to default)');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // 3D Avatar Library (Generated for SevaDharam: Patient boy/girl/man/woman, Doctor, Pharmacy)
  interface AvatarOption {
    id: string;
    label: string;
    roleCategory: 'patient' | 'doctor' | 'pharmacy';
    url: string;
    tag: string;
  }

  const avatarOptions: AvatarOption[] = [
    // Patient 3D Avatars
    { id: 'pat-man', label: 'Man', roleCategory: 'patient', url: '/avatars/patient-man.jpg', tag: 'Patient' },
    { id: 'pat-woman', label: 'Woman', roleCategory: 'patient', url: '/avatars/patient-woman.jpg', tag: 'Patient' },
    { id: 'pat-boy', label: 'Boy', roleCategory: 'patient', url: '/avatars/patient-boy.jpg', tag: 'Child / Kid' },
    { id: 'pat-girl', label: 'Girl', roleCategory: 'patient', url: '/avatars/patient-girl.jpg', tag: 'Child / Kid' },
    // Doctor 3D Avatars
    { id: 'doc-male', label: 'Doctor (Male)', roleCategory: 'doctor', url: '/avatars/doctor-male.jpg', tag: 'Doctor' },
    { id: 'doc-female', label: 'Doctor (Female)', roleCategory: 'doctor', url: '/avatars/doctor-female.jpg', tag: 'Doctor' },
    // Pharmacy 3D Avatar
    { id: 'phm-chem', label: 'Pharmacy', roleCategory: 'pharmacy', url: '/avatars/pharmacy.jpg', tag: 'Chemist' },
  ];

  // Active Category Filter for 3D Avatars
  const [avatarCategory, setAvatarCategory] = useState<'all' | 'patient' | 'doctor' | 'pharmacy'>(
    isDoctor ? 'doctor' : isPharmacy ? 'pharmacy' : 'patient'
  );

  // Family Members State
  const initialFamily: FamilyMember[] = currentUser.familyMembers && currentUser.familyMembers.length > 0 
    ? currentUser.familyMembers 
    : [
        {
          id: uniqueId,
          name: currentUser.name || 'Primary Patient',
          relationship: 'Self',
          age: currentUser.age || 38,
          gender: 'Male',
          bloodGroup: currentUser.bloodGroup || 'B+',
          allergies: currentUser.allergies || 'Penicillin',
          profilePic: currentUser.profilePic || currentUser.avatar_url || '/avatars/patient-man.jpg'
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
      ];

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamily);
  const [isAddFamilyOpen, setIsAddFamilyOpen] = useState(false);
  const [newFamilyForm, setNewFamilyForm] = useState({
    name: '',
    relationship: 'Child' as FamilyMember['relationship'],
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'B+',
    allergies: '',
    profilePic: '/avatars/patient-boy.jpg'
  });

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyForm.name.trim()) return;

    // Generate unique Patient ID
    const newId = `SD-PAT-${Math.floor(10000 + Math.random() * 90000)}`;

    // Default 3D avatar based on age and gender if not set
    let avatarToUse = newFamilyForm.profilePic;
    if (!avatarToUse) {
      const ageNum = parseInt(newFamilyForm.age) || 20;
      if (ageNum < 15) {
        avatarToUse = newFamilyForm.gender === 'Female' ? '/avatars/patient-girl.jpg' : '/avatars/patient-boy.jpg';
      } else {
        avatarToUse = newFamilyForm.gender === 'Female' ? '/avatars/patient-woman.jpg' : '/avatars/patient-man.jpg';
      }
    }

    const newMember: FamilyMember = {
      id: newId,
      name: newFamilyForm.name.trim(),
      relationship: newFamilyForm.relationship,
      age: parseInt(newFamilyForm.age) || 18,
      gender: newFamilyForm.gender,
      bloodGroup: newFamilyForm.bloodGroup,
      allergies: newFamilyForm.allergies.trim() || 'None',
      profilePic: avatarToUse
    };

    const updatedFamily = [...familyMembers, newMember];
    setFamilyMembers(updatedFamily);
    if (onUpdateUser) {
      onUpdateUser({ familyMembers: updatedFamily });
    }

    setIsAddFamilyOpen(false);
    setNewFamilyForm({
      name: '',
      relationship: 'Child',
      age: '',
      gender: 'Male',
      bloodGroup: 'B+',
      allergies: '',
      profilePic: '/avatars/patient-boy.jpg'
    });
    setUploadSuccess(`Added ${newMember.name} with Unique ID ${newId}`);
    setTimeout(() => setUploadSuccess(null), 3500);
  };

  const handleRemoveFamilyMember = (id: string) => {
    const updated = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(updated);
    if (onUpdateUser) {
      onUpdateUser({ familyMembers: updated });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#f0dac5]"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-br from-brand-light via-white to-orange-50/40 p-6 sm:p-8 border-b border-[#f0dac5] relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/80 text-neutral-500 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar / Profile Picture with Upload Camera Overlay */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#fdfaf6] rounded-3xl border-4 border-white shadow-md flex items-center justify-center text-brand shrink-0 relative overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-400">
                    <User className="w-10 h-10" />
                    <span className="text-[9px] font-bold mt-1 text-neutral-400">Default None</span>
                  </div>
                )}
              </div>

              {/* Quick Camera Overlay Button */}
              <button
                type="button"
                onClick={() => setActiveModalTab('picture')}
                className="absolute -bottom-1 -right-1 p-2 bg-brand hover:bg-brand-hover text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                title="Change or Upload Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="text-center sm:text-left flex-1 space-y-2 mt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{currentUser.name}</h2>
                  
                  {/* Unique ID Badge */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fdfaf6] border border-[#f0dac5] rounded-xl text-xs font-mono font-bold text-neutral-800">
                      <IdCard className="w-3.5 h-3.5 text-brand" />
                      <span>{uniqueId}</span>
                    </span>
                    <button
                      onClick={() => handleCopyId(uniqueId)}
                      className="p-1.5 hover:bg-white rounded-lg text-neutral-400 hover:text-brand transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-transparent hover:border-[#f0dac5]"
                      title="Copy Unique ID"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {isPatient && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-[#f0dac5] shadow-xs">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Health Profile</span>
                    <span className="text-xs font-bold text-brand">{completionPercent}%</span>
                  </div>
                )}

                {isDoctor && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-[#f0dac5] shadow-xs">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{currentUser.specialty || 'Cardiologist'}</span>
                  </div>
                )}

                {isPharmacy && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-[#f0dac5] shadow-xs">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Verified Pharmacy</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-1 text-neutral-600 text-xs">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand" />
                  <span className="font-mono">{currentUser.mobile || 'Not Provided'}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand" />
                  <span>{currentUser.email || 'Not Provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 border-t border-[#f0dac5] pt-4">
            <button
              onClick={() => setActiveModalTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeModalTab === 'profile'
                  ? 'bg-brand text-white shadow-sm shadow-brand/20'
                  : 'bg-white hover:bg-orange-50/50 text-neutral-600 border border-[#f0dac5]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Details</span>
            </button>

            {isPatient && (
              <button
                onClick={() => setActiveModalTab('family')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'family'
                    ? 'bg-brand text-white shadow-sm shadow-brand/20'
                    : 'bg-white hover:bg-orange-50/50 text-neutral-600 border border-[#f0dac5]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Family Centre ({familyMembers.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveModalTab('picture')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeModalTab === 'picture'
                  ? 'bg-brand text-white shadow-sm shadow-brand/20'
                  : 'bg-white hover:bg-orange-50/50 text-neutral-600 border border-[#f0dac5]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Profile Picture {photoPreview ? '●' : ''}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {uploadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-[#FAF7F2]">
          
          {/* ================= TAB 1: PROFILE DETAILS ================= */}
          {activeModalTab === 'profile' && (
            <>
              {isPatient && (
                <>
                  {/* Clinical Vitals */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand">
                      <Heart className="w-4 h-4" />
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">Clinical Vitals</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <InfoCard label="Unique Patient ID" value={uniqueId} icon={<IdCard className="w-3.5 h-3.5" />} />
                      <InfoCard label="Blood Group" value={currentUser.bloodGroup || 'B+'} icon={<Droplet className="w-3.5 h-3.5" />} />
                      <InfoCard label="Body Metrics" value={currentUser.weight && currentUser.height ? `${currentUser.weight}kg, ${currentUser.height}cm` : '72kg, 175cm'} icon={<UserCheck className="w-3.5 h-3.5" />} />
                      <InfoCard label="Emergency Contact" value={currentUser.emergencyContact || '+91 98765 43210'} />
                      <InfoCard label="Allergies" value={currentUser.allergies || 'Penicillin (Mild)'} fullWidth />
                      <InfoCard label="Chronic Conditions" value={currentUser.chronicConditions || 'Mild Hypertension'} fullWidth />
                    </div>
                  </div>

                  {/* Lifestyle & Habits */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 text-brand">
                      <Activity className="w-4 h-4" />
                      <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">Lifestyle &amp; Habits</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <InfoCard label="Diet" value={currentUser.dietType || 'Veg'} icon={<Coffee className="w-3.5 h-3.5" />} />
                      <InfoCard label="Activity Level" value={currentUser.activityLevel || 'Lightly Active'} />
                      <InfoCard label="Stress Level" value={currentUser.stressLevel || 'Low'} />
                      <InfoCard label="Smoking" value={currentUser.smokingHabit || 'Non-smoker'} />
                      <InfoCard label="Drinking" value={currentUser.drinkingHabit || 'Non-drinker'} />
                      <InfoCard label="Avg Sleep" value={currentUser.sleepHours ? `${currentUser.sleepHours} hrs` : '7.5 hrs'} icon={<Moon className="w-3.5 h-3.5" />} />
                    </div>
                  </div>
                </>
              )}

              {isDoctor && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand">
                    <Stethoscope className="w-4 h-4" />
                    <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">Doctor Credentials</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <InfoCard label="Unique Doctor ID" value={uniqueId} icon={<IdCard className="w-3.5 h-3.5" />} />
                    <InfoCard label="Specialty" value={currentUser.specialty || 'Cardiologist'} icon={<Star className="w-3.5 h-3.5" />} />
                    <InfoCard label="Qualifications" value={currentUser.qualification || 'MBBS, MD (AIIMS New Delhi)'} icon={<Award className="w-3.5 h-3.5" />} />
                    <InfoCard label="Experience" value={currentUser.experience ? `${currentUser.experience} Years` : '12 Years'} icon={<Briefcase className="w-3.5 h-3.5" />} />
                    <InfoCard label="Consultation Fee" value={currentUser.fee ? `₹${currentUser.fee} / Session` : '₹700 / Session'} icon={<Building2 className="w-3.5 h-3.5" />} />
                    <InfoCard label="Areas of Expertise" value={currentUser.expertise || 'Interventional Cardiology, Heart Failure, Preventive Healthcare'} fullWidth />
                  </div>
                </div>
              )}

              {isPharmacy && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand">
                    <Building2 className="w-4 h-4" />
                    <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-800">Pharmacy Registry</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <InfoCard label="Unique Pharmacy ID" value={uniqueId} icon={<IdCard className="w-3.5 h-3.5" />} />
                    <InfoCard label="Drug License Number" value={(currentUser as any).pharmacyRegNo || 'WB/PH/2024/8849'} icon={<Award className="w-3.5 h-3.5" />} />
                    <InfoCard label="GSTIN" value={(currentUser as any).gstn || '19AAACH7409R1ZZ'} />
                    <InfoCard label="Owner Mobile" value={currentUser.mobile || '+91 98765 43212'} />
                    <InfoCard label="Operating Hours" value="24x7 Digital & In-Store" icon={<Activity className="w-3.5 h-3.5" />} />
                    <InfoCard label="Marg ERP Sync" value="Connected & Active" icon={<Package className="w-3.5 h-3.5" />} />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= TAB 2: FAMILY CENTRE (FOR PATIENTS) ================= */}
          {activeModalTab === 'family' && isPatient && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#f0dac5]">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand" />
                    <span>Family Health Centre</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Link dependent family members with unique Patient IDs for seamless doctor appointments and medicine orders.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsAddFamilyOpen(true)}
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand/20 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Family Member</span>
                </button>
              </div>

              {/* Family Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white p-5 rounded-3xl border border-[#f0dac5] shadow-xs space-y-3 relative hover:border-brand transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#fdfaf6] border border-[#f0dac5] flex items-center justify-center text-brand font-bold text-sm shrink-0 overflow-hidden">
                          {member.profilePic ? (
                            <img src={member.profilePic} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{member.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900">{member.name}</h4>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-brand-light text-brand rounded-full border border-brand-soft">
                            {member.relationship}
                          </span>
                        </div>
                      </div>

                      {member.relationship !== 'Self' && (
                        <button
                          onClick={() => handleRemoveFamilyMember(member.id)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove family member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Unique Patient ID */}
                    <div className="p-2.5 bg-[#fdfaf6] border border-[#f0dac5] rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-sans">Patient ID:</span>
                        <strong className="text-neutral-800">{member.id}</strong>
                      </div>
                      <button
                        onClick={() => handleCopyId(member.id)}
                        className="px-2 py-1 bg-white hover:bg-orange-50/50 border border-[#f0dac5] rounded-lg text-[10px] font-sans font-bold text-neutral-600 hover:text-brand cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 pt-1">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Age &amp; Gender:</span>
                        <span className="font-semibold">{member.age} yrs • {member.gender || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Blood Group:</span>
                        <span className="font-semibold text-brand">{member.bloodGroup || 'Not specified'}</span>
                      </div>
                      {member.allergies && member.allergies !== 'None' && (
                        <div className="col-span-2 text-[11px] text-rose-600 font-medium">
                          Allergies: {member.allergies}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Family Member Modal */}
              <AnimatePresence>
                {isAddFamilyOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full space-y-4 border border-[#f0dac5]"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                          Add New Family Member
                        </h4>
                        <button onClick={() => setIsAddFamilyOpen(false)} className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddFamilyMember} className="space-y-3.5 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Full Name</label>
                          <input 
                            type="text" 
                            required 
                            value={newFamilyForm.name} 
                            onChange={(e) => setNewFamilyForm({ ...newFamilyForm, name: e.target.value })}
                            placeholder="e.g. Pooja Kumar" 
                            className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3.5 py-2.5 outline-none focus:border-brand font-medium text-neutral-800" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Relationship</label>
                            <select 
                              value={newFamilyForm.relationship} 
                              onChange={(e) => setNewFamilyForm({ ...newFamilyForm, relationship: e.target.value as any })}
                              className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand font-medium"
                            >
                              <option value="Spouse">Spouse</option>
                              <option value="Child">Child (Son/Daughter)</option>
                              <option value="Parent">Parent (Mother/Father)</option>
                              <option value="Sibling">Sibling (Brother/Sister)</option>
                              <option value="Other">Other Dependent</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Age</label>
                            <input 
                              type="number" 
                              required 
                              min="0"
                              max="120"
                              value={newFamilyForm.age} 
                              onChange={(e) => setNewFamilyForm({ ...newFamilyForm, age: e.target.value })}
                              placeholder="35" 
                              className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3.5 py-2.5 outline-none focus:border-brand font-medium" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Gender</label>
                            <select 
                              value={newFamilyForm.gender} 
                              onChange={(e) => setNewFamilyForm({ ...newFamilyForm, gender: e.target.value as any })}
                              className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand font-medium"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Blood Group</label>
                            <select 
                              value={newFamilyForm.bloodGroup} 
                              onChange={(e) => setNewFamilyForm({ ...newFamilyForm, bloodGroup: e.target.value })}
                              className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand font-medium"
                            >
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Known Allergies (Optional)</label>
                          <input 
                            type="text" 
                            value={newFamilyForm.allergies} 
                            onChange={(e) => setNewFamilyForm({ ...newFamilyForm, allergies: e.target.value })}
                            placeholder="e.g. Dust, Peanuts, Sulfa Drugs" 
                            className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3.5 py-2.5 outline-none focus:border-brand font-medium" 
                          />
                        </div>

                        {/* 3D Avatar Picker for Family Member */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                            Choose 3D Avatar Icon
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Boy', url: '/avatars/patient-boy.jpg' },
                              { label: 'Girl', url: '/avatars/patient-girl.jpg' },
                              { label: 'Man', url: '/avatars/patient-man.jpg' },
                              { label: 'Woman', url: '/avatars/patient-woman.jpg' },
                            ].map((av) => (
                              <button
                                key={av.url}
                                type="button"
                                onClick={() => setNewFamilyForm({ ...newFamilyForm, profilePic: av.url })}
                                className={`p-1.5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  newFamilyForm.profilePic === av.url
                                    ? 'border-brand bg-orange-50/60 shadow-xs'
                                    : 'border-[#f0dac5] bg-[#fdfaf6] hover:border-brand/50'
                                }`}
                              >
                                <img src={av.url} alt={av.label} className="w-10 h-10 rounded-xl object-cover" />
                                <span className="text-[10px] font-bold text-neutral-700">{av.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-brand-light/60 border border-brand-soft rounded-xl text-[10px] text-brand-dark flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span>A unique permanent Patient ID (e.g. SD-PAT-XXXXX) will be generated automatically.</span>
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-brand/20"
                        >
                          Register Family Member
                        </button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}

          {/* ================= TAB 3: PROFILE PICTURE UPLOAD ================= */}
          {activeModalTab === 'picture' && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-[#f0dac5] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-brand" />
                      <span>Profile Picture Settings</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Default is none. You can upload any personal photo or choose an avatar to personalize your account.
                    </p>
                  </div>
                  {photoPreview && (
                    <button
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                {/* Avatar Preview Box */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl">
                  <div className="w-24 h-24 rounded-3xl bg-white border-2 border-[#f0dac5] shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-400">
                        <User className="w-10 h-10" />
                        <span className="text-[9px] font-bold mt-1">Default (None)</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="font-bold text-sm text-neutral-800">
                      {photoPreview ? 'Custom Profile Picture Active' : 'No Profile Picture Configured (Default)'}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Upload a PNG, JPG, or WebP photo from your computer or phone.
                    </p>

                    <div className="pt-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoSelect} 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-brand/20 mx-auto sm:mx-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload From Device</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3D Stylized Avatar Library */}
                <div className="space-y-3 pt-3 border-t border-[#f0dac5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        <span>Choose a 3D Avatar Icon</span>
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Choose a 3D character avatar for Patient, Doctor, or Pharmacy:
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 bg-[#fdfaf6] p-1 rounded-xl border border-[#f0dac5] shrink-0 self-start sm:self-auto">
                      {(['all', 'patient', 'doctor', 'pharmacy'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAvatarCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            avatarCategory === cat
                              ? 'bg-brand text-white shadow-xs'
                              : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          {cat === 'all' ? 'All (7)' : cat === 'patient' ? 'Patient' : cat === 'doctor' ? 'Doctor' : 'Pharmacy'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D Avatar Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {avatarOptions
                      .filter((av) => avatarCategory === 'all' || av.roleCategory === avatarCategory)
                      .map((av) => (
                        <div
                          key={av.id}
                          onClick={() => {
                            setPhotoPreview(av.url);
                            if (onUpdateUser) onUpdateUser({ profilePic: av.url, avatar_url: av.url });
                            setUploadSuccess(`3D ${av.label} Avatar selected!`);
                            setTimeout(() => setUploadSuccess(null), 3000);
                          }}
                          className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${
                            photoPreview === av.url
                              ? 'border-brand bg-orange-50/50 shadow-md shadow-brand/15 ring-2 ring-brand/30'
                              : 'border-[#f0dac5] bg-white hover:border-brand/60 hover:bg-orange-50/20'
                          }`}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2 relative shadow-xs bg-[#fdfaf6]">
                            <img 
                              src={av.url} 
                              alt={av.label} 
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300" 
                            />
                            {photoPreview === av.url && (
                              <div className="absolute top-1 right-1 bg-brand text-white p-1 rounded-full shadow-sm">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-neutral-800 leading-tight">{av.label}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5">
                            {av.tag}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        {isPatient && activeModalTab === 'profile' && (
          <div className="p-6 bg-white border-t border-[#f0dac5] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider text-center sm:text-left">
              Keep your clinical profile updated for better Seva AI diagnosis.
            </p>
            <button
              onClick={() => {
                onClose();
                onEditClick();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Vitals &amp; Lifestyle</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InfoCard({ label, value, icon, fullWidth = false }: { label: string; value?: string; icon?: React.ReactNode; fullWidth?: boolean }) {
  const hasValue = value && value.trim() !== '' && value !== 'None';
  
  return (
    <div className={`p-4 rounded-2xl bg-white border border-[#f0dac5] shadow-xs ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-brand">{icon}</span>}
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-xs font-bold ${hasValue ? 'text-neutral-800' : 'text-neutral-300 italic'}`}>
        {hasValue ? value : 'Not provided'}
      </div>
    </div>
  );
}