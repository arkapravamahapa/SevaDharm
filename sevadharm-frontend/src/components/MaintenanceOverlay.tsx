import React from 'react';

export default function MaintenanceOverlay() {
  return (
    <div 
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
    >
      {/* Glassmorphism Card */}
      <div className="max-w-lg w-full bg-white/9ribute dark:bg-gray-900/90 backdrop-blur-xl border border-white/40 dark:border-gray-700/60 rounded-3xl p-8 shadow-2xl text-center">
        
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 id="maintenance-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Website Under Maintenance
        </h2>

        {/* Message addressing compliance and legal standards */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Seva-Dharm is temporarily offline as we update our system architecture to comply with newly revised government healthcare regulations and legal standards. All features, data access, and account creations are currently locked for your security.
        </p>

        {/* Status Badge */}
        <div className="inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase">
          Status: Compliance Update in Progress
        </div>
      </div>
    </div>
  );
}