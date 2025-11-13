import { Alert } from 'react-native';

/**
 * Error types
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  STORAGE: 'storage',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown',
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network error. Please check your internet connection.',
  [ERROR_TYPES.AUTH]: 'Authentication failed. Please login again.',
  [ERROR_TYPES.VALIDATION]: 'Invalid data. Please check your input.',
  [ERROR_TYPES.NOT_FOUND]: 'Resource not found.',
  [ERROR_TYPES.SERVER]: 'Server error. Please try again later.',
  [ERROR_TYPES.STORAGE]: 'Storage error. Unable to save data.',
  [ERROR_TYPES.PERMISSION]: 'Permission denied. Please grant necessary permissions.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred.',
};

/**
 * Custom Error class
 */
export class AppError extends Error {
  constructor(type, message, originalError = null) {
    super(message || ERROR_MESSAGES[type] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN]);
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date();
  }
}

/**
 * Error Handler Service
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
  }

  /**
   * Log error
   */
  logError(error) {
    const errorEntry = {
      timestamp: new Date(),
      type: error.type || ERROR_TYPES.UNKNOWN,
      message: error.message,
      stack: error.stack,
      originalError: error.originalError,
    };

    this.errorLog.push(errorEntry);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (__DEV__) {
      console.error('[ErrorHandler]', errorEntry);
    }

    // Send to analytics/monitoring service
    this.sendToMonitoring(errorEntry);
  }

  /**
   * Send error to monitoring service
   */
  sendToMonitoring(errorEntry) {
    // Implement your error monitoring service integration here
    // Example: Sentry, Firebase Crashlytics, etc.
    
    // For now, just log to console
    if (!__DEV__) {
      // In production, send to your monitoring service
      // Example: Sentry.captureException(errorEntry);
    }
  }

  /**
   * Handle error with user notification
   * @param {Error} error - The error to handle
   * @param {Object} options - Handling options
   * @param {Function} options.notificationStore - Optional notification store for displaying notifications
   */
  handleError(error, options = {}) {
    const {
      showAlert = true,
      showNotification = false,
      customMessage = null,
      onDismiss = null,
      notificationStore = null,
    } = options;

    this.logError(error);

    const message = customMessage || error.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];

    if (showAlert) {
      Alert.alert(
        'Error',
        message,
        [
          {
            text: 'OK',
            onPress: onDismiss,
          },
        ],
        { cancelable: false }
      );
    }

    if (showNotification && notificationStore) {
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    }
  }

  /**
   * Handle API error
   */
  handleApiError(error) {
    let errorType = ERROR_TYPES.UNKNOWN;
    let message = error.message;

    if (error.response) {
      // Server responded with error
      const status = error.response.status;

      if (status === 401 || status === 403) {
        errorType = ERROR_TYPES.AUTH;
      } else if (status === 404) {
        errorType = ERROR_TYPES.NOT_FOUND;
      } else if (status >= 400 && status < 500) {
        errorType = ERROR_TYPES.VALIDATION;
      } else if (status >= 500) {
        errorType = ERROR_TYPES.SERVER;
      }

      message = error.response.data?.message || ERROR_MESSAGES[errorType];
    } else if (error.request) {
      // Request made but no response
      errorType = ERROR_TYPES.NETWORK;
    }

    const appError = new AppError(errorType, message, error);
    this.handleError(appError);

    return appError;
  }

  /**
   * Handle storage error
   */
  handleStorageError(error, operation = 'save') {
    const message = `Failed to ${operation} data locally. Please try again.`;
    const appError = new AppError(ERROR_TYPES.STORAGE, message, error);
    this.handleError(appError);
    return appError;
  }

  /**
   * Handle validation error
   */
  handleValidationError(errors) {
    const errorMessages = Object.values(errors).flat();
    const message = errorMessages.join('\n');
    const appError = new AppError(ERROR_TYPES.VALIDATION, message);
    
    this.handleError(appError, {
      showAlert: true,
      showNotification: false,
    });

    return appError;
  }

  /**
   * Handle permission error
   */
  handlePermissionError(permission) {
    const message = `${permission} permission is required. Please grant it in settings.`;
    const appError = new AppError(ERROR_TYPES.PERMISSION, message);
    
    this.handleError(appError, {
      showAlert: true,
      showNotification: false,
    });

    return appError;
  }

  /**
   * Get error log
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Export error log
   */
  exportErrorLog() {
    return JSON.stringify(this.errorLog, null, 2);
  }

  /**
   * Retry failed operation with exponential backoff
   */
  async retryOperation(operationKey, operation, options = {}) {
    const {
      maxRetries = this.maxRetries,
      delayMs = 1000,
      exponentialBackoff = true,
    } = options;

    let attempts = this.retryAttempts.get(operationKey) || 0;

    while (attempts < maxRetries) {
      try {
        const result = await operation();
        this.retryAttempts.delete(operationKey);
        return { success: true, result };
      } catch (error) {
        attempts++;
        this.retryAttempts.set(operationKey, attempts);

        if (attempts >= maxRetries) {
          this.retryAttempts.delete(operationKey);
          this.logError(error);
          return { success: false, error };
        }

        // Wait before retry with exponential backoff
        const delay = exponentialBackoff ? delayMs * Math.pow(2, attempts - 1) : delayMs;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error) {
    if (!error) return false;

    const recoverableTypes = [
      ERROR_TYPES.NETWORK,
      ERROR_TYPES.SERVER,
    ];

    return recoverableTypes.includes(error.type);
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      recentErrors: this.errorLog.slice(-10),
    };

    this.errorLog.forEach(error => {
      const type = error.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

/**
 * Try-catch wrapper
 */
export const tryCatch = async (fn, errorHandler = null) => {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      errorHandler.handleError(error);
    }
    return null;
  }
};

/**
 * Async error wrapper for React components
 */
export const withAsyncErrorHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  };
};

export default errorHandler;
