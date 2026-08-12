import React, { useState, useEffect } from 'react';
import AddHospitalForm from './AddHospitalForm';
import { ShieldAlert, Trash2, Building2, RefreshCw } from 'lucide-react';

interface AdminPageProps {
  onBackToDashboard: () => void;
}

interface HospitalData {
  id: string;
  name: string;
  address: string;
  type: string;
}

export default function AdminPage({ onBackToDashboard }: AdminPageProps) {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current live database entries
  const fetchHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospital network data');
      
      const result = await response.json();
      setHospitals(result.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Run the fetch on initial load
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Secure Delete Function
  const handleDelete = async (id: string, name: string) => {
    // Add a strict confirmation prompt for production safety
    const isConfirmed = window.confirm(`WARNING: Are you sure you want to permanently delete ${name} from the database?`);
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:8000/api/hospitals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete the hospital record');

      // Refresh the UI to reflect the deleted row
      fetchHospitals();
    } catch (err: any) {
      alert(`Deletion Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button
          onClick={onBackToDashboard}
          className="px-5 py-2.5 bg-white border border-neutral-100 rounded-xl text-xs font-extrabold text-brand hover:bg-brand-light hover:border-brand/30 hover:shadow-md transition-all cursor-pointer flex items-center w-fit"
        >
          ← Return to Main Dashboard
        </button>

        {/* Admin Warning Banner */}
        <div className="bg-gradient-to-br from-brand to-orange-500 p-6 rounded-3xl flex items-center gap-5 text-white shadow-xl shadow-brand/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <ShieldAlert className="w-32 h-32" />
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl relative z-10">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="font-black text-lg tracking-wide text-white">Secure Admin Portal</h2>
            <p className="text-sm font-medium text-white/90 mt-1 max-w-lg">Authorized medical personnel only. Data entered here immediately updates the live SEVA-DHARM ecosystem.</p>
          </div>
        </div>

        {/* The Registration Form */}
        <AddHospitalForm />

        {/* Database Management View */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-2xl shadow-neutral-200/50 mt-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-orange-500" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Active Network Registry</h3>
              <p className="text-sm text-neutral-500 mt-1.5 font-medium">Manage and audit live hospital records in the network.</p>
            </div>
            <button 
              onClick={fetchHospitals}
              className="p-3 bg-brand-light hover:bg-brand hover:text-white text-brand rounded-2xl transition-all cursor-pointer shadow-sm"
              title="Refresh Database"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 hover:border-brand/40 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-light rounded-2xl text-brand group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-800">{hospital.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mt-1">
                      <span className="text-brand">{hospital.type}</span> • {hospital.address}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(hospital.id, hospital.name)}
                  className="p-3 bg-white border border-neutral-100 hover:bg-red-500 hover:border-red-500 text-neutral-400 hover:text-white rounded-2xl transition-all cursor-pointer hover:shadow-lg hover:shadow-red-500/30"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {!isLoading && hospitals.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-sm font-bold border-2 border-dashed border-neutral-200 rounded-2xl">
                No hospitals found in the database.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
