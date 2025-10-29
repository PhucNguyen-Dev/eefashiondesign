import React from 'react';
import { InteractionManager, PerformanceObserver } from 'react-native';

/**
 * Performance Monitoring Service
 */
class PerformanceService {
  constructor() {
    this.metrics = {
      screenTransitions: {},
      apiCalls: {},
      renders: {},
      memory: [],
    };
    this.marks = new Map();
    this.measures = [];
  }

  /**
   * Mark start of a performance measurement
   */
  mark(name) {
    const timestamp = Date.now();
    this.marks.set(name, timestamp);
    
    if (__DEV__) {
      console.log(`[Performance] Mark: ${name} at ${timestamp}`);
    }
  }

  /**
   * Measure time between two marks
   */
  measure(name, startMark, endMark) {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : Date.now();

    if (!startTime) {
      console.warn(`[Performance] Start mark "${startMark}" not found`);
      return null;
    }

    const duration = endTime - startTime;
    const measure = {
      name,
      duration,
      startTime,
      endTime,
      timestamp: new Date().toISOString(),
    };

    this.measures.push(measure);

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration}ms`);
    }

    return measure;
  }

  /**
   * Track screen transition time
   */
  trackScreenTransition(screenName, startMark) {
    const duration = this.measure(`screen_${screenName}`, startMark).duration;

    if (!this.metrics.screenTransitions[screenName]) {
      this.metrics.screenTransitions[screenName] = {
        count: 0,
        total: 0,
        average: 0,
        min: Infinity,
        max: 0,
      };
    }

    const metrics = this.metrics.screenTransitions[screenName];
    metrics.count++;
    metrics.total += duration;
    metrics.average = metrics.total / metrics.count;
    metrics.min = Math.min(metrics.min, duration);
    metrics.max = Math.max(metrics.max, duration);

    // Warn if screen transition is slow
    if (duration > 1000 && __DEV__) {
      console.warn(`[Performance] Slow screen transition: ${screenName} (${duration}ms)`);
    }

    return metrics;
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint, duration, success = true) {
    if (!this.metrics.apiCalls[endpoint]) {
      this.metrics.apiCalls[endpoint] = {
        count: 0,
        successCount: 0,
        failCount: 0,
        total: 0,
        average: 0,
        min: Infinity,
        max: 0,
      };
    }

    const metrics = this.metrics.apiCalls[endpoint];
    metrics.count++;
    if (success) {
      metrics.successCount++;
    } else {
      metrics.failCount++;
    }
    metrics.total += duration;
    metrics.average = metrics.total / metrics.count;
    metrics.min = Math.min(metrics.min, duration);
    metrics.max = Math.max(metrics.max, duration);

    // Warn if API call is slow
    if (duration > 3000 && __DEV__) {
      console.warn(`[Performance] Slow API call: ${endpoint} (${duration}ms)`);
    }

    return metrics;
  }

  /**
   * Track component render time
   */
  trackRender(componentName, renderTime) {
    if (!this.metrics.renders[componentName]) {
      this.metrics.renders[componentName] = {
        count: 0,
        total: 0,
        average: 0,
        min: Infinity,
        max: 0,
      };
    }

    const metrics = this.metrics.renders[componentName];
    metrics.count++;
    metrics.total += renderTime;
    metrics.average = metrics.total / metrics.count;
    metrics.min = Math.min(metrics.min, renderTime);
    metrics.max = Math.max(metrics.max, renderTime);

    // Warn if render is slow
    if (renderTime > 100 && __DEV__) {
      console.warn(`[Performance] Slow render: ${componentName} (${renderTime}ms)`);
    }

    return metrics;
  }

  /**
   * Measure interaction delay
   */
  async measureInteractionDelay(callback) {
    const startTime = Date.now();
    
    await new Promise((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        resolve();
      });
    });

    const delay = Date.now() - startTime;

    if (delay > 100 && __DEV__) {
      console.warn(`[Performance] High interaction delay: ${delay}ms`);
    }

    if (callback) {
      callback();
    }

    return delay;
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      measures: this.measures,
    };
  }

  /**
   * Get metrics for specific category
   */
  getCategoryMetrics(category) {
    return this.metrics[category] || {};
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const summary = {
      screenTransitions: {
        totalScreens: Object.keys(this.metrics.screenTransitions).length,
        averageTransitionTime: 0,
        slowestScreen: null,
      },
      apiCalls: {
        totalCalls: 0,
        successRate: 0,
        averageResponseTime: 0,
      },
      renders: {
        totalComponents: Object.keys(this.metrics.renders).length,
        averageRenderTime: 0,
        slowestComponent: null,
      },
    };

    // Screen transitions summary
    const screens = Object.entries(this.metrics.screenTransitions);
    if (screens.length > 0) {
      const totalAverage = screens.reduce((sum, [_, m]) => sum + m.average, 0);
      summary.screenTransitions.averageTransitionTime = totalAverage / screens.length;
      
      const slowest = screens.reduce((max, [name, m]) => 
        m.average > (max?.average || 0) ? { name, ...m } : max
      , null);
      summary.screenTransitions.slowestScreen = slowest;
    }

    // API calls summary
    const apiCalls = Object.values(this.metrics.apiCalls);
    if (apiCalls.length > 0) {
      summary.apiCalls.totalCalls = apiCalls.reduce((sum, m) => sum + m.count, 0);
      const totalSuccess = apiCalls.reduce((sum, m) => sum + m.successCount, 0);
      summary.apiCalls.successRate = (totalSuccess / summary.apiCalls.totalCalls) * 100;
      
      const totalAverage = apiCalls.reduce((sum, m) => sum + m.average, 0);
      summary.apiCalls.averageResponseTime = totalAverage / apiCalls.length;
    }

    // Renders summary
    const renders = Object.entries(this.metrics.renders);
    if (renders.length > 0) {
      const totalAverage = renders.reduce((sum, [_, m]) => sum + m.average, 0);
      summary.renders.averageRenderTime = totalAverage / renders.length;
      
      const slowest = renders.reduce((max, [name, m]) => 
        m.average > (max?.average || 0) ? { name, ...m } : max
      , null);
      summary.renders.slowestComponent = slowest;
    }

    return summary;
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      summary: this.getSummary(),
    }, null, 2);
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      screenTransitions: {},
      apiCalls: {},
      renders: {},
      memory: [],
    };
    this.marks.clear();
    this.measures = [];

    if (__DEV__) {
      console.log('[Performance] Metrics reset');
    }
  }

  /**
   * Log performance report
   */
  logReport() {
    if (!__DEV__) return;

    console.group('📊 Performance Report');
    console.log('Summary:', this.getSummary());
    console.log('Screen Transitions:', this.metrics.screenTransitions);
    console.log('API Calls:', this.metrics.apiCalls);
    console.log('Component Renders:', this.metrics.renders);
    console.log('Recent Measures:', this.measures.slice(-10));
    console.groupEnd();
  }

  /**
   * Watch for performance issues
   */
  startMonitoring() {
    if (!__DEV__) return;

    // Log report every 60 seconds in development
    this.monitoringInterval = setInterval(() => {
      this.logReport();
    }, 60000);

    console.log('[Performance] Monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('[Performance] Monitoring stopped');
    }
  }
}

// Create singleton instance
const performanceService = new PerformanceService();

// Auto-start monitoring in development
if (__DEV__) {
  performanceService.startMonitoring();
}

export default performanceService;

/**
 * HOC to track component render performance
 */
export const withPerformanceTracking = (Component, componentName) => {
  return (props) => {
    const startTime = Date.now();

    React.useEffect(() => {
      const renderTime = Date.now() - startTime;
      performanceService.trackRender(componentName || Component.name, renderTime);
    });

    return <Component {...props} />;
  };
};

/**
 * Hook to measure performance
 */
export const usePerformance = (name) => {
  React.useEffect(() => {
    performanceService.mark(`${name}_start`);

    return () => {
      performanceService.measure(name, `${name}_start`);
    };
  }, [name]);
};
