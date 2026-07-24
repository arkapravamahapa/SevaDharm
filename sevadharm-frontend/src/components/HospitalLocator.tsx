import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Hospital as HospIcon, Compass, Search, ShieldAlert } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalLocatorProps {
  onBackToDashboard: () => void;
  onActivateSOS?: () => void;
}

export default function HospitalLocator({ onBackToDashboard, onActivateSOS }: HospitalLocatorProps) {
  // --- New Real-World State Variables ---
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Existing UI State ---
  const [filterType, setFilterType] = useState<'All' | 'Charity' | 'Government' | 'Private'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // --- Fetch Data from FastAPI Backend ---
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // Calling your Python server
        const response = await fetch('http://localhost:8000/api/hospitals');
        if (!response.ok) {
          throw new Error('Failed to fetch hospital data from server');
        }
        
        const result = await response.json();
        
        // Update state with the real data from Supabase
        setHospitals(result.data);
        
        // Auto-select the first hospital if data exists
        if (result.data && result.data.length > 0) {
          setSelectedHospital(result.data[0]);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Filter the real data
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || h.type === filterType;
    return matchesSearch && matchesType;
  });

  // Loading & Error States for production UX
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center p-12 bg-white rounded-3xl border border-neutral-100 shadow-xl">
        <div className="animate-pulse flex flex-col items-center">
          <Compass className="w-10 h-10 text-brand animate-spin mb-4" style={{ animationDuration: '3s' }} />
          <p className="text-neutral-500 font-bold text-sm">Connecting to SEVA-DHARM Database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 shadow-sm text-center">
        <ShieldAlert className="w-8 h-8 mx-auto mb-2" />
        <h3 className="font-bold">System Error</h3>
        <p className="text-xs">{error}</p>
        <button onClick={onBackToDashboard} className="mt-4 px-4 py-2 bg-white rounded-xl text-xs font-bold border border-red-200">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Search & List block */}
      <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4 flex flex-col">
        <div>
          <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Nearby Hospital Index</h3>
          <p className="text-xs text-neutral-500">Live directory and routing across nearby centers.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-brand text-xs font-semibold"
            />
          </div>
          <div className="sm:col-span-2 flex gap-1.5 overflow-x-auto pb-1">
            {['All', 'Charity', 'Government', 'Private'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === type 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital List */}
        <div className="space-y-3 overflow-y-auto max-h-[350px] custom-scrollbar pr-1">
          {filteredHospitals.map(hosp => {
            const isSelected = selectedHospital?.id === hosp.id;
            
            return (
              <div 
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-start gap-3 ${
                  isSelected 
                    ? 'border-brand bg-brand-light/30 shadow-sm' 
                    : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wide ${
                      hosp.type === 'Charity' 
                        ? 'bg-brand-soft text-brand' 
                        : hosp.type === 'Government' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {hosp.type || 'Medical'} Center
                    </span>
                    <span className="text-xs font-mono text-neutral-400 font-bold">{hosp.distance || 'N/A'} away</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-800">{hosp.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{hosp.address}</p>
                </div>

                {/* Emergency Bed Indicator - Now reads from real DB data */}
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-neutral-400 block uppercase">EMERGENCY BEDS</span>
                  <span className={`text-base font-mono font-black ${
                    (hosp.emergencyBeds || 0) < 6 ? 'text-emergency animate-pulse' : (hosp.emergencyBeds || 0) < 15 ? 'text-orange-500' : 'text-brand'
                  }`}>
                    {hosp.emergencyBeds || 0} Active
                  </span>
                </div>
              </div>
            );
          })}
          
          {filteredHospitals.length === 0 && (
            <div className="text-center py-8 text-neutral-400 text-sm font-bold">
              No medical centers found.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Selected Hospital Card */}
      <div className="space-y-6">
        {selectedHospital && (
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4">
            <div className="p-3 bg-brand-soft rounded-2xl text-brand w-fit">
              <HospIcon className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h4 className="font-extrabold text-base text-neutral-900">{selectedHospital.name}</h4>
              <p className="text-xs text-neutral-400 mt-1">{selectedHospital.address}</p>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-2 gap-2 text-center bg-neutral-50 rounded-2xl p-3 border border-neutral-100">
              <div>
                <span className="text-[9px] font-bold text-neutral-400 block uppercase">Bed Availability</span>
                <span className="text-sm font-mono font-black text-neutral-700">
                  {selectedHospital.emergencyBeds || 0} Open
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 block uppercase">Distance Matrix</span>
                <span className="text-sm font-mono font-black text-brand-dark">
                  {selectedHospital.distance || 'N/A'}
                </span>
              </div>
            </div>

            {/* Simulated Live Map container */}
            <div className="relative h-28 bg-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <Compass className="w-8 h-8 text-brand animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[9px] font-mono font-bold text-neutral-500 flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-emergency" />
                <span>LAT: {selectedHospital.lat || '0.00'} / LNG: {selectedHospital.lng || '0.00'}</span>
              </div>
            </div>

            {/* Call / Action panel */}
            <div className="space-y-2">
              <a 
                href={`tel:${selectedHospital.contact || ''}`}
                className="w-full py-3 border border-neutral-200 hover:border-brand-hover hover:text-brand-hover text-neutral-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Registry: {selectedHospital.contact || 'N/A'}</span>
              </a>

              {onActivateSOS && (
                <button 
                  onClick={onActivateSOS}
                  className="w-full py-3.5 bg-emergency hover:bg-emergency-dark text-white text-xs font-bold rounded-2xl shadow-lg shadow-emergency/10 transition-all flex items-center justify-center gap-2 cursor-pointer pulsing-alert"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Call Emergency Ambulance</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Return Button */}
        <button
          onClick={onBackToDashboard}
          className="w-full py-3.5 border border-neutral-200 text-neutral-600 hover:text-neutral-800 font-bold rounded-2xl text-xs transition-all cursor-pointer text-center bg-white shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
