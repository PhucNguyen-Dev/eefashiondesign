import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Color History Service
 * Manages recently used colors with persistence
 */
class ColorHistoryService {
  constructor() {
    this.STORAGE_KEY = `${STORAGE_KEYS.SETTINGS}_color_history`;
    this.MAX_COLORS = 20; // Keep last 20 colors
    this.colors = [];
    this.initialized = false;
  }

  /**
   * Initialize and load color history from storage
   */
  async init() {
    if (this.initialized) return;

    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.colors = JSON.parse(stored);
      }
      this.initialized = true;
    } catch (error) {
      if (__DEV__) {
        console.error('[ColorHistory] Failed to load history:', error);
      }
      this.colors = [];
      this.initialized = true;
    }
  }

  /**
   * Add a color to history
   */
  async addColor(color) {
    await this.init();

    // Validate color format (basic hex validation)
    if (!color || typeof color !== 'string' || !color.match(/^#[0-9A-Fa-f]{6}$/)) {
      if (__DEV__) {
        console.warn('[ColorHistory] Invalid color format:', color);
      }
      return;
    }

    // Normalize to uppercase
    const normalizedColor = color.toUpperCase();

    // Remove if already exists
    this.colors = this.colors.filter((c) => c !== normalizedColor);

    // Add to beginning
    this.colors.unshift(normalizedColor);

    // Keep only MAX_COLORS
    if (this.colors.length > this.MAX_COLORS) {
      this.colors = this.colors.slice(0, this.MAX_COLORS);
    }

    // Save to storage
    await this.save();
  }

  /**
   * Get color history
   */
  async getColors(limit = null) {
    await this.init();
    return limit ? this.colors.slice(0, limit) : [...this.colors];
  }

  /**
   * Get recent colors (last N colors)
   */
  async getRecentColors(count = 5) {
    return this.getColors(count);
  }

  /**
   * Remove a color from history
   */
  async removeColor(color) {
    await this.init();
    const normalizedColor = color.toUpperCase();
    this.colors = this.colors.filter((c) => c !== normalizedColor);
    await this.save();
  }

  /**
   * Clear all color history
   */
  async clear() {
    this.colors = [];
    await this.save();
  }

  /**
   * Check if a color is in history
   */
  async hasColor(color) {
    await this.init();
    const normalizedColor = color.toUpperCase();
    return this.colors.includes(normalizedColor);
  }

  /**
   * Get color usage statistics
   */
  async getStats() {
    await this.init();
    return {
      totalColors: this.colors.length,
      oldestColor: this.colors[this.colors.length - 1] || null,
      newestColor: this.colors[0] || null,
    };
  }

  /**
   * Save to storage
   */
  async save() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.colors));
    } catch (error) {
      if (__DEV__) {
        console.error('[ColorHistory] Failed to save history:', error);
      }
    }
  }

  /**
   * Export color history as JSON
   */
  async exportHistory() {
    await this.init();
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      colors: this.colors,
    }, null, 2);
  }

  /**
   * Import color history from JSON
   */
  async importHistory(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.colors)) {
        // Validate colors
        const validColors = data.colors.filter((c) => 
          typeof c === 'string' && c.match(/^#[0-9A-Fa-f]{6}$/)
        );
        this.colors = validColors.slice(0, this.MAX_COLORS);
        await this.save();
        return { success: true, imported: validColors.length };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (error) {
      if (__DEV__) {
        console.error('[ColorHistory] Failed to import history:', error);
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Get color palette suggestions based on history
   */
  async getSuggestions() {
    await this.init();
    
    if (this.colors.length === 0) {
      return [];
    }

    // Return complementary colors for the most recent color
    const recentColor = this.colors[0];
    return this.generateComplementaryColors(recentColor);
  }

  /**
   * Generate complementary colors (simple algorithm)
   */
  generateComplementaryColors(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Generate complementary color (opposite on color wheel)
    const complementary = `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`.toUpperCase();

    // Generate triadic colors (120 degrees apart on color wheel)
    const triadic1 = this.rotateHue(r, g, b, 120);
    const triadic2 = this.rotateHue(r, g, b, 240);

    return [complementary, triadic1, triadic2];
  }

  /**
   * Rotate hue (simplified)
   */
  rotateHue(r, g, b, degrees) {
    // Proper hue rotation algorithm using a 3x3 matrix
    const angle = (degrees / 360) * 2 * Math.PI;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Luminance coefficients for RGB
    const lumR = 0.213;
    const lumG = 0.715;
    const lumB = 0.072;

    // Build the rotation matrix
    const m00 = lumR + cosA * (1 - lumR) + sinA * (-lumR);
    const m01 = lumG + cosA * (-lumG) + sinA * (-lumG);
    const m02 = lumB + cosA * (-lumB) + sinA * (1 - lumB);

    const m10 = lumR + cosA * (-lumR) + sinA * 0.143;
    const m11 = lumG + cosA * (1 - lumG) + sinA * 0.140;
    const m12 = lumB + cosA * (-lumB) + sinA * (-0.283);

    const m20 = lumR + cosA * (-lumR) + sinA * (-(1 - lumR));
    const m21 = lumG + cosA * (-lumG) + sinA * (lumG);
    const m22 = lumB + cosA * (1 - lumB) + sinA * (lumB);

    // Apply the matrix to the RGB values
    const newR = Math.round(Math.max(0, Math.min(255, r * m00 + g * m01 + b * m02)));
    const newG = Math.round(Math.max(0, Math.min(255, r * m10 + g * m11 + b * m12)));
    const newB = Math.round(Math.max(0, Math.min(255, r * m20 + g * m21 + b * m22)));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`.toUpperCase();
  }
}

// Create singleton instance
const colorHistoryService = new ColorHistoryService();

export default colorHistoryService;
