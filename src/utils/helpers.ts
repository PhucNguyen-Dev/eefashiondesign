import { Dimensions, Platform } from 'react-native';
import { format, formatDistance } from 'date-fns';

/**
 * Responsive width calculation
 */
export const wp = (percentage: number): number => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

/**
 * Responsive height calculation
 */
export const hp = (percentage: number): number => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date
 */
export const formatDate = (date: Date | string | number, formatString: string = 'MMM dd, yyyy'): string => {
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> => {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: Parameters<T>): void {
    const later = (): void => {
      if (timeout) clearTimeout(timeout);
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ThrottledFunction<T> => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text
 */
export const truncate = (str: string, length: number = 50): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

/**
 * Convert hex to rgba
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Calculate color brightness
 */
export const getColorBrightness = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Check if color is light or dark
 */
export const isLightColor = (hex: string): boolean => {
  return getColorBrightness(hex) > 128;
};

/**
 * Get contrast color (black or white)
 */
export const getContrastColor = (hex: string): string => {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
};

/**
 * Random number between min and max
 */
export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffle array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Group array by key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
};

type SortOrder = 'asc' | 'desc';

/**
 * Sort array by key
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: SortOrder = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio < 1.6 && Math.min(width, height) >= 600;
};

/**
 * Platform-specific value
 */
export const platformValue = <T>(ios: T, android: T, web: T = android): T => {
  if (Platform.OS === 'ios') return ios;
  if (Platform.OS === 'android') return android;
  return web;
};

interface SafeAreaPadding {
  top: number;
  bottom: number;
}

/**
 * Safe area padding
 */
export const getSafeAreaPadding = (): SafeAreaPadding => {
  if (Platform.OS === 'ios') {
    return { top: 44, bottom: 34 };
  }
  return { top: 0, bottom: 0 };
};

/**
 * Clamp number between min and max
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Linear interpolation
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

/**
 * Map value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Calculate distance between two points
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Wait for specified milliseconds
 */
export const wait = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry async function
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await wait(delay);
    return retry(fn, retries - 1, delay);
  }
};

/**
 * Check if value is number
 */
export const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Parse query string
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

/**
 * Build query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSB {
  h: number;
  s: number;
  b: number;
}

/**
 * Convert HSB/HSV to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} b - Brightness/Value (0-1)
 * @returns {RGB} - {r, g, b} values (0-255)
 */
export const hsbToRgb = (h: number, s: number, b: number): RGB => {
  const c = b * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = b - c;
  let r: number, g: number, b2: number;

  if (h >= 0 && h < 60) {
    [r, g, b2] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b2] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b2] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b2] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b2] = [x, 0, c];
  } else {
    [r, g, b2] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b2 + m) * 255),
  };
};

/**
 * Convert RGB to Hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color string (#RRGGBB)
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Convert Hex to RGB
 * @param {string} hex - Hex color string (#RRGGBB or #RGB)
 * @returns {RGB} - {r, g, b} values (0-255)
 */
export const hexToRgb = (hex: string): RGB => {
  // Remove # if present
  let cleanHex = hex.replace('#', '');
  
  // Handle short hex format (#RGB)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return { r, g, b };
};

/**
 * Convert RGB to HSB/HSV
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {HSB} - {h, s, b} values (h: 0-360, s: 0-1, b: 0-1)
 */
export const rgbToHsb = (r: number, g: number, b: number): HSB => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) / 6;
    } else {
      h = ((rNorm - gNorm) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: s,
    b: v,
  };
};
