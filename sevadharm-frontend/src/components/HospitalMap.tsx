import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface HospitalMapProps {
  hospitalName?: string;
  latitude?: number;
  longitude?: number;
}

export default function HospitalMap({ 
  hospitalName = "SevaDharam Main Clinic", 
  latitude = 22.5726, // Default to West Bengal / Kolkata region coordinates
  longitude = 88.3639 
}: HospitalMapProps) {
  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl border border-neutral-200 relative z-0">
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={14} 
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* OpenStreetMap standard normal map tiles - completely free, no billing required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup>
            <div className="font-bold text-neutral-900">{hospitalName}</div>
            <p className="text-xs text-neutral-500">SevaDharam Verified Facility</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}