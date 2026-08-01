import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in React frontend.');
}

// This 'supabase' object is a strict singleton used to log in users and fetch data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
