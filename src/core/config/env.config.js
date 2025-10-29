/**
 * Environment Configuration
 * Centralized environment variables management
 */

// Note: In React Native, we need to use a different approach for env variables
// For now, we'll use inline configuration. In production, use react-native-dotenv or similar

const ENV = {
  // Supabase Configuration
  // ⚠️ SECURITY: DO NOT commit real keys to git!
  // Set these via environment variables or .env file
  //
  // 🔑 GET YOUR REAL KEYS FROM:
  // 1. Go to: https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/settings/api
  // 2. Copy "Project API keys" → "anon" → "public" key
  // 3. Replace the value below
  //
  // ✅ ANON/PUBLIC KEY - Safe to use in React Native app
  // ❌ SERVICE_ROLE KEY - NEVER use in client-side code!
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://riwzkjsbnggcmqnjimsa.supabase.co',
  
  // ⚠️ TEMPORARY: Using the key format you provided
  // If this doesn't work, you need to get the real anon/public key from:
  // https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/settings/api
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_L89YcNI2LfXVM1ItoJlSOg_d_CdMrit',

  // API Configuration
  API_TIMEOUT: 30000,
  API_RETRY_ATTEMPTS: 3,

  // Feature Flags
  ENABLE_CLOUD_SYNC: false, // Disabled until backend cloud sync is implemented
  ENABLE_PREMIUM_FEATURES: true,
  ENABLE_OFFLINE_SUPPORT: false, // Disabled until offline cache strategy ships
  ENABLE_IMAGE_UPLOAD: false, // Disabled until storage pipeline is configured

  // App Configuration
  APP_ENV: __DEV__ ? 'development' : 'production',
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

