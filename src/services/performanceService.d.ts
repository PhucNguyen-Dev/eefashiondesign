/**
 * Type definitions for performanceService
 */

export interface PerformanceMark {
  name: string;
  timestamp: number;
}

export interface PerformanceMeasure {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  timestamp: string;
}

export interface MetricStats {
  count: number;
  total: number;
  average: number;
  min: number;
  max: number;
}

export interface ApiCallMetrics extends MetricStats {
  successCount: number;
  failCount: number;
}

export interface PerformanceMetrics {
  screenTransitions: Record<string, MetricStats>;
  apiCalls: Record<string, ApiCallMetrics>;
  renders: Record<string, MetricStats>;
  memory: MemoryMetric[];
}

export interface MemoryMetric {
  timestamp: string;
  used: number;
  total: number;
  percentage: number;
}

export interface PerformanceReport {
  summary: {
    totalMeasures: number;
    totalScreenTransitions: number;
    totalApiCalls: number;
    totalRenders: number;
    averageScreenTransition: number;
    averageApiCall: number;
    averageRender: number;
  };
  slowScreens: Array<{
    name: string;
    duration: number;
  }>;
  slowApiCalls: Array<{
    endpoint: string;
    duration: number;
  }>;
  slowRenders: Array<{
    component: string;
    duration: number;
  }>;
  memoryUsage: {
    current: number;
    peak: number;
    average: number;
  };
}

declare class PerformanceService {
  metrics: PerformanceMetrics;
  marks: Map<string, number>;
  measures: PerformanceMeasure[];

  /**
   * Mark start of a performance measurement
   */
  mark(name: string): void;

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): PerformanceMeasure | null;

  /**
   * Track screen transition time
   */
  trackScreenTransition(screenName: string, startMark: string): MetricStats;

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, duration: number, success?: boolean): ApiCallMetrics;

  /**
   * Track component render time
   */
  trackRender(componentName: string, renderTime: number): MetricStats;

  /**
   * Track memory usage
   */
  trackMemory(): Promise<void>;

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics;

  /**
   * Get performance report
   */
  getReport(): PerformanceReport;

  /**
   * Clear all metrics
   */
  clearMetrics(): void;

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string;

  /**
   * Track interaction start
   */
  startInteraction(name: string): void;

  /**
   * Track interaction end
   */
  endInteraction(name: string): void;

  /**
   * Measure async operation
   */
  measureAsync<T>(name: string, operation: () => Promise<T>): Promise<T>;

  /**
   * Log slow operations
   */
  logSlowOperations(threshold?: number): void;
}

declare const performanceService: PerformanceService;
export default performanceService;
