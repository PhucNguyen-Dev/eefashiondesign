/**
 * Application Constants
 * Centralized configuration and constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.3datelier.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * WebSocket Configuration
 */
export const WS_CONFIG = {
  URL: process.env.REACT_APP_WS_URL || 'wss://api.3datelier.com/ws',
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
};

/**
 * CDN Configuration
 */
export const CDN_CONFIG = {
  BASE_URL: 'https://cdn.3datelier.com',
  MODELS_PATH: '/models',
  TEXTURES_PATH: '/textures',
  THUMBNAILS_PATH: '/thumbnails',
  RENDERS_PATH: '/renders',
};

/**
 * 3D Engine Configuration
 */
export const ENGINE_3D_CONFIG = {
  // Renderer settings
  RENDERER: {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  },
  
  // Camera settings
  CAMERA: {
    fov: 50,
    near: 0.1,
    far: 1000,
    position: [0, 1.5, 3],
    target: [0, 1, 0],
  },
  
  // Lighting settings
  LIGHTING: {
    ambient: {
      color: 0xffffff,
      intensity: 0.3,
    },
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: [5, 5, 5],
    },
    hemisphere: {
      skyColor: 0xffffff,
      groundColor: 0x444444,
      intensity: 0.4,
    },
  },
  
  // Performance settings
  PERFORMANCE: {
    maxPolygons: 50000,
    maxTextureSize: 2048,
    shadowMapSize: 1024,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  },
  
  // LOD (Level of Detail) settings
  LOD: {
    enabled: true,
    distances: [0, 10, 20, 50],
    hysteresis: 0.1,
  },
};

/**
 * Material Presets
 */
export const MATERIAL_TYPES = {
  DENIM: 'denim',
  COTTON: 'cotton',
  LEATHER: 'leather',
  SILK: 'silk',
  WOOL: 'wool',
  LINEN: 'linen',
  POLYESTER: 'polyester',
  SATIN: 'satin',
};

export const MATERIAL_DEFAULTS = {
  [MATERIAL_TYPES.DENIM]: {
    roughness: 70,
    shininess: 10,
    thickness: 1.2,
    weight: 1.5,
  },
  [MATERIAL_TYPES.COTTON]: {
    roughness: 60,
    shininess: 5,
    thickness: 0.8,
    weight: 1.0,
  },
  [MATERIAL_TYPES.LEATHER]: {
    roughness: 40,
    shininess: 30,
    thickness: 2.0,
    weight: 2.5,
  },
  [MATERIAL_TYPES.SILK]: {
    roughness: 20,
    shininess: 60,
    thickness: 0.3,
    weight: 0.5,
  },
  [MATERIAL_TYPES.WOOL]: {
    roughness: 80,
    shininess: 5,
    thickness: 1.5,
    weight: 1.8,
  },
};

/**
 * Garment Types
 */
export const GARMENT_TYPES = {
  BOTTOM: 'bottom',
  ONEPIECE: 'onepiece',
  JUMPSUIT: 'jumpsuit',
  DRESS: 'dress',
  TOP: 'top',
  SKIRT: 'skirt',
  PANTS: 'pants',
};

/**
 * View Orientations
 */
export const VIEW_ORIENTATIONS = {
  FRONT: 'front',
  BACK: 'back',
  SIDE: 'side',
  TOP: 'top',
  WALKING: 'walking',
};

/**
 * Design Tools
 */
export const DESIGN_TOOLS = {
  MATERIAL: 'material',
  SOLID_COLOR: 'solid_color',
  PATTERN: 'pattern',
  DRAWING: 'drawing',
  TEXT: 'text',
  COLOR_ADJUST: 'color_adjust',
  LIGHTING: 'lighting',
  SEAMS: 'seams',
  MEASUREMENTS: 'measurements',
  PLEATING: 'pleating',
  MAPPING: 'mapping',
  POSES: 'poses',
  OPTIMIZE: 'optimize',
};

/**
 * Export Formats
 */
export const EXPORT_FORMATS = {
  IMAGE: {
    PNG: 'png',
    JPEG: 'jpeg',
    WEBP: 'webp',
  },
  MODEL: {
    GLB: 'glb',
    GLTF: 'gltf',
    FBX: 'fbx',
    OBJ: 'obj',
  },
  VIDEO: {
    MP4: 'mp4',
    WEBM: 'webm',
  },
};

/**
 * Render Quality Presets
 */
export const RENDER_QUALITY = {
  LOW: {
    resolution: '1080p',
    samples: 32,
    quality: 'low',
  },
  MEDIUM: {
    resolution: '2K',
    samples: 64,
    quality: 'medium',
  },
  HIGH: {
    resolution: '4K',
    samples: 128,
    quality: 'high',
  },
  ULTRA: {
    resolution: '8K',
    samples: 256,
    quality: 'ultra',
  },
};

/**
 * Physics Simulation Settings
 */
export const PHYSICS_CONFIG = {
  GRAVITY: 9.8,
  WIND: {
    min: 0,
    max: 100,
    default: 47,
  },
  STIFFNESS: {
    min: 0,
    max: 1,
    default: 0.5,
  },
  DAMPING: {
    min: 0,
    max: 1,
    default: 0.1,
  },
  ITERATIONS: {
    min: 10,
    max: 200,
    default: 100,
  },
};

/**
 * UI Theme Colors (from reference image)
 */
export const THEME_COLORS = {
  // Background
  background: {
    primary: '#1a1d2e',
    secondary: '#252837',
    tertiary: '#2d3142',
  },
  
  // Accent colors
  accent: {
    blue: '#4A90E2',
    purple: '#6C5CE7',
    teal: '#00D9C0',
    coral: '#FF6B6B',
    mint: '#7FFFD4',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B9C1',
    tertiary: '#6B6C7E',
  },
  
  // UI elements
  ui: {
    border: '#3A3D4E',
    hover: '#3D4152',
    active: '#4A4D62',
    disabled: '#2A2D3E',
  },
  
  // Gradients
  gradients: {
    saveSync: ['#6C5CE7', '#4A90E2'],
    exportRender: ['#FF6B6B', '#FF8E53'],
    shareCollaborate: ['#00D9C0', '#7FFFD4'],
  },
};

/**
 * Animation Durations
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

/**
 * Local Storage Keys
 * Note: Using @ prefix is AsyncStorage convention for React Native
 * Merged from src/config/constants.js to avoid duplicates
 */
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',

  // App Data
  THEME: '@theme',
  DESIGNS: '@designs',
  PROJECTS: '@projects',
  MEASUREMENTS: '@measurements',
  TEMPLATES: '@templates',
  SETTINGS: '@settings',

  // User Preferences
  RECENT_COLORS: '@recent_colors',
  RECENT_MATERIALS: '@recent_materials',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  LAST_SYNC: '@last_sync',
};

/**
 * Auto-save Settings
 */
export const AUTO_SAVE = {
  ENABLED: true,
  INTERVAL: 30000, // 30 seconds
  MAX_VERSIONS: 10,
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  FEATURE_NOT_AVAILABLE: 'This feature is not available on your device.',
  WEBGL_NOT_SUPPORTED: 'WebGL is not supported on your browser.',
  CAMERA_NOT_AVAILABLE: 'Camera is not available.',
};

export default {
  API_CONFIG,
  WS_CONFIG,
  CDN_CONFIG,
  ENGINE_3D_CONFIG,
  MATERIAL_TYPES,
  MATERIAL_DEFAULTS,
  GARMENT_TYPES,
  VIEW_ORIENTATIONS,
  DESIGN_TOOLS,
  EXPORT_FORMATS,
  RENDER_QUALITY,
  PHYSICS_CONFIG,
  THEME_COLORS,
  ANIMATION_DURATION,
  STORAGE_KEYS,
  AUTO_SAVE,
  ERROR_MESSAGES,
};

