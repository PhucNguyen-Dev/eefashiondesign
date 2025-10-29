/**
 * Logger Service
 * 
 * Centralized logging utility that:
 * - Disables console.log in production
 * - Adds timestamps and context
 * - Supports different log levels
 * - Can be extended to send logs to external services
 * 
 * Usage:
 *   import logger from './src/core/utils/logger';
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('API call failed', error);
 *   logger.debug('Debug info', data);
 */

import { Platform } from 'react-native';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Configuration
const CONFIG = {
  // Set minimum log level (logs below this level won't be shown)
  minLevel: __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR,
  
  // Enable/disable logging entirely
  enabled: true,
  
  // Show timestamps
  showTimestamp: true,
  
  // Show log level
  showLevel: true,
  
  // Show platform (web/ios/android)
  showPlatform: __DEV__,
  
  // Colors for different log levels (web only)
  colors: {
    DEBUG: '#6C5CE7',
    INFO: '#4A90E2',
    WARN: '#FFA500',
    ERROR: '#FF6B6B',
  },
};

/**
 * Format timestamp
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().split('T')[1].split('.')[0]; // HH:MM:SS
};

/**
 * Format log prefix
 */
const getPrefix = (level) => {
  const parts = [];
  
  if (CONFIG.showTimestamp) {
    parts.push(`[${getTimestamp()}]`);
  }
  
  if (CONFIG.showLevel) {
    parts.push(`[${level}]`);
  }
  
  if (CONFIG.showPlatform) {
    parts.push(`[${Platform.OS}]`);
  }
  
  return parts.join(' ');
};

/**
 * Format log message
 */
const formatMessage = (level, message, data) => {
  const prefix = getPrefix(level);
  
  if (data !== undefined) {
    return [prefix, message, data];
  }
  
  return [prefix, message];
};

/**
 * Log with color (web only)
 */
const logWithColor = (level, message, data) => {
  if (Platform.OS === 'web' && CONFIG.colors[level]) {
    const color = CONFIG.colors[level];
    const prefix = getPrefix(level);
    
    if (data !== undefined) {
      console.log(`%c${prefix}`, `color: ${color}; font-weight: bold`, message, data);
    } else {
      console.log(`%c${prefix}`, `color: ${color}; font-weight: bold`, message);
    }
  } else {
    const formatted = formatMessage(level, message, data);
    console.log(...formatted);
  }
};

/**
 * Logger class
 */
class Logger {
  /**
   * Debug level logging
   * Use for detailed debugging information
   */
  debug(message, data) {
    if (!CONFIG.enabled || CONFIG.minLevel > LOG_LEVELS.DEBUG) return;
    
    if (Platform.OS === 'web') {
      logWithColor('DEBUG', message, data);
    } else {
      const formatted = formatMessage('DEBUG', message, data);
      console.log(...formatted);
    }
  }

  /**
   * Info level logging
   * Use for general information
   */
  info(message, data) {
    if (!CONFIG.enabled || CONFIG.minLevel > LOG_LEVELS.INFO) return;
    
    if (Platform.OS === 'web') {
      logWithColor('INFO', message, data);
    } else {
      const formatted = formatMessage('INFO', message, data);
      console.log(...formatted);
    }
  }

  /**
   * Warning level logging
   * Use for warnings that don't break functionality
   */
  warn(message, data) {
    if (!CONFIG.enabled || CONFIG.minLevel > LOG_LEVELS.WARN) return;
    
    if (Platform.OS === 'web') {
      logWithColor('WARN', message, data);
    } else {
      const formatted = formatMessage('WARN', message, data);
      console.warn(...formatted);
    }
  }

  /**
   * Error level logging
   * Use for errors and exceptions
   */
  error(message, error) {
    if (!CONFIG.enabled || CONFIG.minLevel > LOG_LEVELS.ERROR) return;
    
    if (Platform.OS === 'web') {
      logWithColor('ERROR', message, error);
    } else {
      const formatted = formatMessage('ERROR', message, error);
      console.error(...formatted);
    }
    
    // In production, you could send errors to external service here
    // Example: Sentry.captureException(error);
  }

  /**
   * Group logs together (web only)
   */
  group(label) {
    if (!CONFIG.enabled || Platform.OS !== 'web') return;
    console.group(label);
  }

  /**
   * End log group (web only)
   */
  groupEnd() {
    if (!CONFIG.enabled || Platform.OS !== 'web') return;
    console.groupEnd();
  }

  /**
   * Log table (web only)
   */
  table(data) {
    if (!CONFIG.enabled || Platform.OS !== 'web') return;
    console.table(data);
  }

  /**
   * Time a function execution
   */
  time(label) {
    if (!CONFIG.enabled) return;
    console.time(label);
  }

  /**
   * End timing
   */
  timeEnd(label) {
    if (!CONFIG.enabled) return;
    console.timeEnd(label);
  }

  /**
   * Configure logger
   */
  configure(options) {
    Object.assign(CONFIG, options);
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...CONFIG };
  }

  /**
   * Enable logging
   */
  enable() {
    CONFIG.enabled = true;
  }

  /**
   * Disable logging
   */
  disable() {
    CONFIG.enabled = false;
  }

  /**
   * Set minimum log level
   */
  setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      CONFIG.minLevel = LOG_LEVELS[level];
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Export logger instance
export default logger;

// Export log levels for external use
export { LOG_LEVELS };

/**
 * Example Usage:
 * 
 * import logger from './src/core/utils/logger';
 * 
 * // Basic logging
 * logger.debug('Debug message');
 * logger.info('Info message');
 * logger.warn('Warning message');
 * logger.error('Error message', new Error('Something went wrong'));
 * 
 * // With data
 * logger.info('User logged in', { userId: 123, email: 'user@example.com' });
 * 
 * // Grouping (web only)
 * logger.group('API Calls');
 * logger.info('GET /users');
 * logger.info('POST /designs');
 * logger.groupEnd();
 * 
 * // Timing
 * logger.time('API Call');
 * await fetchData();
 * logger.timeEnd('API Call');
 * 
 * // Configuration
 * logger.configure({
 *   minLevel: LOG_LEVELS.WARN, // Only show warnings and errors
 *   showTimestamp: false,
 * });
 * 
 * // Disable in production
 * if (!__DEV__) {
 *   logger.setLevel('ERROR'); // Only show errors in production
 * }
 */

