/**
 * Platform Detection Utilities
 * Provides cross-platform compatibility helpers
 */

import { Platform, Dimensions } from 'react-native';

/**
 * Platform detection
 */
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;
export const isNative = !isWeb;

/**
 * Device type detection
 */
export const getDeviceType = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;

  if (isWeb) {
    // Web: Use window dimensions
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  // Native: Use screen dimensions and aspect ratio
  if (width >= 768) return 'tablet';
  return 'mobile';
};

export const isDesktop = () => getDeviceType() === 'desktop';
export const isTablet = () => getDeviceType() === 'tablet';
export const isMobileDevice = () => getDeviceType() === 'mobile';

/**
 * Feature detection
 */
export const supports3D = () => {
  // 3D features only available on web/desktop
  return isWeb && isDesktop();
};

export const supportsWebGL = () => {
  if (!isWeb) return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

export const supportsWebGL2 = () => {
  if (!isWeb) return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch (e) {
    return false;
  }
};

export const supportsCamera = () => {
  if (isNative) return true; // Native always supports camera
  
  if (isWeb) {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }
  
  return false;
};

export const supportsHaptics = () => {
  return isNative; // Haptics only on native
};

/**
 * Performance detection
 */
export const getPerformanceTier = () => {
  if (isNative) return 'high'; // Assume native is high performance
  
  if (isWeb) {
    // Simple heuristic based on hardware concurrency
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 4;
    
    if (cores >= 8 && memory >= 8) return 'high';
    if (cores >= 4 && memory >= 4) return 'medium';
    return 'low';
  }
  
  return 'medium';
};

export const isHighPerformance = () => getPerformanceTier() === 'high';
export const isMediumPerformance = () => getPerformanceTier() === 'medium';
export const isLowPerformance = () => getPerformanceTier() === 'low';

/**
 * Screen size utilities
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

export const getScreenWidth = () => {
  return Dimensions.get('window').width;
};

export const getScreenHeight = () => {
  return Dimensions.get('window').height;
};

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export const isBreakpoint = (breakpoint) => {
  const width = getScreenWidth();
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Platform-specific values
 */
export const platformSelect = (values) => {
  return Platform.select(values);
};

/**
 * Get platform-specific component
 * Automatically loads .web.js or .native.js based on platform
 */
export const getPlatformComponent = (componentName) => {
  // React Native's Metro bundler handles this automatically
  // Just import the component without extension
  return componentName;
};

/**
 * Check if feature is available on current platform
 */
export const isFeatureAvailable = (feature) => {
  const featureMap = {
    '3d': supports3D(),
    'webgl': supportsWebGL(),
    'webgl2': supportsWebGL2(),
    'camera': supportsCamera(),
    'haptics': supportsHaptics(),
    'ar': isNative,
    'collaboration': true, // Available on all platforms
    'export': true, // Available on all platforms
  };
  
  return featureMap[feature] ?? false;
};

/**
 * Get platform info for debugging
 */
export const getPlatformInfo = () => {
  return {
    os: Platform.OS,
    version: Platform.Version,
    deviceType: getDeviceType(),
    performanceTier: getPerformanceTier(),
    supports3D: supports3D(),
    supportsWebGL: supportsWebGL(),
    supportsWebGL2: supportsWebGL2(),
    supportsCamera: supportsCamera(),
    supportsHaptics: supportsHaptics(),
    screenWidth: getScreenWidth(),
    screenHeight: getScreenHeight(),
  };
};

/**
 * Log platform info (development only)
 */
export const logPlatformInfo = () => {
  if (__DEV__) {
    console.log('=== Platform Info ===');
    console.log(getPlatformInfo());
    console.log('====================');
  }
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  isNative,
  isDesktop,
  isTablet,
  isMobileDevice,
  supports3D,
  supportsWebGL,
  supportsWebGL2,
  supportsCamera,
  supportsHaptics,
  getDeviceType,
  getPerformanceTier,
  isHighPerformance,
  isMediumPerformance,
  isLowPerformance,
  getScreenDimensions,
  getScreenWidth,
  getScreenHeight,
  BREAKPOINTS,
  isBreakpoint,
  platformSelect,
  getPlatformComponent,
  isFeatureAvailable,
  getPlatformInfo,
  logPlatformInfo,
};

