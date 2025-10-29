/**
 * Performance Utilities
 * Tools for monitoring and optimizing performance
 */

import { Platform } from 'react-native';

/**
 * Performance Monitor
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = __DEV__;
  }

  /**
   * Start timing a task
   */
  start(label) {
    if (!this.enabled) return;
    
    this.metrics.set(label, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    });
  }

  /**
   * End timing a task
   */
  end(label) {
    if (!this.enabled) return;
    
    const metric = this.metrics.get(label);
    if (!metric) {
      console.warn(`Performance metric "${label}" not found`);
      return;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    if (__DEV__) {
      console.log(`⏱️ ${label}: ${metric.duration.toFixed(2)}ms`);
    }

    return metric.duration;
  }

  /**
   * Get metric
   */
  get(label) {
    return this.metrics.get(label);
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear();
  }

  /**
   * Get all metrics
   */
  getAll() {
    return Array.from(this.metrics.entries()).map(([label, metric]) => ({
      label,
      ...metric,
    }));
  }

  /**
   * Log all metrics
   */
  logAll() {
    if (!this.enabled) return;

    console.log('=== Performance Metrics ===');
    this.getAll().forEach(({ label, duration }) => {
      if (duration !== null) {
        console.log(`${label}: ${duration.toFixed(2)}ms`);
      }
    });
    console.log('==========================');
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure function execution time
 */
export const measurePerformance = async (label, fn) => {
  performanceMonitor.start(label);
  const result = await fn();
  performanceMonitor.end(label);
  return result;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request Animation Frame wrapper
 */
export const raf = (callback) => {
  if (Platform.OS === 'web') {
    return requestAnimationFrame(callback);
  }
  // Fallback for native
  return setTimeout(callback, 16); // ~60fps
};

/**
 * Cancel Animation Frame wrapper
 */
export const cancelRaf = (id) => {
  if (Platform.OS === 'web') {
    return cancelAnimationFrame(id);
  }
  return clearTimeout(id);
};

/**
 * Batch updates
 */
export const batchUpdates = (updates) => {
  raf(() => {
    updates.forEach((update) => update());
  });
};

/**
 * Memory usage (web only)
 */
export const getMemoryUsage = () => {
  if (Platform.OS !== 'web' || !performance.memory) {
    return null;
  }

  return {
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    usedPercentage: (
      (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) *
      100
    ).toFixed(2),
  };
};

/**
 * Log memory usage
 */
export const logMemoryUsage = () => {
  const memory = getMemoryUsage();
  if (memory && __DEV__) {
    console.log('=== Memory Usage ===');
    console.log(`Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`);
    console.log(`Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    console.log(`Usage: ${memory.usedPercentage}%`);
    console.log('===================');
  }
};

/**
 * FPS Counter
 */
class FPSCounter {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.enabled = false;
  }

  start() {
    this.enabled = true;
    this.tick();
  }

  stop() {
    this.enabled = false;
  }

  tick = () => {
    if (!this.enabled) return;

    this.frames++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frames = 0;
      this.lastTime = currentTime;
    }

    raf(this.tick);
  };

  getFPS() {
    return this.fps;
  }
}

export const fpsCounter = new FPSCounter();

/**
 * Optimize image loading
 */
export const optimizeImage = (url, options = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;

  // If CDN supports image optimization, add query params
  const params = new URLSearchParams();
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  params.append('q', quality);
  params.append('f', format);

  return `${url}?${params.toString()}`;
};

/**
 * Lazy load component
 */
export const lazyLoad = (importFunc, fallback = null) => {
  return {
    Component: React.lazy(importFunc),
    fallback,
  };
};

/**
 * Check if device is low-end
 */
export const isLowEndDevice = () => {
  if (Platform.OS !== 'web') return false;

  const cores = navigator.hardwareConcurrency || 2;
  const memory = navigator.deviceMemory || 4;

  return cores < 4 || memory < 4;
};

/**
 * Get optimal settings based on device
 */
export const getOptimalSettings = () => {
  const isLowEnd = isLowEndDevice();

  return {
    shadows: !isLowEnd,
    antialiasing: !isLowEnd,
    postProcessing: !isLowEnd,
    maxTextureSize: isLowEnd ? 1024 : 2048,
    maxPolygons: isLowEnd ? 25000 : 50000,
    pixelRatio: isLowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2),
  };
};

/**
 * Asset preloader
 */
export class AssetPreloader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  async preload(url, type = 'image') {
    // Check cache
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Check if already loading
    if (this.loading.has(url)) {
      return this.loading.get(url);
    }

    // Start loading
    const promise = this.load(url, type);
    this.loading.set(url, promise);

    try {
      const asset = await promise;
      this.cache.set(url, asset);
      this.loading.delete(url);
      return asset;
    } catch (error) {
      this.loading.delete(url);
      throw error;
    }
  }

  async load(url, type) {
    switch (type) {
      case 'image':
        return this.loadImage(url);
      case 'model':
        return this.loadModel(url);
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  async loadModel(url) {
    // Placeholder for 3D model loading
    // Will be implemented with Three.js GLTFLoader
    console.log(`Loading model: ${url}`);
    return { url };
  }

  clear() {
    this.cache.clear();
    this.loading.clear();
  }

  getCache() {
    return this.cache;
  }
}

export const assetPreloader = new AssetPreloader();

export default {
  performanceMonitor,
  measurePerformance,
  debounce,
  throttle,
  raf,
  cancelRaf,
  batchUpdates,
  getMemoryUsage,
  logMemoryUsage,
  fpsCounter,
  optimizeImage,
  lazyLoad,
  isLowEndDevice,
  getOptimalSettings,
  assetPreloader,
  AssetPreloader,
};

