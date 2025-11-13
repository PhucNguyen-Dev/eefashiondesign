/**
 * GL Capability Guard
 * Checks if device supports WebGL and prevents crashes on unsupported devices
 */

import { Platform } from 'react-native';

export interface GLCapabilities {
  isSupported: boolean;
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  vendor: string | null;
  renderer: string | null;
}

let cachedCapabilities: GLCapabilities | null = null;

/**
 * Check WebGL support using GL View test
 */
export const checkGLCapabilities = async (): Promise<GLCapabilities> => {
  if (cachedCapabilities) {
    return cachedCapabilities;
  }

  try {
    // On native platforms, assume GL support
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      cachedCapabilities = {
        isSupported: true,
        hasWebGL: true,
        hasWebGL2: true,
        maxTextureSize: 4096,
        vendor: Platform.OS,
        renderer: 'Native OpenGL ES',
      };
      return cachedCapabilities;
    }

    // Web platform - test canvas WebGL
    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        cachedCapabilities = {
          isSupported: false,
          hasWebGL: false,
          hasWebGL2: false,
          maxTextureSize: 0,
          vendor: null,
          renderer: null,
        };
        return cachedCapabilities;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      
      cachedCapabilities = {
        isSupported: true,
        hasWebGL: true,
        hasWebGL2: !!canvas.getContext('webgl2'),
        maxTextureSize,
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
      };
      
      // Cleanup
      canvas.remove();
      
      return cachedCapabilities;
    }

    // Unknown platform
    cachedCapabilities = {
      isSupported: false,
      hasWebGL: false,
      hasWebGL2: false,
      maxTextureSize: 0,
      vendor: null,
      renderer: null,
    };
    
    return cachedCapabilities;
  } catch (error) {
    console.warn('GL capability check failed:', error);
    
    cachedCapabilities = {
      isSupported: false,
      hasWebGL: false,
      hasWebGL2: false,
      maxTextureSize: 0,
      vendor: null,
      renderer: null,
    };
    
    return cachedCapabilities;
  }
};

/**
 * Get cached GL capabilities (must call checkGLCapabilities first)
 */
export const getGLCapabilities = (): GLCapabilities | null => {
  return cachedCapabilities;
};

/**
 * Check if device supports 3D rendering
 */
export const supports3D = async (): Promise<boolean> => {
  const capabilities = await checkGLCapabilities();
  return capabilities.isSupported && capabilities.hasWebGL;
};

/**
 * Check if device supports AR features
 */
export const supportsAR = async (): Promise<boolean> => {
  // AR requires native iOS/Android
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  
  const capabilities = await checkGLCapabilities();
  return capabilities.isSupported;
};

/**
 * Get recommended 3D quality settings based on device
 */
export const get3DQualitySettings = async () => {
  const capabilities = await checkGLCapabilities();
  
  if (!capabilities.isSupported) {
    return {
      enabled: false,
      shadows: false,
      antialiasing: false,
      pixelRatio: 1,
      maxLights: 0,
    };
  }
  
  // High-end device (large texture support)
  if (capabilities.maxTextureSize >= 4096) {
    return {
      enabled: true,
      shadows: true,
      antialiasing: true,
      pixelRatio: Platform.OS === 'web' ? window.devicePixelRatio || 1 : 2,
      maxLights: 4,
    };
  }
  
  // Mid-range device
  if (capabilities.maxTextureSize >= 2048) {
    return {
      enabled: true,
      shadows: false,
      antialiasing: true,
      pixelRatio: 1,
      maxLights: 2,
    };
  }
  
  // Low-end device
  return {
    enabled: true,
    shadows: false,
    antialiasing: false,
    pixelRatio: 1,
    maxLights: 1,
  };
};

/**
 * Reset cached capabilities (for testing)
 */
export const resetGLCapabilities = () => {
  cachedCapabilities = null;
};
