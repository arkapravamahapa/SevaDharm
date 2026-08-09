import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, PhoneCall, AlertTriangle, Navigation, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

declare global {
  interface Window {
    google: any;
  }
}

interface Hospital {
  id: string;
  name: string;
  type: 'Private' | 'Charity' | 'Government';
  address: string;
  phone: string;
  emergencyBeds: number;
}

export default function HospitalLocator({ onBackToDashboard, onActivateSOS }: { onBackToDashboard: () => void; onActivateSOS: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingGps, setLoadingGps] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Private' | 'Charity' | 'Government'>('All');

  const mapInstanceRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Fetch live hospital records from Supabase Enterprise Registry
  useEffect(() => {
    async function fetchLiveHospitals() {
      setLoadingData(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'pharmacy')
          .eq('verification_status', 'verified');

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Hospital[] = data.map((item: any) => {
            // Map the center_type string from admin to the UI type
            let mappedType: 'Private' | 'Charity' | 'Government' = 'Private';
            if (item.center_type?.includes('GOVERNMENT')) mappedType = 'Government';
            else if (item.center_type?.includes('TRUST') || item.center_type?.includes('CHARITY')) mappedType = 'Charity';

            return {
              id: item.id,
              name: item.full_name || 'Medical Center',
              type: mappedType,
              address: item.location || 'Kolkata, West Bengal',
              phone: item.phone || '+91 33 0000 0000',
              emergencyBeds: item.emergency_beds ?? 10
            };
          });

          setHospitals(mapped);
          setSelectedHospital(mapped[0]); // Select first hospital by default
        } else {
          // Fallback if database is empty so map/ui doesn't break
          const fallback: Hospital[] = [
            {
              id: 'fallback-1',
              name: 'Apollo Multispeciality Hospitals',
              type: 'Private',
              address: 'IG-16, Action Area 1D, New Town, Kolkata, West Bengal',
              phone: '+91 33 2320 3040',
              emergencyBeds: 12
            }
          ];
          setHospitals(fallback);
          setSelectedHospital(fallback[0]);
        }
      } catch (err) {
        console.error('Error fetching live hospitals from Supabase:', err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchLiveHospitals();
  }, []);

  // 2. Get User's Real GPS Coordinates via Browser Geolocation API
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingGps(false);
        },
        (error) => {
          console.warn('Geolocation error or permission denied, defaulting to Kolkata center:', error.message);
          setUserLocation({ lat: 22.5726, lng: 88.3639 });
          setLoadingGps(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation({ lat: 22.5726, lng: 88.3639 });
      setLoadingGps(false);
    }
  }, []);

  // 3. Initialize Google Map
  useEffect(() => {
    if (!userLocation || !mapRef.current || !selectedHospital) return;

    setOptions({
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      v: 'weekly',
    });

    Promise.all([
      importLibrary('maps'),
      importLibrary('routes'),
      importLibrary('marker'),
      importLibrary('geocoding')
    ]).then(() => {
      const google = window.google;
      if (!google) return;

      const map = new google.maps.Map(mapRef.current as HTMLElement, {
        center: userLocation,
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#f07b43',
          strokeWeight: 6,
        },
      });
      directionsRendererRef.current = directionsRenderer;

      updateRouteAndMarkers(google, map, userLocation, selectedHospital, directionsRenderer);
    }).catch((err: any) => {
      console.error('Error loading Google Maps script or libraries:', err);
    });
  }, [userLocation, selectedHospital?.id]);

  const updateRouteAndMarkers = (google: any, map: any, origin: { lat: number; lng: number }, hospital: Hospital, directionsRenderer: any) => {
    if (!google || !google.maps || !hospital) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Add User Marker (Blue Dot)
    const userMarker = new google.maps.Marker({
      position: origin,
      map: map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#2563eb',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });
    markersRef.current.push(userMarker);

    // Use Geocoder to find the EXACT real coordinates of the hospital address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: hospital.address }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const hospitalLatLng = results[0].geometry.location;

        // Add Hospital Marker (Red Pin)
        const hospitalMarker = new google.maps.Marker({
          position: hospitalLatLng,
          map: map,
          title: hospital.name,
        });
        markersRef.current.push(hospitalMarker);

        // Calculate and Draw Shortest Driving Route
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: origin,
            destination: hospitalLatLng,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response: any, routeStatus: any) => {
            if (routeStatus === 'OK' && response) {
              directionsRenderer.setDirections(response);
              const leg = response.routes[0].legs[0];
              setRouteInfo({
                distance: leg.distance?.text || 'Calculated',
                duration: leg.duration?.text || 'Estimated'
              });

              // Auto-fit bounds so user and hospital are both visible with the route line
              const bounds = new google.maps.LatLngBounds();
              bounds.extend(origin);
              bounds.extend(hospitalLatLng);
              map.fitBounds(bounds);
            } else {
              console.error('Directions request failed due to ' + routeStatus);
            }
          }
        );
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || h.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation / Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div>
            <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tight">Nearby Hospital Index & GPS Navigation</h2>
            <p className="text-xs text-neutral-400">Live database directory routing via Google Maps GPS integration.</p>
          </div>
        </div>
        {(loadingGps || loadingData) && (
          <div className="flex items-center gap-2 text-xs font-bold text-brand bg-brand-light px-3 py-1.5 rounded-full animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> {loadingData ? 'Loading Database...' : 'Fetching GPS Location...'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hospital Directory List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <input
              type="text"
              placeholder="Search center or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand"
            />
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {(['All', 'Private', 'Charity', 'Government'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    filterType === type ? 'bg-brand text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredHospitals.map((hospital) => {
              const isSelected = selectedHospital?.id === hospital.id;
              return (
                <div
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start ${
                    isSelected ? 'border-brand bg-brand-light/30 shadow-md' : 'border-neutral-100 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                        {hospital.type} Center
                      </span>
                      {routeInfo && isSelected && (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-brand text-white flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5" /> {routeInfo.distance} ({routeInfo.duration})
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-neutral-900">{hospital.name}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> {hospital.address}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block">Emergency Beds</span>
                    <span className="text-sm font-black text-brand">{hospital.emergencyBeds} Active</span>
                  </div>
                </div>
              );
            })}
            {filteredHospitals.length === 0 && !loadingData && (
              <div className="text-center py-12 text-neutral-400 text-xs">
                No hospital or medical centers found matching your filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Google Maps Interactive View & Actions */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
          {selectedHospital ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900">{selectedHospital.name}</h3>
                    <p className="text-[11px] text-neutral-400">{selectedHospital.address}</p>
                  </div>
                  {routeInfo && (
                    <div className="bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-right">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase block">Shortest Route</span>
                      <span className="text-xs font-black text-brand">{routeInfo.distance} • {routeInfo.duration}</span>
                    </div>
                  )}
                </div>

                {/* Google Maps Container Div */}
                <div 
                  ref={mapRef} 
                  className="w-full h-72 rounded-2xl border border-neutral-200 overflow-hidden shadow-inner bg-neutral-100"
                />
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${selectedHospital.phone}`}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4 text-brand" /> Call Registry: {selectedHospital.phone}
                </a>

                <button
                  onClick={onActivateSOS}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" /> Call Emergency Ambulance
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400 text-xs">
              Select a hospital facility from the left list to load route options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}