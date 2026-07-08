import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, FileText, UploadCloud, CheckCircle, ChevronRight, Activity, Calendar, Shield, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

interface DiagnosticCenterProps {
  onBackToDashboard: () => void;
}

export default function DiagnosticCenter({ onBackToDashboard }: DiagnosticCenterProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'report-parse'>('packages');
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'parsing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Booking details
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const testPackages = [
    {
      id: 'pkg-1',
      name: 'Full Body Comprehensive Care',
      tests: '82 parameters (Complete blood, lipid, thyroid, liver, kidney panel)',
      price: 1499,
      duration: 'Report in 12 hours'
    },
    {
      id: 'pkg-2',
      name: 'Charitable Diabetes & HbA1c screening',
      tests: 'Blood glucose, HbA1c, Average blood sugar index',
      price: 299,
      duration: 'Report in 6 hours'
    },
    {
      id: 'pkg-3',
      name: 'Comprehensive Heart & Lipid Profiling',
      tests: 'Cholesterol, HDL, LDL, Triglycerides, VLDL',
      price: 699,
      duration: 'Report in 8 hours'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    setUploadState('uploading');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploadState('parsing');
          setTimeout(() => {
            setUploadState('completed');
          }, 2000);
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  const handleBookPackage = (packageName: string) => {
    setSelectedPackage(packageName);
    setBookingConfirmed(false);
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab select header */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-4 shadow-md flex gap-2">
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'packages' ? 'bg-brand text-white shadow-lg shadow-brand/15' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>Home Lab Test Kits</span>
        </button>
        <button
          onClick={() => setActiveTab('report-parse')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'report-parse' ? 'bg-brand text-white shadow-lg shadow-brand/15' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Medical Report Translator</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: LAB PACKAGES */}
        {activeTab === 'packages' && (
          <motion.div 
            key="packages"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left/Middle Column: Test Selection */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Diagnostics & Home Labs</h3>
                <p className="text-xs text-neutral-500">Book certified phlebotomist sample collection. Reports processed by accredited clinical labs.</p>
              </div>

              <div className="space-y-4">
                {testPackages.map(pkg => (
                  <div 
                    key={pkg.id}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      selectedPackage === pkg.name ? 'border-brand bg-brand-light/20' : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-neutral-800">{pkg.name}</h4>
                      <p className="text-xs text-neutral-500 font-medium leading-tight">{pkg.tests}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{pkg.duration}</p>
                    </div>

                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between shrink-0">
                      <span className="text-base font-mono font-bold text-neutral-800">₹{pkg.price}</span>
                      <button 
                        onClick={() => handleBookPackage(pkg.name)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Checkout or completion */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl flex flex-col justify-between min-h-[350px]">
              {selectedPackage ? (
                !bookingConfirmed ? (
                  <form onSubmit={submitBooking} className="space-y-4">
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">SELECTED SPECIMEN</span>
                      <h4 className="font-extrabold text-sm text-neutral-800 leading-tight mt-0.5">{selectedPackage}</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">Home Collection Address</label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House Number, Street Name, Landmark, PIN code"
                        className="w-full p-3 rounded-xl border border-neutral-200 outline-none focus:border-brand bg-neutral-50/50 text-xs h-24 resize-none font-medium"
                      />
                    </div>

                    <div className="p-3 bg-brand-light rounded-xl border border-brand-soft flex items-center gap-2 text-brand-dark text-[10px]">
                      <Calendar className="w-4 h-4 text-brand shrink-0" />
                      <span>Certified health officer visits tomorrow 07:00 AM - 10:00 AM (Fasting required).</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-2xl shadow-lg shadow-brand/10 transition-all cursor-pointer"
                    >
                      Confirm Test Appointment
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="mx-auto w-12 h-12 bg-brand-soft text-brand rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">Lab Sample Scheduled!</h4>
                      <p className="text-xs text-neutral-400 leading-normal mt-1">Our executive will touch base tomorrow at your designated address in Sector 4.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedPackage(null)}
                      className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:text-neutral-800"
                    >
                      Book Another Test
                    </button>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-neutral-400 space-y-2">
                  <Microscope className="w-8 h-8 opacity-40 animate-pulse" />
                  <p className="text-xs font-semibold px-4">Choose a diagnostics package from the index to organize a home kit delivery.</p>
                </div>
              )}

              <button
                onClick={onBackToDashboard}
                className="w-full py-3.5 border border-neutral-200 text-neutral-600 hover:text-neutral-800 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center bg-white shadow-sm mt-4"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MEDICAL REPORT PARSER */}
        {activeTab === 'report-parse' && (
          <motion.div 
            key="report-parse"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-100 p-8 shadow-xl space-y-6"
          >
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight text-center">Plain English Report Translator</h3>
              <p className="text-xs text-neutral-400 text-center leading-normal mt-1 max-w-md mx-auto">Upload complicated blood tests, urine tests, or thyroid report sheets. Seva AI decodes medical metrics, highlighting critical out-of-range deviations.</p>
            </div>

            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div 
                  key="parse-idle"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-3 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                    isDragActive 
                      ? 'border-brand bg-brand-light text-brand' 
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-50/80 text-neutral-400 hover:border-brand/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden" 
                  />
                  <div className="p-3 bg-white text-neutral-400 shadow-sm rounded-full">
                    <UploadCloud className="w-8 h-8 text-neutral-400 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-sm">Drag your clinical report file here</h4>
                    <p className="text-xs text-neutral-400 mt-1">Supports PDF, JPG, PNG up to 15MB</p>
                  </div>
                  <button className="px-4 py-2 bg-white text-neutral-700 hover:text-brand border border-neutral-200 rounded-xl text-xs font-bold shadow-sm transition-all">
                    Browse Diagnostic Sheets
                  </button>
                </motion.div>
              )}

              {(uploadState === 'uploading' || uploadState === 'parsing') && (
                <motion.div 
                  key="parse-loader"
                  className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-neutral-100 border-t-brand rounded-full animate-spin" />
                    <Microscope className="absolute w-6 h-6 text-brand" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-neutral-800 text-sm">
                      {uploadState === 'uploading' ? 'Uploading Diagnostic Document...' : 'Translating Medical Jargon...'}
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto">Evaluating reference values, scanning hemoglobin levels, and computing lipid ratios.</p>
                  </div>
                </motion.div>
              )}

              {uploadState === 'completed' && (
                <motion.div 
                  key="parse-completed"
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between p-4 bg-brand-light border border-success-soft rounded-2xl">
                    <div className="flex items-center gap-3 text-brand-dark">
                      <CheckCircle className="w-5 h-5 animate-pulse" />
                      <div>
                        <span className="text-[10px] font-bold block uppercase opacity-75">Analysis Completed</span>
                        <h5 className="font-bold text-xs text-neutral-800">{selectedFile?.name || 'Report_Completed.pdf'}</h5>
                      </div>
                    </div>
                    <button 
                      onClick={() => setUploadState('idle')}
                      className="p-2 border border-neutral-200 rounded-xl bg-white text-neutral-600 cursor-pointer hover:bg-neutral-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Report Parameter Visuals */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Clinical Parameter translation:</span>

                    {/* Param 1: Hemoglobin */}
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-sm text-neutral-800">Hemoglobin (Hb)</h5>
                        <span className="text-xs font-bold text-neutral-500 font-mono">11.8 g/dL</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden relative">
                        {/* Reference Range Bar: 12.0 - 16.0 */}
                        <div className="absolute left-[30%] right-[20%] h-full bg-emerald-100 border-x-2 border-emerald-300" />
                        {/* User Mark */}
                        <div className="absolute left-[26%] w-3 h-3 rounded-full bg-emergency -top-0.5 border-2 border-white animate-ping" />
                        <div className="absolute left-[26%] w-3 h-3 rounded-full bg-emergency -top-0.5 border-2 border-white" />
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                        <span>Low Hb</span>
                        <span className="text-emerald-600 font-bold">Ref: 12.0 - 16.0 g/dL</span>
                        <span>High Hb</span>
                      </div>
                      <p className="text-xs text-neutral-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl leading-relaxed mt-1">
                        💡 <span className="font-bold text-neutral-800">Seva Plain Translation:</span> Your hemoglobin is marginally low, which might cause mild energy sluggishness or fatigue. Increase dietary iron (leafy greens, dates, lentils) and Vitamin C (helps iron absorption).
                      </p>
                    </div>

                    {/* Param 2: Total Cholesterol */}
                    <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-sm text-neutral-800">Total Serum Cholesterol</h5>
                        <span className="text-xs font-bold text-emergency-dark font-mono bg-emergency-light px-2 py-0.5 rounded-md animate-pulse">245 mg/dL</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden relative">
                        {/* Reference Range Bar: Less than 200 */}
                        <div className="absolute left-0 right-[40%] h-full bg-emerald-100 border-r-2 border-emerald-300" />
                        {/* User Mark */}
                        <div className="absolute left-[80%] w-3 h-3 rounded-full bg-emergency -top-0.5 border-2 border-white" />
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                        <span className="text-emerald-600 font-bold">Desirable: &lt;200 mg/dL</span>
                        <span>Borderline: 200-239</span>
                        <span className="text-emergency font-bold">High: &gt;240 mg/dL</span>
                      </div>
                      <p className="text-xs text-neutral-600 bg-emergency-light/60 border border-emergency-soft p-2.5 rounded-xl leading-relaxed mt-1">
                        ⚠️ <span className="font-bold text-neutral-800">Seva Action Guide:</span> Cholesterol is in the High Range. Limit deep-fried or saturated fats. We recommend scheduling a consultation with <span className="font-bold text-brand hover:underline cursor-pointer">Dr. Kabir Mehta (Cardiologist)</span> to review heart health parameters.
                      </p>
                    </div>
                  </div>

                  {/* Return block */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setUploadState('idle')}
                      className="flex-1 py-3 border border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Translate Another Report</span>
                    </button>
                    <button
                      onClick={onBackToDashboard}
                      className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center"
                    >
                      Dashboard
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
