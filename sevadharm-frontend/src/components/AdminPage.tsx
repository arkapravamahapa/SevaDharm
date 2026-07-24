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
          className="px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-extrabold text-neutral-600 hover:text-neutral-900 hover:shadow-sm transition-all cursor-pointer"
        >
          ← Return to Main Dashboard
        </button>

        {/* Admin Warning Banner */}
        <div className="bg-neutral-900 p-5 rounded-3xl flex items-center gap-4 text-white shadow-xl">
          <div className="p-2 bg-neutral-800 rounded-full">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-wide uppercase text-red-400">Secure Admin Portal</h2>
            <p className="text-xs font-medium text-neutral-400 mt-0.5">Authorized medical personnel only. Data entered here updates the live SEVA-DHARM database.</p>
          </div>
        </div>

        {/* The Registration Form */}
        <AddHospitalForm />

        {/* Database Management View */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-xl mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">Active Network Registry</h3>
              <p className="text-sm text-neutral-500 mt-1">Manage and audit live hospital records.</p>
            </div>
            <button 
              onClick={fetchHospitals}
              className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full transition-all cursor-pointer"
              title="Refresh Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Building2 className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-800">{hospital.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mt-0.5">
                      {hospital.type} • {hospital.address}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(hospital.id, hospital.name)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl transition-all cursor-pointer"
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
