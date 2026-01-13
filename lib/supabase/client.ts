import { createBrowserClient } from '@supabase/ssr';

// Check if Supabase is configured
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function createClient() {
    if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - running in demo mode');
        return null;
    }

    return createBrowserClient(
        SUPABASE_URL!,
        SUPABASE_ANON_KEY!
    );
}
