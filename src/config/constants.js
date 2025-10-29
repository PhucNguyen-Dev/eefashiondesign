// App Constants
export const APP_NAME = 'FashionCraft Studio';
export const APP_VERSION = '1.0.0';

// Theme Colors
export const COLORS = {
  primary: '#6C63FF',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  warning: '#FFD93D',
  success: '#A8E6CF',
  error: '#FF6B6B',
  
  // Background
  bgDark: '#0F0F1E',
  bgCard: '#1A1A2E',
  bgInput: '#2A2A3E',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textTertiary: '#666666',
  
  // Borders
  border: '#2A2A3E',
  borderActive: '#6C63FF',
  
  // Gradients
  gradientPrimary: ['#6C63FF', '#4ECDC4'],
  gradientSecondary: ['#FF6B6B', '#FFD93D'],
  gradientSuccess: ['#A8E6CF', '#98D6BF'],
  gradientDanger: ['#FF6B6B', '#FF5757'],
};

// Light Theme Colors
export const LIGHT_COLORS = {
  primary: '#6C63FF',
  secondary: '#4ECDC4',
  accent: '#FF6B6B',
  warning: '#FFD93D',
  success: '#A8E6CF',
  error: '#FF6B6B',
  
  // Background
  bgDark: '#FFFFFF',
  bgCard: '#F5F5F5',
  bgInput: '#E8E8E8',
  
  // Text
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // Borders
  border: '#E0E0E0',
  borderActive: '#6C63FF',
  
  // Gradients
  gradientPrimary: ['#6C63FF', '#4ECDC4'],
  gradientSecondary: ['#FF6B6B', '#FFD93D'],
  gradientSuccess: ['#A8E6CF', '#98D6BF'],
  gradientDanger: ['#FF6B6B', '#FF5757'],
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Font Sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  xxl: 25,
  round: 50,
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Screen Breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

// Storage Keys
// ⚠️ DEPRECATED: Use src/core/utils/constants.js instead
// This file is kept for backward compatibility only
// TODO: Migrate all imports to use src/core/utils/constants.js
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  THEME: '@theme',
  DESIGNS: '@designs',
  MEASUREMENTS: '@measurements',
  TEMPLATES: '@templates',
  SETTINGS: '@settings',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  LAST_SYNC: '@last_sync',
};

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.fashioncraft.com',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  DESIGNS: {
    LIST: '/designs',
    CREATE: '/designs',
    UPDATE: '/designs/:id',
    DELETE: '/designs/:id',
    SHARE: '/designs/:id/share',
  },
  TEMPLATES: {
    LIST: '/templates',
    POPULAR: '/templates/popular',
    SEARCH: '/templates/search',
  },
  TRENDS: {
    LIST: '/trends',
    FORECAST: '/trends/forecast',
  },
  COLLABORATION: {
    PROJECTS: '/projects',
    INVITE: '/projects/:id/invite',
  },
};

// Design Canvas Settings
export const CANVAS = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 1000,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 5,
  ZOOM_STEP: 0.1,
  GRID_SIZE: 20,
  SNAP_THRESHOLD: 10,
};

// Export Settings
export const EXPORT = {
  FORMATS: ['PNG', 'JPG', 'SVG', 'PDF'],
  DEFAULT_FORMAT: 'PNG',
  DEFAULT_QUALITY: 1.0,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// Measurement Units
export const UNITS = {
  METRIC: 'cm',
  IMPERIAL: 'in',
};

// Garment Categories
export const CATEGORIES = {
  SHIRTS: 'shirts',
  DRESSES: 'dresses',
  PANTS: 'pants',
  SKIRTS: 'skirts',
  JACKETS: 'jackets',
  ACCESSORIES: 'accessories',
};

// User Levels
export const USER_LEVELS = [
  { level: 1, name: 'Beginner', minDesigns: 0 },
  { level: 2, name: 'Apprentice', minDesigns: 5 },
  { level: 3, name: 'Designer', minDesigns: 15 },
  { level: 4, name: 'Professional', minDesigns: 30 },
  { level: 5, name: 'Master', minDesigns: 50 },
  { level: 6, name: 'Expert', minDesigns: 100 },
];

// Tutorial Steps
export const TUTORIAL_STEPS = [
  { id: 1, screen: 'Home', title: 'Welcome to FashionCraft', completed: false },
  { id: 2, screen: 'DesignStudio', title: 'Create Your First Design', completed: false },
  { id: 3, screen: 'Templates', title: 'Explore Templates', completed: false },
  { id: 4, screen: 'Measurements', title: 'Add Your Measurements', completed: false },
  { id: 5, screen: 'Export', title: 'Export Your Design', completed: false },
];

// Notifications
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Feature Flags
export const FEATURES = {
  ENABLE_AR: true,
  ENABLE_3D: true,
  ENABLE_AI_ASSISTANT: true,
  ENABLE_COLLABORATION: true,
  ENABLE_MARKETPLACE: false, // Coming soon
  ENABLE_SOCIAL: true,
  ENABLE_CLOUD_SYNC: false, // Coming soon
};

// Rate Limiting
export const RATE_LIMITS = {
  SAVE_DESIGN: 1000, // ms between saves
  API_CALL: 100, // ms between API calls
  EXPORT: 5000, // ms between exports
};

// Auto-save Settings
export const AUTO_SAVE = {
  ENABLED: true,
  INTERVAL: 30000, // 30 seconds
  MAX_VERSIONS: 10,
};
