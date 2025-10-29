/**
 * Supabase Client
 * Centralized Supabase instance
 */

import { createClient } from '@supabase/supabase-js';
import ENV, { validateEnv } from '../../config/env.config';

// Validate environment on initialization
const isValid = validateEnv();

if (!isValid && ENV.IS_DEV) {
  console.error('[Supabase] Configuration errors detected. Please check env.config.js');
}

/**
 * Create Supabase client
 *
 * Note: Using Publishable Key (formerly called "anon key")
 * This is safe to use in client-side code
 * NEVER use Secret Key (service_role) in client-side code!
 */
const supabaseUrl = ENV.SUPABASE_URL;
const supabasePublishableKey = ENV.SUPABASE_PUBLISHABLE_KEY;
const isUsingNewKeyFormat = typeof supabasePublishableKey === 'string' && supabasePublishableKey.startsWith('sb_');

// Additional validation
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('[Supabase] Missing required configuration. Check SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: undefined, // Use default AsyncStorage
    storageKey: 'eefashionita-auth-token',
  },
});

// Log successful initialization in dev mode
if (ENV.IS_DEV) {
  console.log('[Supabase] Client initialized successfully');
  console.log('[Supabase] URL:', supabaseUrl);
  console.log('[Supabase] Key:', supabasePublishableKey.substring(0, 20) + '...');
  console.log('[Supabase] Key Format:', isUsingNewKeyFormat ? 'publishable (sb_)' : 'legacy JWT');
}

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  return (
    !supabaseUrl.includes('your-project') &&
    !supabasePublishableKey.includes('your-publishable-key') &&
    supabasePublishableKey !== 'YOUR_ACTUAL_ANON_KEY_HERE'
  );
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('[Supabase] Error getting session:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('[Supabase] Error getting user:', error);
    return null;
  }
};

export default supabase;

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_KEY = supabasePublishableKey;
export const isNewSupabaseKeyFormat = isUsingNewKeyFormat;

