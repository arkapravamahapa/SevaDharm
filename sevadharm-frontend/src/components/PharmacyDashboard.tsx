import React, { useEffect, useRef } from 'react';
import PortalSvgDefs from './PortalSvgDefs';
import { pharmacyPortalHtml } from './portalHtml';
import { initPortalEngine } from './portalEngine.js';

interface PharmacyDashboardProps {
  currentUser?: any;
  onLogout?: () => void;
  onNavigateHome?: () => void;
  onNavigatePatient?: () => void;
}

export default function PharmacyDashboard({
  currentUser,
  onLogout,
  onNavigateHome,
  onNavigatePatient
}: PharmacyDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the pharmacy portal engine
    const engine = initPortalEngine(containerRef.current, {
      mode: 'pharmacy',
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
        dangerouslySetInnerHTML={{ __html: pharmacyPortalHtml }} 
      />
    </div>
  );
}
