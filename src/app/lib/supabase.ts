import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or VITE_SUPABASE_ANON_KEY).',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseHealthResult = {
  ok: boolean;
  message: string;
};

export async function checkSupabaseConnection(
  bucket = 'images',
): Promise<SupabaseHealthResult> {
  try {
    const { error } = await supabase.storage.from(bucket).list('', { limit: 1 });
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Connected to Supabase successfully' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
