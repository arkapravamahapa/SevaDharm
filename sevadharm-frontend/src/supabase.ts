import { createClient } from '@supabase/supabase-js';

const env = (import.meta as ImportMeta & {
  env: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  };
}).env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in React frontend.');
}

// This 'supabase' object is what we will use to log in users and fetch data!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);