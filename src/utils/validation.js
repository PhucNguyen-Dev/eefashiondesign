/**
 * Input Validation Utilities
 * Provides validation functions for user inputs
 */

/**
 * Validate hex color format
 */
export const validateHexColor = (color) => {
  if (!color || typeof color !== 'string') {
    return { valid: false, error: 'Color must be a string' };
  }

  // Allow 3 or 6 digit hex colors with or without #
  const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
  if (!hexPattern.test(color)) {
    return { valid: false, error: 'Invalid hex color format. Use #RRGGBB or #RGB' };
  }

  return { valid: true };
};

/**
 * Normalize hex color to uppercase 6-digit format
 */
export const normalizeHexColor = (color) => {
  if (!color) return '#000000';
  
  // Remove # if present
  let hex = color.replace('#', '');
  
  // Convert 3-digit to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  return '#' + hex.toUpperCase();
};

/**
 * Validate design name
 */
export const validateDesignName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Design name is required' };
  }

  if (name.trim().length === 0) {
    return { valid: false, error: 'Design name cannot be empty' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Design name must be less than 100 characters' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Design name contains invalid characters' };
  }

  return { valid: true };
};

/**
 * Validate dimensions
 */
export const validateDimensions = (width, height) => {
  if (typeof width !== 'number' || typeof height !== 'number') {
    return { valid: false, error: 'Dimensions must be numbers' };
  }

  if (width <= 0 || height <= 0) {
    return { valid: false, error: 'Dimensions must be positive' };
  }

  if (width > 10000 || height > 10000) {
    return { valid: false, error: 'Dimensions too large (max 10000px)' };
  }

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return { valid: false, error: 'Dimensions must be finite numbers' };
  }

  return { valid: true };
};

/**
 * Validate stroke width
 */
export const validateStrokeWidth = (width) => {
  if (typeof width !== 'number') {
    return { valid: false, error: 'Stroke width must be a number' };
  }

  if (width < 0.5 || width > 100) {
    return { valid: false, error: 'Stroke width must be between 0.5 and 100' };
  }

  return { valid: true };
};

/**
 * Validate opacity
 */
export const validateOpacity = (opacity) => {
  if (typeof opacity !== 'number') {
    return { valid: false, error: 'Opacity must be a number' };
  }

  if (opacity < 0 || opacity > 1) {
    return { valid: false, error: 'Opacity must be between 0 and 1' };
  }

  return { valid: true };
};

/**
 * Validate rotation angle
 */
export const validateRotation = (angle) => {
  if (typeof angle !== 'number') {
    return { valid: false, error: 'Rotation angle must be a number' };
  }

  if (!Number.isFinite(angle)) {
    return { valid: false, error: 'Rotation angle must be a finite number' };
  }

  return { valid: true };
};

/**
 * Validate scale
 */
export const validateScale = (scale) => {
  if (typeof scale !== 'number') {
    return { valid: false, error: 'Scale must be a number' };
  }

  if (scale <= 0) {
    return { valid: false, error: 'Scale must be positive' };
  }

  if (scale > 10) {
    return { valid: false, error: 'Scale too large (max 10x)' };
  }

  return { valid: true };
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
};

/**
 * Sanitize text input (remove potentially harmful content)
 */
export const sanitizeTextInput = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove control characters except newlines and tabs
  return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Validate array of coordinates/points
 */
export const validatePoints = (points) => {
  if (!Array.isArray(points)) {
    return { valid: false, error: 'Points must be an array' };
  }

  if (points.length === 0) {
    return { valid: false, error: 'Points array cannot be empty' };
  }

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
      return { valid: false, error: `Invalid point at index ${i}` };
    }

    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      return { valid: false, error: `Point at index ${i} contains invalid coordinates` };
    }
  }

  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (sizeInBytes, maxSizeInMB = 10) => {
  if (typeof sizeInBytes !== 'number' || sizeInBytes < 0) {
    return { valid: false, error: 'Invalid file size' };
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (sizeInBytes > maxSizeInBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeInMB}MB limit` };
  }

  return { valid: true };
};

/**
 * Validate image format
 */
export const validateImageFormat = (format) => {
  const validFormats = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  
  if (!format || typeof format !== 'string') {
    return { valid: false, error: 'Format is required' };
  }

  const normalizedFormat = format.toLowerCase().replace('.', '');
  
  if (!validFormats.includes(normalizedFormat)) {
    return { valid: false, error: `Invalid format. Supported: ${validFormats.join(', ')}` };
  }

  return { valid: true, format: normalizedFormat };
};

/**
 * Safe JSON parse with error handling
 */
export const safeJSONParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (__DEV__) {
      console.warn('[Validation] Failed to parse JSON:', error);
    }
    return defaultValue;
  }
};

/**
 * Validate and clamp numeric value within range
 */
export const clampValue = (value, min, max) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
};

export default {
  validateHexColor,
  normalizeHexColor,
  validateDesignName,
  validateDimensions,
  validateStrokeWidth,
  validateOpacity,
  validateRotation,
  validateScale,
  validateEmail,
  validateURL,
  sanitizeTextInput,
  validatePoints,
  validateFileSize,
  validateImageFormat,
  safeJSONParse,
  clampValue,
};
