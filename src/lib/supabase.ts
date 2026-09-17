import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys from environment or LocalStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const storedUrl = localStorage.getItem('study_ai_supabase_url');
  const storedKey = localStorage.getItem('study_ai_supabase_anon_key');

  const url = storedUrl || envUrl || '';
  const anonKey = storedKey || envKey || '';

  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('study_ai_supabase_url', url.trim());
  localStorage.setItem('study_ai_supabase_anon_key', anonKey.trim());
  _client = null; // reset cached client
};

let _client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (_client) return _client;
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    _client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return _client;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

/**
 * Quick ping to test if Supabase credentials are valid
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    // Attempt lightweight query on auth or public table
    const { error } = await client.from('subjects').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, but credentials authenticated:
      if (error.message.includes('relation "public.subjects" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Run schema.sql to create database tables)'
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed.' };
  }
};
