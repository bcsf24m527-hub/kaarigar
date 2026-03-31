import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
	// Helpful runtime diagnostic when env vars are not provided
	// Missing values will cause network requests to go to the wrong URL and return 404.
	// Check your .env (Vite) files and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
	// Example for local dev: VITE_SUPABASE_URL=https://xyzcompany.supabase.co
	//                      VITE_SUPABASE_ANON_KEY=eyJhbGci...
	// This log is intentionally `console.error` so it appears in DevTools immediately.
	console.error('Supabase env vars missing:', { supabaseUrl, supabaseAnonKey });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'kaarigar-auth-token',
  }
});
