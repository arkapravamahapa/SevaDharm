import React, { useState } from 'react';
import { Building2, MapPin, Phone, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

// --- ADDED STRICT TYPESCRIPT INTERFACE ---
interface HospitalFormData {
  name: string;
  address: string;
  type: string;
  distance: string;
  emergencyBeds: number;
  lat: number;
  lng: number;
  contact: string;
}

export default function AddHospitalForm() {
  // Applied the interface to the state
  const [formData, setFormData] = useState<HospitalFormData>({
    name: '',
    address: '',
    type: 'Government',
    distance: '',
    emergencyBeds: 0,
    lat: 0.0,
    lng: 0.0,
    contact: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: HospitalFormData) => ({
      ...prev,
      // Safely tell TypeScript that 'name' is a valid key of our interface
      [name as keyof HospitalFormData]: name === 'emergencyBeds' ? parseInt(value) || 0 : 
              name === 'lat' || name === 'lng' ? parseFloat(value) || 0 : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register hospital to the database.');
      }

      setSuccess(true);
      setFormData({
        name: '', address: '', type: 'Government', distance: '',
        emergencyBeds: 0, lat: 0, lng: 0, contact: ''
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-neutral-100 p-8 shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Register Medical Center</h3>
        <p className="text-sm text-neutral-500 mt-1">Add a new hospital securely to the SEVA-DHARM database.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">Hospital registered successfully! It is now live on the network.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Facility Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input required type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                placeholder="e.g. City General" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Facility Type</label>
            <select required name="type" value={formData.type} onChange={handleChange}
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all">
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Charity">Charity</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Full Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input required type="text" name="address" value={formData.address} onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                placeholder="123 Medical Blvd" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Emergency Contact</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input required type="text" name="contact" value={formData.contact} onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Active Beds</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input required type="number" min="0" name="emergencyBeds" value={formData.emergencyBeds} onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-bold text-blue-600 transition-all" />
            </div>
          </div>
          <div>
             <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Latitude</label>
             <input required type="number" step="any" name="lat" value={formData.lat} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-mono transition-all" />
          </div>
          <div>
             <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Longitude</label>
             <input required type="number" step="any" name="lng" value={formData.lng} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-mono transition-all" />
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Distance</label>
           <input required type="text" name="distance" value={formData.distance} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-sm font-semibold transition-all"
                placeholder="e.g. 5.2 km" />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full mt-6 py-4 rounded-2xl text-white font-extrabold text-sm transition-all shadow-lg ${
            isSubmitting ? 'bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900 hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
          }`}
        >
          {isSubmitting ? 'Registering to Database...' : 'Register Hospital Network'}
        </button>
      </form>
    </div>
  );
}