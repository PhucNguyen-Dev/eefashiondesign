/**
 * Type definitions for errorHandler
 */

export const ERROR_TYPES: {
  readonly NETWORK: 'network';
  readonly AUTH: 'auth';
  readonly VALIDATION: 'validation';
  readonly NOT_FOUND: 'not_found';
  readonly SERVER: 'server';
  readonly STORAGE: 'storage';
  readonly PERMISSION: 'permission';
  readonly UNKNOWN: 'unknown';
};

export type ErrorType = 
  | 'network' 
  | 'auth' 
  | 'validation' 
  | 'not_found' 
  | 'server' 
  | 'storage' 
  | 'permission' 
  | 'unknown';

export interface ErrorLogEntry {
  timestamp: Date;
  type: ErrorType;
  message: string;
  stack?: string;
  originalError?: any;
}

export interface ErrorHandlerOptions {
  showAlert?: boolean;
  showNotification?: boolean;
  customMessage?: string | null;
  onDismiss?: (() => void) | null;
}

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

export class AppError extends Error {
  type: ErrorType;
  originalError: any;
  timestamp: Date;

  constructor(type: ErrorType, message?: string, originalError?: any);
}

declare class ErrorHandler {
  errorLog: ErrorLogEntry[];
  maxLogSize: number;
  retryAttempts: Map<string, number>;
  maxRetries: number;

  /**
   * Log error
   */
  logError(error: Error | AppError): void;

  /**
   * Send error to monitoring service
   */
  sendToMonitoring(errorEntry: ErrorLogEntry): void;

  /**
   * Handle error with user notification
   */
  handleError(error: Error | AppError, options?: ErrorHandlerOptions): void;

  /**
   * Handle API error
   */
  handleApiError(error: any): void;

  /**
   * Handle network error
   */
  handleNetworkError(error: any): void;

  /**
   * Handle validation error
   */
  handleValidationError(errors: Record<string, string>): void;

  /**
   * Retry failed operation
   */
  retry<T>(
    operation: () => Promise<T>,
    key: string,
    options?: RetryOptions
  ): Promise<T>;

  /**
   * Clear error log
   */
  clearErrorLog(): void;

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    recent: ErrorLogEntry[];
  };

  /**
   * Export error log
   */
  exportErrorLog(): string;
}

declare const errorHandler: ErrorHandler;
export default errorHandler;
