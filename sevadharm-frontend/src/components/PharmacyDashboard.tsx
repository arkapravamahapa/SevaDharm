import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, Building2, FileCheck, Stethoscope, Users, Receipt, AlertCircle, 
  CheckCircle, Clock, Search, Bell, Upload, Camera, Printer, Phone, Calendar, 
  ArrowRight, ShieldCheck, ChevronRight, Package, Truck, Pill, Trash2, Plus, 
  RefreshCw, Send, CheckCircle2, FileText, Check, AlertTriangle, Sparkles, 
  DollarSign, Smartphone, Eye, ExternalLink, Filter, MapPin, X
} from 'lucide-react';

interface PharmacyDashboardProps {
  currentUser?: any;
}

export default function PharmacyDashboard({ currentUser }: PharmacyDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'prescriptions' | 'verification' | 'pos' | 'doctors' | 'inventory' | 'refills' | 'deliveries'
  >('dashboard');

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pharmacy Profile Info from currentUser or demo defaults
  const pharmacyInfo = {
    name: currentUser?.pharmacyName || currentUser?.name || 'ABC Medical Store',
    regNo: currentUser?.pharmacyRegNo || 'WB/PH/2024/8849',
    gstn: currentUser?.gstn || '19AAACH7409R1ZZ',
    mobile: currentUser?.ownerMobile || currentUser?.mobile || '+91 98765 43212',
    location: currentUser?.location || 'Kolkata, West Bengal',
    margStatus: 'Marg ERP 9+ Live Sync Active',
  };

  // ================= TAB 1: DASHBOARD METRICS =================
  const stats = [
    { label: "Today's Prescriptions", value: '24', delta: '▲ 6% vs yesterday', isUp: true, color: 'text-brand', border: 'border-t-brand' },
    { label: 'Pending Verification', value: '7', delta: '▼ 3% vs yesterday', isUp: false, color: 'text-amber-600', border: 'border-t-amber-500' },
    { label: 'Patients Served', value: '18', delta: '▲ 12% vs yesterday', isUp: true, color: 'text-[var(--color-navy)]', border: 'border-t-[var(--color-navy)]' },
    { label: 'Medicines Dispensed', value: '63', delta: '▲ 8% vs yesterday', isUp: true, color: 'text-brand-dark', border: 'border-t-brand-dark' },
    { label: 'Refills Due Today', value: '5', delta: '▲ 2% vs yesterday', isUp: true, color: 'text-emerald-700', border: 'border-t-emerald-600' },
    { label: 'Consult Requests', value: '3', delta: '▲ 1% vs yesterday', isUp: true, color: 'text-rose-600', border: 'border-t-rose-500' }
  ];

  const [actionItems, setActionItems] = useState([
    { id: 'act-1', patient: 'Rahul Sharma', phone: '+91 98765 43210', action: 'Verify prescription', tagColor: 'bg-brand-light text-brand border-brand-soft', details: 'Uploaded · 2 mins ago (Rx #1024)', time: '10:24 AM', type: 'verify' },
    { id: 'act-2', patient: 'Suman Das', phone: '+91 91234 56781', action: 'Patient consent pending', tagColor: 'bg-amber-50 text-amber-700 border-amber-200', details: 'Consent OTP sent (Rx #1023)', time: '09:50 AM', type: 'consent' },
    { id: 'act-3', patient: 'Amit Patnaik', phone: '+91 98811 22334', action: 'Consultation request', tagColor: 'bg-orange-50 text-brand-dark border-orange-200', details: 'Doctor: Dr. Amit Verma (Rx #1021)', time: '09:15 AM', type: 'consult' },
    { id: 'act-4', patient: 'Neha Gupta', phone: '+91 90011 22334', action: 'Refill due today', tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', details: 'Medicine: Metformin 500mg SR', time: '08:45 AM', type: 'refill' },
    { id: 'act-5', patient: 'Prakash Shaw', phone: '+91 99001 12233', action: 'Review AI analysis', tagColor: 'bg-rose-50 text-rose-700 border-rose-200', details: 'AI Confidence: 72% · Review drug salt', time: '08:20 AM', type: 'review' },
  ]);

  // ================= TAB 2 & 3: PRESCRIPTION UPLOAD & AI STATE =================
  const [selectedRxFile, setSelectedRxFile] = useState<string | null>('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(94);
  const [extractedDoctor, setExtractedDoctor] = useState('Dr. Amit Verma, MD (AIIMS)');
  const [extractedPatient, setExtractedPatient] = useState('Rahul Sharma, 42M');
  const [extractedDate, setExtractedDate] = useState('27 Oct 2026');
  const [extractedDiagnosis, setExtractedDiagnosis] = useState('Type-2 Diabetes Mellitus with Essential Hypertension');

  const [extractedMeds, setExtractedMeds] = useState([
    { id: 'm1', name: 'Metformin 500mg', dosage: '1 Tab', freq: '1-0-1 (After Meals)', duration: '30 Days', stock: 'In Stock (Marg: 140 Tabs)', verified: true },
    { id: 'm2', name: 'Telmisartan 40mg', dosage: '1 Tab', freq: '1-0-0 (Morning)', duration: '30 Days', stock: 'In Stock (Marg: 95 Tabs)', verified: true },
    { id: 'm3', name: 'Atorvastatin 10mg', dosage: '1 Tab', freq: '0-0-1 (Night)', duration: '30 Days', stock: 'Low Stock (Marg: 12 Tabs)', verified: false },
    { id: 'm4', name: 'Vitamin B-Complex + Zinc', dosage: '1 Cap', freq: '0-1-0 (After Lunch)', duration: '15 Days', stock: 'In Stock (Marg: 210 Caps)', verified: true },
  ]);

  // Verification step states
  const [isPharmacistSigned, setIsPharmacistSigned] = useState(false);
  const [patientConsentOtp, setPatientConsentOtp] = useState('');
  const [isConsentVerified, setIsConsentVerified] = useState(false);
  const [consentOtpSent, setConsentOtpSent] = useState(false);

  // ================= TAB 4: POS BILLING STATE =================
  interface PosItem {
    id: string;
    name: string;
    batch: string;
    expiry: string;
    qty: number;
    mrp: number;
    discount: number;
    gstRate: number;
  }

  const [posCustomer, setPosCustomer] = useState({
    name: 'Rahul Sharma',
    phone: '9876543210',
    doctor: 'Dr. Amit Verma',
    rxNumber: 'RX-2026-1024'
  });

  const [posItems, setPosItems] = useState<PosItem[]>([
    { id: 'p1', name: 'Metformin 500mg Tab (10s)', batch: 'MT24A10', expiry: '11/2027', qty: 3, mrp: 42.0, discount: 10, gstRate: 12 },
    { id: 'p2', name: 'Telmisartan 40mg Tab (15s)', batch: 'TL99B04', expiry: '08/2027', qty: 2, mrp: 110.0, discount: 10, gstRate: 12 },
    { id: 'p3', name: 'Atorvastatin 10mg Tab (10s)', batch: 'AT88C11', expiry: '04/2027', qty: 3, mrp: 98.0, discount: 5, gstRate: 12 },
    { id: 'p4', name: 'Becozinc B-Complex (15s)', batch: 'BC12D09', expiry: '12/2028', qty: 1, mrp: 55.0, discount: 0, gstRate: 12 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // POS Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;

    posItems.forEach(item => {
      const gross = item.qty * item.mrp;
      const disc = (gross * item.discount) / 100;
      const taxable = gross - disc;
      const gst = (taxable * item.gstRate) / 100;
      subtotal += gross;
      totalDiscount += disc;
      totalGst += gst;
    });

    const netTotal = subtotal - totalDiscount + totalGst;
    const rounded = Math.round(netTotal);
    const roundOff = (rounded - netTotal).toFixed(2);

    return {
      subtotal: subtotal.toFixed(2),
      discount: totalDiscount.toFixed(2),
      cgst: (totalGst / 2).toFixed(2),
      sgst: (totalGst / 2).toFixed(2),
      grandTotal: rounded.toFixed(2),
      roundOff
    };
  };

  const posTotals = calculateTotals();

  const handleAddPosItem = () => {
    if (!newItemName.trim()) return;
    const item: PosItem = {
      id: 'p-' + Date.now(),
      name: newItemName.trim(),
      batch: 'BT' + Math.floor(1000 + Math.random() * 9000),
      expiry: '06/2028',
      qty: 1,
      mrp: 65.0,
      discount: 10,
      gstRate: 12
    };
    setPosItems([...posItems, item]);
    setNewItemName('');
    showToast(`Added ${item.name} to bill`);
  };

  const handleRemovePosItem = (id: string) => {
    setPosItems(posItems.filter(i => i.id !== id));
  };

  const handleUpdatePosQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setPosItems(posItems.map(i => (i.id === id ? { ...i, qty } : i)));
  };

  // ================= TAB 5: DOCTORS DIRECTORY =================
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('All');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    specialty: 'General Physician',
    regNo: '',
    phone: '',
    fee: '400',
    available: '09:00 AM - 01:00 PM'
  });

  const [doctorsList, setDoctorsList] = useState([
    { id: 'doc-1', name: 'Dr. Amit Verma', specialty: 'Cardiologist', reg: 'MCI-34891', phone: '+91 98301 22334', fee: '₹700', status: 'Available in OPD', rating: 4.9, patientsToday: 8 },
    { id: 'doc-2', name: 'Dr. Priya Nair', specialty: 'Dermatologist', reg: 'WBMC-88120', phone: '+91 98302 33445', fee: '₹500', status: 'Online Teleconsult', rating: 4.8, patientsToday: 5 },
    { id: 'doc-3', name: 'Dr. Rohit Singh', specialty: 'General Physician', reg: 'MCI-19455', phone: '+91 98303 44556', fee: '₹400', status: 'Available in OPD', rating: 4.7, patientsToday: 12 },
    { id: 'doc-4', name: 'Dr. Sunita Deshmukh', specialty: 'Gynecologist', reg: 'MMC-44102', phone: '+91 98304 55667', fee: '₹800', status: 'Next Slot: 04:00 PM', rating: 4.9, patientsToday: 4 },
    { id: 'doc-5', name: 'Dr. Aarav Sharma', specialty: 'Internal Medicine', reg: 'DMC-90812', phone: '+91 98305 66778', fee: '₹600', status: 'Available in OPD', rating: 5.0, patientsToday: 9 },
  ]);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorForm.name.trim()) return;
    const doc = {
      id: 'doc-' + Date.now(),
      name: newDoctorForm.name.startsWith('Dr.') ? newDoctorForm.name : `Dr. ${newDoctorForm.name}`,
      specialty: newDoctorForm.specialty,
      reg: newDoctorForm.regNo || 'REG-PENDING',
      phone: newDoctorForm.phone || '+91 98765 00000',
      fee: `₹${newDoctorForm.fee}`,
      status: 'Affiliated · Active',
      rating: 5.0,
      patientsToday: 0
    };
    setDoctorsList([doc, ...doctorsList]);
    setIsAddDoctorModalOpen(false);
    setNewDoctorForm({ name: '', specialty: 'General Physician', regNo: '', phone: '', fee: '400', available: '09:00 AM - 01:00 PM' });
    showToast(`Added ${doc.name} to Pharmacy Medical Network!`);
  };

  // ================= TAB 6: INVENTORY (MARG ERP) =================
  const [inventoryList, setInventoryList] = useState([
    { id: 'inv-1', name: 'Metformin 500mg (Glycomet)', salt: 'Metformin HCl', batch: 'GM500A', stock: 140, reorderLevel: 30, mrp: 42.0, status: 'In Stock' },
    { id: 'inv-2', name: 'Telmisartan 40mg (Telma)', salt: 'Telmisartan IP', batch: 'TL40B1', stock: 95, reorderLevel: 25, mrp: 110.0, status: 'In Stock' },
    { id: 'inv-3', name: 'Atorvastatin 10mg (Atorva)', salt: 'Atorvastatin Calcium', batch: 'AT10C9', stock: 8, reorderLevel: 20, mrp: 98.0, status: 'Low Stock' },
    { id: 'inv-4', name: 'Paracetamol 650mg (Dolo)', salt: 'Paracetamol IP', batch: 'DL65D4', stock: 450, reorderLevel: 50, mrp: 32.0, status: 'In Stock' },
    { id: 'inv-5', name: 'Pantoprazole 40mg (Pan 40)', salt: 'Pantoprazole Sodium', batch: 'PN40E2', stock: 15, reorderLevel: 30, mrp: 85.0, status: 'Low Stock' },
    { id: 'inv-6', name: 'Amoxicillin + Clav 625 (Augmentin)', salt: 'Amoxycillin & Pot Clavulanate', batch: 'AG62F8', stock: 0, reorderLevel: 15, mrp: 198.0, status: 'Out of Stock' },
    { id: 'inv-7', name: 'Becozinc B-Complex Capsule', salt: 'Vitamin B Complex + Zinc', batch: 'BC12G3', stock: 210, reorderLevel: 40, mrp: 55.0, status: 'In Stock' },
  ]);

  // ================= TAB 7: REFILL REMINDERS =================
  const [refillsList, setRefillsList] = useState([
    { id: 'rf-1', patient: 'Neha Gupta', phone: '+91 90011 22334', medicine: 'Metformin 500mg SR', dueDays: 'Due Today', status: 'Pending Alert' },
    { id: 'rf-2', patient: 'Vikram Singh', phone: '+91 98111 55667', medicine: 'Telmisartan 40mg', dueDays: 'In 2 Days', status: 'Scheduled' },
    { id: 'rf-3', patient: 'Sunita Sharma', phone: '+91 97222 66778', medicine: 'Thyronorm 50mcg', dueDays: 'In 3 Days', status: 'Scheduled' },
    { id: 'rf-4', patient: 'Kiran Patel', phone: '+91 98333 77889', medicine: 'Amlodipine 5mg', dueDays: 'Overdue (1 Day)', status: 'Alert Sent' },
  ]);

  // Trigger simulated prescription AI re-scan
  const handleTriggerAiScan = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiConfidence(98);
      showToast('Seva AI clinical extraction complete (98% confidence)');
    }, 1100);
  };

  return (
    <div className="space-y-8 font-sans antialiased text-neutral-800">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[var(--color-navy)] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-neutral-700 text-xs font-semibold"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BRAND & PROFILE HEADER */}
      <header className="bg-white rounded-3xl p-6 md:p-8 border border-[#f0dac5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-soft rounded-full blur-3xl -z-10 opacity-30 pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-hover text-white flex items-center justify-center font-serif italic text-3xl font-bold shadow-md shadow-brand/25 shrink-0 overflow-hidden">
            {currentUser?.profilePic || currentUser?.avatar_url ? (
              <img src={currentUser.profilePic || currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>S</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {pharmacyInfo.name}
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Pharmacy
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 mt-1 font-medium">
              <span className="font-mono">Reg: <strong className="text-neutral-800">{pharmacyInfo.regNo}</strong></span>
              <span className="font-mono">GSTN: <strong className="text-neutral-800">{pharmacyInfo.gstn}</strong></span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand" /> {pharmacyInfo.location}</span>
            </div>
          </div>
        </div>

        {/* Quick Sync & New POS Action */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="px-3 py-2 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl text-[11px] font-bold text-neutral-700 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-brand animate-spin" style={{ animationDuration: '6s' }} />
            <span>Marg ERP: Live Sync</span>
          </div>

          <button
            onClick={() => setActiveTab('pos')}
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-brand/20"
          >
            <Receipt className="w-3.5 h-3.5 text-white" />
            <span>New POS Bill</span>
          </button>
        </div>
      </header>

      {/* HORIZONTAL NAVIGATION BAR - SevaDharam Brand Theme */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: Store },
          { key: 'prescriptions', label: 'Prescription Upload & AI', icon: FileCheck },
          { key: 'verification', label: 'Clinical Verification', icon: ShieldCheck },
          { key: 'pos', label: 'POS Billing (Marg)', icon: Receipt },
          { key: 'doctors', label: 'Doctors Network', icon: Stethoscope },
          { key: 'inventory', label: 'Inventory (Marg ERP)', icon: Package },
          { key: 'refills', label: 'Refill Reminders', icon: Clock },
          { key: 'deliveries', label: 'Delivery Dispatches', icon: Truck },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-white hover:bg-orange-50/50 text-neutral-600 border border-[#f0dac5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* GREETING & DATE BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif text-neutral-900">
                Good morning, <span className="text-brand font-medium italic">{pharmacyInfo.name}</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Here's your real-time pharmacy operations and dispensing report today.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white px-3.5 py-2 rounded-2xl border border-[#f0dac5]">
              <Calendar className="w-3.5 h-3.5 text-brand" />
              <span>Mon, 27 Oct 2026</span>
            </div>
          </div>

          {/* 6 STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {stats.map((s, idx) => (
              <div 
                key={idx}
                className={`bg-white p-4 rounded-2xl border border-[#f0dac5] border-t-4 ${s.border} shadow-xs space-y-1.5`}
              >
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  {s.label}
                </span>
                <span className={`text-2xl md:text-3xl font-black ${s.color} tracking-tight`}>
                  {s.value}
                </span>
                <span className={`text-[10px] font-bold block ${s.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {s.delta}
                </span>
              </div>
            ))}
          </div>

          {/* MAIN 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT 2 COLS: ACTION REQUIRED & DOCTOR CONSULTATIONS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Action Required Table */}
              <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 md:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-light text-brand rounded-xl">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                        Action Required ({actionItems.length})
                      </h3>
                      <p className="text-[11px] text-neutral-500">Prescriptions awaiting pharmacist verification and OTP consent</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className="text-xs font-bold text-brand hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#f0dac5] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                        <th className="pb-3 pl-2">Patient</th>
                        <th className="pb-3">Action Stage</th>
                        <th className="pb-3">Details</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3 pr-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {actionItems.map((item) => (
                        <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                          <td className="py-3.5 pl-2">
                            <div className="font-bold text-neutral-900">{item.patient}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{item.phone}</div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.tagColor}`}>
                              {item.action}
                            </span>
                          </td>
                          <td className="py-3.5 text-neutral-600 font-medium">
                            {item.details}
                          </td>
                          <td className="py-3.5 text-neutral-400 font-mono text-[11px]">
                            {item.time}
                          </td>
                          <td className="py-3.5 pr-2 text-right">
                            <button
                              onClick={() => {
                                if (item.type === 'verify' || item.type === 'review') {
                                  setActiveTab('prescriptions');
                                } else if (item.type === 'consent') {
                                  setActiveTab('verification');
                                } else if (item.type === 'refill') {
                                  setActiveTab('refills');
                                } else {
                                  setActiveTab('doctors');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sub-Grid: Doctor Consultations + Earnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Doctor Consultations Box */}
                <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-brand" />
                      <span>Doctor Consultations</span>
                    </h3>
                    <button onClick={() => setActiveTab('doctors')} className="text-[11px] font-bold text-brand hover:underline">
                      Network →
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-3 bg-brand-light border border-brand-soft rounded-2xl">
                      <div className="text-xl font-black text-brand">3</div>
                      <div className="text-[10px] font-bold text-brand-dark mt-0.5">New Req</div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                      <div className="text-xl font-black text-blue-700">2</div>
                      <div className="text-[10px] font-bold text-blue-600 mt-0.5">Scheduled</div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <div className="text-xl font-black text-emerald-700">8</div>
                      <div className="text-[10px] font-bold text-emerald-600 mt-0.5">Done</div>
                    </div>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
                      <div className="text-xl font-black text-neutral-700">1</div>
                      <div className="text-[10px] font-bold text-neutral-600 mt-0.5">Follow-up</div>
                    </div>
                  </div>
                </div>

                {/* Earnings & Settlement */}
                <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-brand" />
                      <span>Earnings & Settlement</span>
                    </h3>
                    <span className="text-[10px] font-mono text-brand font-bold bg-brand-light px-2 py-0.5 rounded-full border border-brand-soft">
                      T+1 Automated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-[#fdfaf6] rounded-xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block">Today's Transactions</span>
                      <strong className="text-sm font-bold text-neutral-900">₹4,850</strong>
                    </div>
                    <div className="p-2.5 bg-[#fdfaf6] rounded-xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block">Pending Settlement</span>
                      <strong className="text-sm font-bold text-brand">₹12,400</strong>
                    </div>
                    <div className="p-2.5 bg-[#fdfaf6] rounded-xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block">Last Settlement</span>
                      <strong className="text-sm font-bold text-neutral-900">₹8,750</strong>
                    </div>
                    <div className="p-2.5 bg-[#fdfaf6] rounded-xl border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block">Next Settlement</span>
                      <strong className="text-sm font-bold text-neutral-900">28 Oct 2026</strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: QUICK ACTIONS & ALERTS */}
            <div className="space-y-6">
              
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className="p-3 bg-brand text-white rounded-2xl text-left hover:bg-brand-hover transition-colors flex flex-col justify-between h-24 cursor-pointer shadow-sm shadow-brand/20"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Capture Rx</div>
                      <div className="text-[10px] text-white/80">Phone Camera</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className="p-3 bg-white border border-[#f0dac5] hover:bg-orange-50/50 rounded-2xl text-left transition-colors flex flex-col justify-between h-24 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Upload Rx</div>
                      <div className="text-[10px] text-neutral-500">PDF / Image</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('pos')}
                    className="p-3 bg-white border border-[#f0dac5] hover:bg-orange-50/50 rounded-2xl text-left transition-colors flex flex-col justify-between h-24 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 leading-tight">POS Bill</div>
                      <div className="text-[10px] text-neutral-500">Marg Sale</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="p-3 bg-white border border-[#f0dac5] hover:bg-orange-50/50 rounded-2xl text-left transition-colors flex flex-col justify-between h-24 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-xl bg-brand-light text-brand flex items-center justify-center">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 leading-tight">Consult</div>
                      <div className="text-[10px] text-neutral-500">Find Doctor</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Notifications Feed */}
              <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-brand" />
                    <span>Recent Notifications</span>
                  </h3>
                  <span className="text-[10px] font-bold text-brand">3 unread</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-brand-light/60 border border-brand-soft rounded-xl flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-800">New prescription uploaded by Rahul Sharma</p>
                      <span className="text-[10px] text-neutral-400">2 mins ago</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-800">Patient consent OTP verified for Suman Das</p>
                      <span className="text-[10px] text-neutral-400">12 mins ago</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-orange-50/60 border border-orange-100 rounded-xl flex items-start gap-2.5">
                    <Stethoscope className="w-4 h-4 text-brand-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-800">Dr. Amit Verma confirmed teleconsult for 11:30 AM</p>
                      <span className="text-[10px] text-neutral-400">25 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRESCRIPTION UPLOAD & AI PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand" />
                <span>Prescription Upload &amp; Seva AI Analysis Engine</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Upload handwritten or digital prescriptions. Seva AI automatically parses doctor info, patient records, and medicines.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerAiScan}
                disabled={isAiAnalyzing}
                className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiAnalyzing ? 'Extracting via AI...' : 'Re-Run AI OCR'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT: DROPZONE & IMAGE PREVIEW */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Prescription Document</h3>
                
                <div className="border-2 border-dashed border-[#f0dac5] bg-[#fdfaf6] rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-light text-brand mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">Drag and drop prescription image or PDF here</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Supports JPG, PNG, WebP, PDF up to 15MB</p>
                  </div>
                  <label className="inline-block px-4 py-2 bg-white border border-[#f0dac5] hover:bg-orange-50/50 rounded-xl text-xs font-bold text-neutral-700 cursor-pointer shadow-xs transition-colors">
                    📄 Browse Local File
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedRxFile(URL.createObjectURL(e.target.files[0]));
                          handleTriggerAiScan();
                        }
                      }} 
                    />
                  </label>
                </div>

                {/* Prescription Image Preview */}
                {selectedRxFile && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-bold">
                      <span>Live Image Preview</span>
                      <span className="text-brand font-mono">Rx #1024</span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-neutral-200 max-h-96 relative bg-neutral-900 flex items-center justify-center">
                      <img 
                        src={selectedRxFile} 
                        alt="Prescription Preview" 
                        className="w-full h-full object-contain max-h-96"
                      />
                      {isAiAnalyzing && (
                        <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                          <RefreshCw className="w-8 h-8 text-brand animate-spin" />
                          <p className="text-xs font-bold font-mono">AI Extracting Clinical Tokens...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: EXTRACTED CLINICAL TOKENS */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#f0dac5] pb-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      AI Clinical Extraction
                    </h3>
                    <p className="text-[11px] text-neutral-500">Verified against National Drug Formulary</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-brand-light text-brand border border-brand-soft text-[10px] font-mono font-bold rounded-full">
                      Confidence: {aiConfidence}%
                    </span>
                  </div>
                </div>

                {/* Header Information */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5]/60 rounded-xl">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Doctor</span>
                    <strong className="text-neutral-900">{extractedDoctor}</strong>
                  </div>
                  <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5]/60 rounded-xl">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Patient</span>
                    <strong className="text-neutral-900">{extractedPatient}</strong>
                  </div>
                  <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5]/60 rounded-xl">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Date Prescribed</span>
                    <strong className="text-neutral-900">{extractedDate}</strong>
                  </div>
                  <div className="p-3 bg-[#fdfaf6] border border-[#f0dac5]/60 rounded-xl">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Diagnosis</span>
                    <strong className="text-neutral-900">{extractedDiagnosis}</strong>
                  </div>
                </div>

                {/* Extracted Medicines Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
                    <span>Parsed Medicines &amp; Marg POS Inventory Link</span>
                    <span className="text-brand text-[10px] font-mono">{extractedMeds.length} Items</span>
                  </div>

                  <div className="space-y-2">
                    {extractedMeds.map((med) => (
                      <div key={med.id} className="p-3.5 bg-[#fdfaf6] border border-[#f0dac5]/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-neutral-900 flex items-center gap-2">
                            <span>{med.name}</span>
                            <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-[9px] rounded-full font-mono">{med.dosage}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-mono">{med.freq} • {med.duration}</p>
                          <p className="text-[10px] text-brand font-bold">{med.stock}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setExtractedMeds(extractedMeds.map(m => m.id === med.id ? { ...m, verified: !m.verified } : m));
                              showToast(`${med.name} verification toggled`);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                              med.verified 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{med.verified ? 'Verified' : 'Verify'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action to proceed */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="flex-1 py-3.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-brand/20 cursor-pointer"
                  >
                    <span>Proceed to Clinical Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CLINICAL VERIFICATION & PATIENT CONSENT */}
      {/* ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs space-y-2">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand" />
              <span>Pharmacist Sign-Off &amp; Patient Digital Consent</span>
            </h2>
            <p className="text-xs text-neutral-500">
              In compliance with Pharmacy Practice Regulations 2015, verify prescription validity and obtain two-factor patient consent prior to dispensing.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 md:p-8 shadow-xs space-y-6">
            
            {/* Step 1: Pharmacist Sign-Off */}
            <div className="space-y-3 pb-6 border-b border-[#f0dac5]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Step 1: Pharmacist Clinical Review
                  </h3>
                  <p className="text-[11px] text-neutral-500">Confirm dosage safety, absence of drug-drug interactions, and stock validity</p>
                </div>
                {isPharmacistSigned && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Signed by Registered Pharmacist</span>
                  </span>
                )}
              </div>

              <div className="p-4 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pharmacy:</span>
                  <strong>{pharmacyInfo.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Reg. Number:</span>
                  <span className="font-mono font-bold text-neutral-800">{pharmacyInfo.regNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Prescription Ref:</span>
                  <span className="font-mono font-bold text-brand">RX-2026-1024 (Dr. Amit Verma)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPharmacistSigned(!isPharmacistSigned);
                  showToast(isPharmacistSigned ? 'Pharmacist signature revoked' : 'Pharmacist digital signature affixed!');
                }}
                className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isPharmacistSigned
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-brand text-white hover:bg-brand-hover shadow-md shadow-brand/20'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isPharmacistSigned ? 'Digital Signature Active (Click to revoke)' : 'Affix Pharmacist Digital Signature & Stamp'}</span>
              </button>
            </div>

            {/* Step 2: Patient Consent via OTP */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Step 2: Patient Consent Verification
                </h3>
                <p className="text-[11px] text-neutral-500">Send a 4-digit consent OTP to patient's mobile number (+91 98765 43210)</p>
              </div>

              {!consentOtpSent ? (
                <button
                  onClick={() => {
                    setConsentOtpSent(true);
                    showToast('Consent OTP sent to patient: +91 98765 43210 (Demo Code: 4421)');
                  }}
                  className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-brand/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Consent OTP to Patient</span>
                </button>
              ) : (
                <div className="p-5 bg-brand-light/70 border border-brand-soft rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-800 font-bold">
                    <span>Consent OTP sent to +91 98765 43210</span>
                    <span className="px-2 py-0.5 bg-white border border-brand-soft text-brand font-mono text-[10px] rounded-full">Demo Code: 4421</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={patientConsentOtp}
                      onChange={(e) => setPatientConsentOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 bg-white border border-brand-soft rounded-xl px-4 py-2.5 text-center font-mono font-bold text-sm tracking-widest outline-none focus:border-brand"
                    />
                    <button
                      onClick={() => {
                        if (patientConsentOtp === '4421' || patientConsentOtp.length === 4) {
                          setIsConsentVerified(true);
                          showToast('Patient consent authenticated successfully!');
                        } else {
                          showToast('Please enter demo code 4421');
                        }
                      }}
                      className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                    >
                      Verify Consent
                    </button>
                  </div>
                </div>
              )}

              {isConsentVerified && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div>Patient Consent Authenticated (UIDAI ABDM compliant)</div>
                    <span className="text-[10px] font-mono text-emerald-600 font-normal">Token: ABDM-CONSENT-99214 • Timestamp: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Launch POS Sale */}
            <div className="pt-4 border-t border-[#f0dac5] flex gap-3">
              <button
                disabled={!isPharmacistSigned || !isConsentVerified}
                onClick={() => setActiveTab('pos')}
                className="w-full py-3.5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-brand/20 cursor-pointer disabled:cursor-not-allowed"
              >
                <Receipt className="w-4 h-4" />
                <span>Create POS Invoice &amp; Bill from Verified Rx</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POS BILLING SCREEN (MARG ERP INTEGRATED) */}
      {/* ========================================================================= */}
      {activeTab === 'pos' && (
        <div className="space-y-6">
          
          {/* Header Bar */}
          <div className="bg-white border border-[#f0dac5] rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand" />
                <h2 className="text-lg font-black uppercase tracking-wider text-neutral-900">
                  Pharmacy POS &amp; Sale Register (Marg ERP Integration)
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generate thermal invoices, collect payments, and synchronize inventory stock balances instantly.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-light text-brand border border-brand-soft text-xs font-mono font-bold rounded-full">
                Bill #INV-2026-8841
              </span>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-brand/20"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>

          {/* Customer & Doctor Meta Grid */}
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Customer / Patient Name</label>
              <input 
                type="text" 
                value={posCustomer.name} 
                onChange={(e) => setPosCustomer({ ...posCustomer, name: e.target.value })}
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2 font-bold text-neutral-800 outline-none focus:border-brand" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Mobile Number</label>
              <input 
                type="text" 
                value={posCustomer.phone} 
                onChange={(e) => setPosCustomer({ ...posCustomer, phone: e.target.value })}
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2 font-mono font-bold text-neutral-800 outline-none focus:border-brand" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Prescribing Doctor</label>
              <input 
                type="text" 
                value={posCustomer.doctor} 
                onChange={(e) => setPosCustomer({ ...posCustomer, doctor: e.target.value })}
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2 font-bold text-neutral-800 outline-none focus:border-brand" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Rx Reference Number</label>
              <input 
                type="text" 
                value={posCustomer.rxNumber} 
                onChange={(e) => setPosCustomer({ ...posCustomer, rxNumber: e.target.value })}
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2 font-mono font-bold text-brand outline-none focus:border-brand uppercase" 
              />
            </div>
          </div>

          {/* Item Search Bar & Quick Add */}
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-4 shadow-xs flex gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5" />
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPosItem()}
                placeholder="Search medicine by name, salt, or barcode (e.g. Dolo 650, Azithromycin 500mg)..."
                className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-neutral-800 outline-none focus:border-brand focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={handleAddPosItem}
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm shadow-brand/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {/* POS Bill Table & Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* ITEMS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0dac5] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    <th className="pb-3 pl-2">#</th>
                    <th className="pb-3">Medicine Description</th>
                    <th className="pb-3">Batch</th>
                    <th className="pb-3">Exp</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">MRP</th>
                    <th className="pb-3 text-right">Disc%</th>
                    <th className="pb-3 text-right">Net</th>
                    <th className="pb-3 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {posItems.map((item, idx) => {
                    const gross = item.qty * item.mrp;
                    const net = (gross * (1 - item.discount / 100)).toFixed(2);
                    return (
                      <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                        <td className="py-3 pl-2 font-mono text-[11px] text-neutral-400">{idx + 1}</td>
                        <td className="py-3 font-bold text-neutral-900">{item.name}</td>
                        <td className="py-3 font-mono text-[11px] text-neutral-600">{item.batch}</td>
                        <td className="py-3 font-mono text-[11px] text-neutral-500">{item.expiry}</td>
                        <td className="py-3 text-center">
                          <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                            <button onClick={() => handleUpdatePosQty(item.id, item.qty - 1)} className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-200 cursor-pointer">-</button>
                            <span className="px-2 font-bold font-mono text-xs">{item.qty}</span>
                            <button onClick={() => handleUpdatePosQty(item.id, item.qty + 1)} className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-200 cursor-pointer">+</button>
                          </div>
                        </td>
                        <td className="py-3 text-right font-mono font-medium">₹{item.mrp.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono text-brand">{item.discount}%</td>
                        <td className="py-3 text-right font-mono font-bold text-neutral-900">₹{net}</td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleRemovePosItem(item.id)} className="text-neutral-400 hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {posItems.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-neutral-400 text-xs">
                        No items added yet. Search or add medicines above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* BILL SUMMARY BOX */}
            <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-[#f0dac5] pb-3">
                Invoice Total Calculation
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-mono">₹{posTotals.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand">
                  <span>Total Discount:</span>
                  <span className="font-mono">-₹{posTotals.discount}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>CGST (6%):</span>
                  <span className="font-mono">₹{posTotals.cgst}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>SGST (6%):</span>
                  <span className="font-mono">₹{posTotals.sgst}</span>
                </div>
                <div className="flex justify-between text-neutral-400 text-[11px]">
                  <span>Round off:</span>
                  <span className="font-mono">₹{posTotals.roundOff}</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                  <span className="font-bold text-sm text-neutral-900">Net Payable:</span>
                  <span className="font-mono text-2xl font-black text-brand">₹{posTotals.grandTotal}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    showToast(`Payment collected for ₹${posTotals.grandTotal}! Stock updated in Marg ERP.`);
                    setIsPrintModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Collect Payment (Cash / UPI)</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="w-full py-2.5 bg-[#fdfaf6] hover:bg-orange-50/50 text-neutral-800 border border-[#f0dac5] rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-brand" />
                  <span>Print Thermal Receipt</span>
                </button>
              </div>
            </div>

          </div>

          {/* Thermal Receipt Print Modal */}
          <AnimatePresence>
            {isPrintModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full space-y-4 font-mono text-xs relative text-neutral-900 border border-[#f0dac5]"
                >
                  <button 
                    onClick={() => setIsPrintModalOpen(false)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 text-neutral-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-center space-y-1 border-b border-dashed border-neutral-300 pb-3">
                    <h4 className="font-bold text-sm text-neutral-900">{pharmacyInfo.name}</h4>
                    <p className="text-[10px] text-neutral-500">{pharmacyInfo.location}</p>
                    <p className="text-[10px]">DL: {pharmacyInfo.regNo}</p>
                    <p className="text-[10px]">GSTN: {pharmacyInfo.gstn}</p>
                  </div>

                  <div className="text-[10px] space-y-0.5 border-b border-dashed border-neutral-300 pb-2">
                    <div>Patient: {posCustomer.name} ({posCustomer.phone})</div>
                    <div>Doctor: {posCustomer.doctor}</div>
                    <div>Date: 27/10/2026 {new Date().toLocaleTimeString()}</div>
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {posItems.map(item => (
                      <div key={item.id} className="flex justify-between text-[11px]">
                        <span>{item.qty}x {item.name.slice(0, 18)}</span>
                        <span>₹{(item.qty * item.mrp * (1 - item.discount / 100)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-neutral-300 pt-2 space-y-1">
                    <div className="flex justify-between text-sm font-bold text-brand">
                      <span>TOTAL AMOUNT:</span>
                      <span>₹{posTotals.grandTotal}</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 text-center pt-2">
                      *** THANK YOU • GET WELL SOON ***<br/>
                      SEVADHARAM DIGITAL HEALTHCARE
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm shadow-brand/20"
                  >
                    Send to Thermal Printer
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DOCTORS DIRECTORY (AFFILIATED CLINICIANS) */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-brand" />
                <span>Affiliated Doctors &amp; Teleconsult Network</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Connect walk-in pharmacy patients directly with verified medical specialists for instant prescriptions.
              </p>
            </div>
            
            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="px-4 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-brand/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor to Network</span>
            </button>
          </div>

          {/* Specialties Filter Tags */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Cardiologist', 'General Physician', 'Dermatologist', 'Gynecologist', 'Internal Medicine'].map(sp => (
              <button
                key={sp}
                onClick={() => setDoctorSpecialtyFilter(sp)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  doctorSpecialtyFilter === sp
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-white border border-[#f0dac5] text-neutral-600 hover:bg-orange-50/50'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctorsList
              .filter(d => doctorSpecialtyFilter === 'All' || d.specialty === doctorSpecialtyFilter)
              .map(doc => (
                <div key={doc.id} className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-4 hover:border-brand transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand font-bold flex items-center justify-center text-base shrink-0">
                        {doc.name.split(' ')[1]?.[0] || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{doc.name}</h4>
                        <p className="text-xs text-brand font-semibold">{doc.specialty}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{doc.reg}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-800 bg-[#fdfaf6] border border-[#f0dac5] px-2 py-0.5 rounded-lg">
                      {doc.fee}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {doc.status}
                    </span>
                    <span className="font-mono text-brand">★ {doc.rating}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => showToast(`Initiating teleconsult with ${doc.name}...`)}
                      className="flex-1 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      Request Consult
                    </button>
                    <a
                      href={`tel:${doc.phone}`}
                      className="px-3 py-2 bg-[#fdfaf6] border border-[#f0dac5] hover:bg-orange-50/50 text-neutral-700 rounded-xl flex items-center justify-center cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {/* Add Doctor Modal */}
          <AnimatePresence>
            {isAddDoctorModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full space-y-4 border border-[#f0dac5]"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                      Add Doctor to Pharmacy Network
                    </h3>
                    <button onClick={() => setIsAddDoctorModalOpen(false)} className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Doctor Name</label>
                      <input 
                        type="text" 
                        required 
                        value={newDoctorForm.name} 
                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                        placeholder="e.g. Dr. Kavita Roy" 
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand" 
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Specialty</label>
                      <select 
                        value={newDoctorForm.specialty} 
                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, specialty: e.target.value })}
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand"
                      >
                        <option value="General Physician">General Physician</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Gynecologist">Gynecologist</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Reg. Number</label>
                        <input 
                          type="text" 
                          value={newDoctorForm.regNo} 
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, regNo: e.target.value })}
                          placeholder="WBMC-12345" 
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Consult Fee (₹)</label>
                        <input 
                          type="text" 
                          value={newDoctorForm.fee} 
                          onChange={(e) => setNewDoctorForm({ ...newDoctorForm, fee: e.target.value })}
                          placeholder="400" 
                          className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={newDoctorForm.phone} 
                        onChange={(e) => setNewDoctorForm({ ...newDoctorForm, phone: e.target.value })}
                        placeholder="+91 98300 00000" 
                        className="w-full bg-[#fdfaf6] border border-[#f0dac5] rounded-xl px-3 py-2.5 outline-none focus:border-brand" 
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-brand/20"
                    >
                      Save Doctor Affiliation
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. INVENTORY (MARG ERP INTEGRATION) */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand" />
                <span>Marg ERP 9+ Real-Time Inventory Balance</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Automatically monitors stock quantities, near-expiry medicines, and auto-generates distributor purchase orders.
              </p>
            </div>
            
            <button
              onClick={() => showToast('Inventory balances refreshed with Marg ERP local gateway.')}
              className="px-4 py-2.5 bg-[#fdfaf6] hover:bg-orange-50/50 text-neutral-800 border border-[#f0dac5] rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand" />
              <span>Sync Marg ERP</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#f0dac5] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  <th className="pb-3 pl-2">Brand Name</th>
                  <th className="pb-3">Salt Formulation</th>
                  <th className="pb-3">Batch</th>
                  <th className="pb-3 text-right">Available Qty</th>
                  <th className="pb-3 text-right">MRP</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {inventoryList.map(item => (
                  <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="py-3 pl-2 font-bold text-neutral-900">{item.name}</td>
                    <td className="py-3 text-neutral-600">{item.salt}</td>
                    <td className="py-3 font-mono text-[11px] text-neutral-500">{item.batch}</td>
                    <td className="py-3 text-right font-mono font-bold text-neutral-800">{item.stock}</td>
                    <td className="py-3 text-right font-mono text-neutral-700">₹{item.mrp.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => showToast(`Purchase order drafted for ${item.name} to distributor.`)}
                        className="px-3 py-1 bg-[#fdfaf6] hover:bg-orange-50/60 border border-[#f0dac5] text-brand text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. REFILL REMINDERS */}
      {/* ========================================================================= */}
      {activeTab === 'refills' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand" />
                <span>Patient Chronic Care &amp; Refill Reminders</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Automated WhatsApp and SMS reminders ensure patients never miss their maintenance medications.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#f0dac5] p-5 shadow-xs space-y-3">
            {refillsList.map(rf => (
              <div key={rf.id} className="p-4 bg-[#fdfaf6] border border-[#f0dac5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-neutral-900">{rf.patient}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{rf.phone}</div>
                  <div className="text-xs font-semibold text-brand mt-1">{rf.medicine}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
                    {rf.dueDays}
                  </span>
                  <button
                    onClick={() => showToast(`Refill WhatsApp message dispatched to ${rf.patient}`)}
                    className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-brand/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Alert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DELIVERY DISPATCHES */}
      {/* ========================================================================= */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#f0dac5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand" />
                <span>Home Delivery &amp; Medicine Dispatch Hub</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage medicine packaging, assign delivery riders, and confirm doorstep receipt.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'DEL-101', patient: 'Rajesh Kumar', items: '3 items', amount: '₹450', address: 'Block C, Apollo Apts, HSR Layout', time: '10:30 AM', status: 'Pending Packaging' },
              { id: 'DEL-102', patient: 'Sunita Sharma', items: '1 item', amount: '₹120', address: 'Villa 14, Palm Meadows, Whitefield', time: '11:15 AM', status: 'Rider Assigned' },
              { id: 'DEL-103', patient: 'Amit Patel', items: '5 items', amount: '₹1250', address: 'Flat 302, Galaxy Enclave, Koramangala', time: '09:00 AM', status: 'In Transit' },
            ].map(del => (
              <div key={del.id} className="bg-white p-5 rounded-3xl border border-[#f0dac5] shadow-xs space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">{del.patient}</h4>
                    <span className="font-mono text-[10px] text-neutral-400">{del.id} • {del.time}</span>
                  </div>
                  <strong className="text-brand font-mono text-sm">{del.amount}</strong>
                </div>

                <div className="space-y-1 text-neutral-600">
                  <div className="flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-neutral-400" /> {del.items} (Prescription verified)</div>
                  <div className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" /> {del.address}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => showToast(`Order ${del.id} dispatched with local rider!`)}
                    className="flex-1 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm shadow-brand/20"
                  >
                    Dispatch Order
                  </button>
                  <button
                    onClick={() => showToast(`Calling patient ${del.patient}...`)}
                    className="px-3 py-2 bg-[#fdfaf6] border border-[#f0dac5] hover:bg-orange-50/50 text-neutral-700 rounded-xl cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}