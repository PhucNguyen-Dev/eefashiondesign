/**
 * Three.js Lazy Loader
 * Safely loads Three.js only when needed and device supports it
 */

import { supports3D, get3DQualitySettings } from '../guards/GLCapabilityGuard.js';

type ThreeModule = typeof import('three');
type FiberModule = typeof import('@react-three/fiber');

let threeModule: ThreeModule | null = null;
let fiberModule: FiberModule | null = null;
let loadingPromise: Promise<{ three: ThreeModule; fiber: FiberModule }> | null = null;

export interface ThreeLoaderResult {
  three: ThreeModule;
  fiber: FiberModule;
  qualitySettings: Awaited<ReturnType<typeof get3DQualitySettings>>;
}

/**
 * Load Three.js and React Three Fiber with capability check
 */
export const loadThree = async (): Promise<ThreeLoaderResult | null> => {
  // Check if device supports 3D
  const is3DSupported = await supports3D();
  
  if (!is3DSupported) {
    console.warn('3D rendering not supported on this device');
    return null;
  }
  
  // Return cached modules if already loaded
  if (threeModule && fiberModule) {
    const qualitySettings = await get3DQualitySettings();
    return {
      three: threeModule,
      fiber: fiberModule,
      qualitySettings,
    };
  }
  
  // Return existing loading promise if already loading
  if (loadingPromise) {
    const modules = await loadingPromise;
    const qualitySettings = await get3DQualitySettings();
    return {
      ...modules,
      qualitySettings,
    };
  }
  
  // Start loading
  console.log('Loading Three.js modules...');
  
  loadingPromise = Promise.all([
    import('three'),
    import('@react-three/fiber'),
  ]).then(([three, fiber]) => {
    threeModule = three;
    fiberModule = fiber;
    console.log('Three.js modules loaded successfully');
    return { three, fiber };
  }).catch((error) => {
    console.error('Failed to load Three.js modules:', error);
    loadingPromise = null;
    throw error;
  });
  
  const modules = await loadingPromise;
  const qualitySettings = await get3DQualitySettings();
  
  return {
    ...modules,
    qualitySettings,
  };
};

/**
 * Preload Three.js modules in background
 */
export const preloadThree = async (): Promise<boolean> => {
  try {
    const result = await loadThree();
    return result !== null;
  } catch (error) {
    console.error('Failed to preload Three.js:', error);
    return false;
  }
};

/**
 * Check if Three.js is loaded
 */
export const isThreeLoaded = (): boolean => {
  return threeModule !== null && fiberModule !== null;
};

/**
 * Get loaded Three.js module (throws if not loaded)
 */
export const getThree = (): ThreeModule => {
  if (!threeModule) {
    throw new Error('Three.js not loaded. Call loadThree() first.');
  }
  return threeModule;
};

/**
 * Get loaded React Three Fiber module (throws if not loaded)
 */
export const getFiber = (): FiberModule => {
  if (!fiberModule) {
    throw new Error('React Three Fiber not loaded. Call loadThree() first.');
  }
  return fiberModule;
};

/**
 * Reset loader state (for testing)
 */
export const resetThreeLoader = () => {
  threeModule = null;
  fiberModule = null;
  loadingPromise = null;
};
