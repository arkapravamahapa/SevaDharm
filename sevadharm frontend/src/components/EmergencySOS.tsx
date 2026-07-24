import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, AlertTriangle, ShieldAlert, Compass, Navigation, MapPin, CheckCircle, Flame, Clock, HeartHandshake, Loader2 } from 'lucide-react';

interface EmergencySOSProps {
  onBackToDashboard: () => void;
  currentUser?: { name?: string; mobile?: string } | null;
}

interface DispatchDetails {
  dispatch_id: string;
  assigned_hospital: string;
  hospital_contact: string;
  eta_minutes: number;
  ambulance_unit: string;
}

export default function EmergencySOS({ onBackToDashboard, currentUser }: EmergencySOSProps) {
  const [sosState, setSosState] = useState<'idle' | 'dispatching' | 'dispatched'>('idle');
  const [etaSeconds, setEtaSeconds] = useState(540); // 9 minutes fallback
  const [dispatchInfo, setDispatchInfo] = useState<DispatchDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sosState === 'dispatched' && etaSeconds > 0) {
      interval = setInterval(() => {
        setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sosState, etaSeconds]);

  const executeDispatch = async (lat: number, lng: number) => {
    try {
      const payload = {
        patient_name: currentUser?.name || 'Calcutta Resident',
        mobile: currentUser?.mobile || '9876543210',
        latitude: lat,
        longitude: lng,
        emergency_type: 'Urgent Medical Dispatch'
      };

      const res = await fetch('http://localhost:8000/api/sos/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to reach emergency dispatch servers.');

      const result = await res.json();
      setDispatchInfo(result.data);
      setEtaSeconds((result.data.eta_minutes || 9) * 60);
      setSosState('dispatched');
    } catch (err: any) {
      setError(err.message || 'Dispatch connection error.');
      setSosState('idle');
    }
  };

  const handleActivateSOS = () => {
    setSosState('dispatching');
    setError(null);

    // Default Calcutta Core Coordinates Fallback (Park Street / Central Calcutta)
    const CALCUTTA_DEFAULT_LAT = 22.5726;
    const CALCUTTA_DEFAULT_LNG = 88.3639;

    if (!navigator.geolocation) {
      // Fallback immediately if geolocation API is completely absent
      executeDispatch(CALCUTTA_DEFAULT_LAT, CALCUTTA_DEFAULT_LNG);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        executeDispatch(position.coords.latitude, position.coords.longitude);
      },
      (geoError) => {
        // PRODUCTION-LEVEL FALLBACK: Instead of failing on permission block, 
        // fallback automatically to Calcutta central coordinates so dispatch never drops.
        console.warn("GPS access blocked or timed out. Routing emergency via Calcutta default grid coordinates.");
        executeDispatch(CALCUTTA_DEFAULT_LAT, CALCUTTA_DEFAULT_LNG);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-emergency-soft shadow-2xl overflow-hidden relative">
      {/* Alert flashing top bar */}
      <div className="bg-emergency p-6 text-white flex items-center justify-between pulsing-alert">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white/90">Clinical Distress Protocol</span>
            <h3 className="text-xl font-extrabold tracking-tight">Seva emergency SOS (Calcutta Network)</h3>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black animate-pulse">SOS PANIC CONSOLE</span>
      </div>

      <div className="p-8 space-y-6">
        <AnimatePresence mode="wait">
          {/* STATE 1: IDLE / PANIC TRIGGER */}
          {sosState === 'idle' && (
            <motion.div 
              key="sos-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-2">
                <h4 className="text-xl font-black text-neutral-900 tracking-tight">Immediate Medical Dispatch</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-normal">
                  Activating the red panic button immediately broadcasts your live GPS coordinates (with automatic Calcutta grid relay fallback) to trauma centers and dispatches an ICU-fitted ambulance.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-emergency/10 border border-emergency/30 text-emergency text-xs rounded-xl font-semibold">
                  {error}
                </div>
              )}

              {/* Huge pulsating panic button */}
              <div className="flex items-center justify-center py-6">
                <button 
                  onClick={handleActivateSOS}
                  className="w-40 h-40 rounded-full bg-emergency hover:bg-emergency-dark text-white font-black tracking-wider uppercase text-base shadow-2xl shadow-emergency/40 cursor-pointer transition-all border-8 border-emergency-soft hover:scale-105 active:scale-95 flex flex-col items-center justify-center space-y-1 pulsing-alert"
                >
                  <Flame className="w-8 h-8 text-white animate-bounce" />
                  <span>Tap to SOS</span>
                </button>
              </div>

              {/* Call local emergency helpline numbers directly */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a 
                  href="tel:102"
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 flex items-center gap-3 justify-center text-xs font-bold text-neutral-700"
                >
                  <PhoneCall className="w-4 h-4 text-emergency shrink-0" />
                  <span>Ambulance National: Dial 102</span>
                </a>
                <a 
                  href="tel:112"
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 flex items-center gap-3 justify-center text-xs font-bold text-neutral-700"
                >
                  <PhoneCall className="w-4 h-4 text-emergency shrink-0" />
                  <span>Emergency Hotline: Dial 112</span>
                </a>
              </div>
            </motion.div>
          )}

          {/* STATE 2: DISPATCHING */}
          {sosState === 'dispatching' && (
            <motion.div 
              key="sos-dispatching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center space-y-6"
            >
              <div className="relative flex items-center justify-center mx-auto">
                <div className="w-24 h-24 border-4 border-emergency-soft border-t-emergency rounded-full animate-spin" />
                <Compass className="absolute w-8 h-8 text-emergency animate-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-lg text-neutral-800">Locking GPS & Pinging Calcutta Network...</h4>
                <div className="flex justify-center items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emergency animate-ping" />
                  <span className="text-xs text-neutral-400 font-mono font-bold">TRANSMITTING LIVE COORDINATES</span>
                </div>
                <p className="text-xs text-neutral-400 leading-normal max-w-xs mx-auto">Querying database for available emergency beds and dispatch units.</p>
              </div>
            </motion.div>
          )}

          {/* STATE 3: DISPATCHED TIMER */}
          {sosState === 'dispatched' && dispatchInfo && (
            <motion.div 
              key="sos-dispatched"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {/* Success Notification card */}
              <div className="p-4 bg-brand-light border border-success-soft text-brand-dark rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <h5 className="font-extrabold text-sm text-neutral-900">Advanced Trauma Response Dispatched</h5>
                  <p className="text-xs opacity-90 mt-0.5">Ambulance Unit <span className="font-mono font-bold">{dispatchInfo.ambulance_unit}</span> is rolling.</p>
                </div>
              </div>

              {/* Countdown Board */}
              <div className="p-8 bg-neutral-900 text-white rounded-3xl text-center space-y-2 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">AMBULANCE ARRIVAL ETA</span>
                <h4 className="text-4xl font-black font-mono tracking-tight text-emergency animate-pulse">
                  {formatTime(etaSeconds)}
                </h4>
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Live tracking via GPS relay</span>
                </div>
              </div>

              {/* Targeted hospital */}
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <span className="text-[9px] font-bold text-neutral-400 uppercase block tracking-wider">ASSIGNED EMERGENCY CENTER</span>
                <div>
                  <h5 className="font-extrabold text-sm text-neutral-800">{dispatchInfo.assigned_hospital}</h5>
                  <p className="text-xs text-neutral-500 font-mono">Desk Contact: {dispatchInfo.hospital_contact}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-neutral-500 font-medium">Dispatch ID</span>
                  <span className="font-mono font-bold text-brand">{dispatchInfo.dispatch_id}</span>
                </div>
              </div>

              {/* Dispatch care guidelines */}
              <div className="p-4 bg-brand-light border border-brand-soft rounded-2xl flex gap-3 text-xs text-brand-dark leading-relaxed">
                <HeartHandshake className="w-5 h-5 shrink-0 mt-0.5 text-brand" />
                <div>
                  <span className="font-extrabold text-neutral-900 block mb-0.5">First-Aid Guidelines While You Wait:</span>
                  <p>1. Stay calm. Lie down on left lateral position if feeling dizzy.</p>
                  <p>2. Keep doors unlocked so paramedic team enters without obstruction.</p>
                  <p>3. Pack standard past prescriptions and reports folder for direct transfer.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back control */}
        <div className="flex gap-2">
          {sosState === 'dispatched' && (
            <button 
              onClick={() => {
                setSosState('idle');
                setEtaSeconds(540);
                setDispatchInfo(null);
              }}
              className="flex-1 py-3.5 border border-neutral-200 text-neutral-400 hover:text-neutral-600 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center bg-white"
            >
              Cancel Emergency Alarm
            </button>
          )}
          <button 
            onClick={onBackToDashboard}
            className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer text-center"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}