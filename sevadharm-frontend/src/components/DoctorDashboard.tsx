import React, { useEffect, useRef } from 'react';
import PortalSvgDefs from './PortalSvgDefs';
import { doctorPortalHtml } from './portalHtml';
import { initPortalEngine } from './portalEngine.js';

interface DoctorDashboardProps {
  currentUser?: any;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigatePatient?: () => void;
}

export default function DoctorDashboard({
  currentUser,
  onLogout,
  onNavigateHome,
  onNavigatePatient
}: DoctorDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize doctor portal engine
    const engine = initPortalEngine(containerRef.current, {
      mode: 'doctor',
      currentUser,
      onLogout,
      onNavigateHome,
      onNavigatePatient
    });
    engineRef.current = engine;

    return () => {
      if (engineRef.current && typeof engineRef.current.destroy === 'function') {
        engineRef.current.destroy();
      }
    };
  }, [currentUser, onLogout, onNavigateHome, onNavigatePatient]);

  return (
    <div className="portal-scope w-full h-full relative" ref={containerRef}>
      <PortalSvgDefs />
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: doctorPortalHtml }} 
      />
    </div>
  );
}
