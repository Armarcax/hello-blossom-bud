import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// 🧠 HARD GUARD (dev + build safety)
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('[Supabase] Missing environment variables');
}

// 🧠 Singleton pattern (prevents multiple clients bugs)
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  supabaseInstance = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',

        // 🧠 reduces random session corruption
        debug: false,
      },
    }
  );

  // 🧠 GLOBAL AUTH SAFETY LAYER
  supabaseInstance.auth.onAuthStateChange(async (event, session) => {
    switch (event) {
      case 'SIGNED_OUT':
        localStorage.removeItem('supabase.auth.token');
        break;

      case 'TOKEN_REFRESHED':
        if (!session) {
          console.warn('[Supabase] Token refresh failed → signing out safely');
          await supabaseInstance.auth.signOut();
        }
        break;

      case 'USER_UPDATED':
        // optional hook for future
        break;
    }
  });

  return supabaseInstance;
}

// optional shortcut (backward compatible)
export const supabase = getSupabase();