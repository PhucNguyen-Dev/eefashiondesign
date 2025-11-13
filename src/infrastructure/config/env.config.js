/**
 * Environment Configuration
 * Centralized environment variables management
 */

import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  ENABLE_CLOUD_SYNC,
  ENABLE_PREMIUM_FEATURES,
  ENABLE_OFFLINE_SUPPORT,
  ENABLE_IMAGE_UPLOAD,
  APP_ENV,
} from '@env';

const ENV = {
  // Supabase Configuration
  // ⚠️ SECURITY: DO NOT commit real keys to git!
  // Set these via .env file (already in .gitignore)
  //
  // 🔑 GET YOUR REAL KEYS FROM:
  // 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
  // 2. Copy "Project API keys" → "anon" → "public" key
  // 3. Add to .env file
  //
  // ✅ ANON/PUBLIC KEY - Safe to use in React Native app
  // ❌ SERVICE_ROLE KEY - NEVER use in client-side code!
  SUPABASE_URL: SUPABASE_URL || 'https://riwzkjsbnggcmqnjimsa.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY || '',

  // API Configuration
  API_TIMEOUT: parseInt(API_TIMEOUT, 10) || 30000,
  API_RETRY_ATTEMPTS: parseInt(API_RETRY_ATTEMPTS, 10) || 3,

  // Feature Flags
  ENABLE_CLOUD_SYNC: ENABLE_CLOUD_SYNC === 'true',
  ENABLE_PREMIUM_FEATURES: ENABLE_PREMIUM_FEATURES !== 'false',
  ENABLE_OFFLINE_SUPPORT: ENABLE_OFFLINE_SUPPORT === 'true',
  ENABLE_IMAGE_UPLOAD: ENABLE_IMAGE_UPLOAD === 'true',

  // App Configuration
  APP_ENV: APP_ENV || (__DEV__ ? 'development' : 'production'),
  IS_DEV: __DEV__,
};

/**
 * Validate environment configuration
 */
export const validateEnv = () => {
  const warnings = [];

  // Check if Supabase URL is configured
  if (!ENV.SUPABASE_URL || ENV.SUPABASE_URL.includes('your-project')) {
    warnings.push('⚠️ SUPABASE_URL not configured properly.');
  }

  // Check if key is configured and in JWT format
  const key = ENV.SUPABASE_PUBLISHABLE_KEY;
  if (!key || key.includes('YOUR_ACTUAL_ANON_KEY_HERE')) {
    warnings.push(
      '❌ SUPABASE_PUBLISHABLE_KEY not configured!',
      '📖 Copy your publishable/anon key from Supabase → Settings → API',
    );
  } else if (key.startsWith('sb_')) {
    console.log('[ENV] Using new Supabase publishable key format (sb_...)');
  } else if (!key.startsWith('eyJ')) {
    warnings.push(
      '⚠️ SUPABASE_PUBLISHABLE_KEY should be a JWT token starting with "eyJ".',
      '📖 Check your Supabase Dashboard for the correct anon/public key',
    );
  }

  // Log warnings in development
  if (warnings.length > 0 && ENV.IS_DEV) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🔴 SUPABASE CONFIGURATION ERROR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for (const warning of warnings) {
      console.error(warning);
    }
    console.error('');
    console.error('📍 Update: src/core/config/env.config.js');
    console.error('🔗 Dashboard: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/settings/api');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  return warnings.length === 0;
};

export default ENV;

