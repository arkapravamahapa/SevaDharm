import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdminRole() {
      // 1. Get the current active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      // 2. Query the database directly to verify their absolute role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      // 3. Approve or deny based on the database response
      setIsAdmin(profile?.role === 'admin');
    }

    checkAdminRole();
  }, []);

  // While checking the database, show a secure loading screen
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white space-y-4">
        <Loader2 className="w-8 h-8 text-[#de7649] animate-spin" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Verifying Admin Credentials...</span>
      </div>
    );
  }

  // If they are NOT an admin, block access and show a security warning
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Access Denied</h2>
        <p className="text-xs text-neutral-400 max-w-md leading-relaxed mb-6">
          This area is restricted to Seva Dharm administrative personnel only. Your access attempt has been logged.
        </p>
        <button 
          onClick={() => window.location.replace('/portal/dashboard')}
          className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold tracking-widest uppercase transition-all"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  // If they ARE an admin, render the requested page
  return <>{children}</>;
}