import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  // Check if already unlocked in this session
  useEffect(() => {
    const unlocked = sessionStorage.getItem('admin_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare typed passkey with your environment secret key (fallback to a default if env isn't loaded yet)
    const secret = import.meta.env.VITE_ADMIN_SECRET_KEY || 'SEVA@2026';
    
    if (passkey === secret) {
      sessionStorage.setItem('admin_unlocked', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-neutral-100 rounded-3xl p-8 text-neutral-900 shadow-2xl shadow-brand/10 space-y-6">
          <div className="w-16 h-16 bg-brand-light border border-brand/20 rounded-2xl flex items-center justify-center text-brand mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">Restricted Admin Access</h2>
            <p className="text-xs text-neutral-500 font-medium">Enter your secure enterprise passkey to enter the command center.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-5">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Passkey..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-sm font-medium text-neutral-900 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all shadow-inner focus:shadow-md"
                autoFocus
              />
              {error && <p className="text-[11px] text-red-500 font-bold mt-2 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Invalid passkey. Access denied.</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-brand/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              Authorize Access
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100">
            <button
              onClick={() => window.location.replace('/portal/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-brand transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Patient Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
