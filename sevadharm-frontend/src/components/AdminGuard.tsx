import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem('admin_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const secret = import.meta.env.VITE_ADMIN_SECRET_KEY || 'SevaDharamAdmin2026!';
    
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
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-white shadow-2xl space-y-6">
          <div className="w-14 h-14 bg-[#de7649]/10 border border-[#de7649]/20 rounded-2xl flex items-center justify-center text-[#de7649] mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight">Restricted Admin Access</h2>
            <p className="text-xs text-neutral-400">Enter your secure enterprise passkey to enter the command center.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Passkey..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#de7649]"
                autoFocus
              />
              {error && <p className="text-[10px] text-red-400 font-bold mt-1.5">Invalid passkey. Access denied.</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#de7649] hover:bg-[#d16c41] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-[#de7649]/20"
            >
              Authorize Access
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => window.location.replace('/portal/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
