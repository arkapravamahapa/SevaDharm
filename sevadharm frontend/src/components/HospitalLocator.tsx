import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Hospital as HospIcon, Compass, Navigation, Search, Activity, ShieldAlert } from 'lucide-react';
import { HOSPITALS } from '../data';
import { Hospital } from '../types';

interface HospitalLocatorProps {
  onBackToDashboard: () => void;
  onActivateSOS?: () => void;
}

export default function HospitalLocator({ onBackToDashboard, onActivateSOS }: HospitalLocatorProps) {
  const [filterType, setFilterType] = useState<'All' | 'Charity' | 'Government' | 'Private'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(HOSPITALS[0]);
  const [bedOccupancy, setBedOccupancy] = useState<Record<string, number>>({
    'hosp-1': 18,
    'hosp-2': 5,
    'hosp-3': 45,
    'hosp-4': 12
  });

  // Simulate real-time bed updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBedOccupancy(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          // Fluctuates bed availability slightly
          const change = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          next[key] = Math.max(1, next[key] + change);
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredHospitals = HOSPITALS.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || h.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Search & List block */}
      <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-100 p-6 shadow-xl space-y-4 flex flex-col">
        <div>
          <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Nearby Hospital Index</h3>
          <p className="text-xs text-neutral-500">Live bed counter and specialty routing across nearby charities & government centers.</p>
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
            const beds = bedOccupancy[hosp.id] || hosp.emergencyBeds;
            
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
                      {hosp.type} Center
                    </span>
                    <span className="text-xs font-mono text-neutral-400 font-bold">{hosp.distance} away</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-800">{hosp.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{hosp.address}</p>
                </div>

                {/* Emergency Bed Indicator */}
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-neutral-400 block uppercase">EMERGENCY BEDS</span>
                  <span className={`text-base font-mono font-black ${
                    beds < 6 ? 'text-emergency animate-pulse' : beds < 15 ? 'text-orange-500' : 'text-brand'
                  }`}>
                    {beds} Active
                  </span>
                </div>
              </div>
            );
          })}
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
                  {bedOccupancy[selectedHospital.id]} Open
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-neutral-400 block uppercase">Distance Matrix</span>
                <span className="text-sm font-mono font-black text-brand-dark">
                  {selectedHospital.distance}
                </span>
              </div>
            </div>

            {/* Simulated Live Map container */}
            <div className="relative h-28 bg-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden flex items-center justify-center">
              {/* Retro compass grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <Compass className="w-8 h-8 text-brand animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-[9px] font-mono font-bold text-neutral-500 flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-emergency" />
                <span>LAT: {selectedHospital.lat} / LNG: {selectedHospital.lng}</span>
              </div>
            </div>

            {/* Call / Action panel */}
            <div className="space-y-2">
              <a 
                href={`tel:${selectedHospital.contact}`}
                className="w-full py-3 border border-neutral-200 hover:border-brand-hover hover:text-brand-hover text-neutral-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Registry: {selectedHospital.contact}</span>
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
