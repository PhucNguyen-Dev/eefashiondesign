/**
 * Feature Flags Configuration
 * Control feature availability across the app
 */

import ENV from './env.config';

export const FEATURES = {
  // Authentication
  AUTH: {
    ENABLED: true,
    EMAIL_PASSWORD: true,
    SOCIAL_LOGIN: false, // Backdoor for future (Google, Facebook, Apple)
    MAGIC_LINK: false, // Backdoor for future (passwordless)
    PHONE_AUTH: false, // Backdoor for future (SMS)
  },

  // Cloud Sync
  CLOUD_SYNC: {
    ENABLED: ENV.ENABLE_CLOUD_SYNC, // Currently false, backdoor for future
    AUTO_SYNC: true,
    SYNC_INTERVAL: 30000, // 30 seconds
    CONFLICT_RESOLUTION: 'server-wins', // or 'client-wins', 'manual'
  },

  // Image Upload
  IMAGE_UPLOAD: {
    ENABLED: ENV.ENABLE_IMAGE_UPLOAD, // Currently false, backdoor for future
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
    COMPRESSION: true,
    COMPRESSION_QUALITY: 0.8,
  },

  // Real-time Collaboration
  COLLABORATION: {
    ENABLED: false, // Not implemented, backdoor for future
    REAL_TIME: false,
    MAX_COLLABORATORS: 5,
  },

  // Offline Support
  OFFLINE: {
    ENABLED: ENV.ENABLE_OFFLINE_SUPPORT, // Currently false
    PLATFORMS: ['mobile', 'tablet', 'desktop'], // Not web
    CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    SYNC_ON_RECONNECT: true,
  },

  // Premium Features
  PREMIUM: {
    ENABLED: ENV.ENABLE_PREMIUM_FEATURES, // Currently true
    FEATURES: [
      'advanced_3d_tools',
      'unlimited_designs',
      'hd_export',
      'custom_materials',
      'ai_suggestions',
    ],
    TRIAL_DAYS: 7,
  },

  // Export Features
  EXPORT: {
    PNG: true,
    SVG: true,
    PDF: true,
    GLTF: false, // Backdoor for 3D model export
    FBX: false, // Backdoor for 3D model export
    OBJ: false, // Backdoor for 3D model export
  },

  // 3D Features
  THREE_D: {
    ENABLED: true,
    MAX_POLYGONS: 100000,
    TEXTURE_RESOLUTION: 2048,
    REAL_TIME_RENDERING: true,
    PHYSICS_SIMULATION: false, // Backdoor for future
  },

  // AR Features
  AR: {
    ENABLED: true,
    BODY_TRACKING: false, // Backdoor for future
    FACE_TRACKING: false, // Backdoor for future
    SURFACE_DETECTION: true,
  },
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (category, feature) => {
  try {
    if (!FEATURES[category]) return false;
    if (feature) {
      return FEATURES[category][feature] === true;
    }
    return FEATURES[category].ENABLED === true;
  } catch (error) {
    console.warn(`[Features] Error checking feature ${category}.${feature}:`, error);
    return false;
  }
};

/**
 * Get feature configuration
 */
export const getFeatureConfig = (category) => {
  return FEATURES[category] || {};
};

export default FEATURES;

