/**
 * Responsive Utilities
 * Makes the app work perfectly on mobile, tablet, and desktop
 */

import { useState, useEffect } from 'react';
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Hook for responsive dimensions
 * Updates when window size changes (important for web and tablets)
 */
export const useDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Breakpoints (standard responsive design)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};

// Device type detection
export const isSmallDevice = () => SCREEN_WIDTH < BREAKPOINTS.mobile;
export const isMobile = () => SCREEN_WIDTH < BREAKPOINTS.tablet;
export const isTablet = () => SCREEN_WIDTH >= BREAKPOINTS.tablet && SCREEN_WIDTH < BREAKPOINTS.desktop;
export const isDesktop = () => SCREEN_WIDTH >= BREAKPOINTS.desktop;
export const isLargeDesktop = () => SCREEN_WIDTH >= BREAKPOINTS.largeDesktop;

// Get device type
export const getDeviceType = () => {
  if (isSmallDevice()) return 'smallMobile';
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  if (isLargeDesktop()) return 'largeDesktop';
  return 'desktop';
};

// Responsive font sizes
const scale = SCREEN_WIDTH / 375; // Base on iPhone X width

export const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive spacing
export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(48),
};

// Responsive font sizes
export const fontSize = {
  xs: normalize(10),
  sm: normalize(12),
  md: normalize(14),
  lg: normalize(16),
  xl: normalize(20),
  xxl: normalize(24),
  xxxl: normalize(32),
  display: normalize(48),
};

// Responsive dimensions
export const wp = (percentage) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
};

export const hp = (percentage) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
};

// Layout helpers
export const getGridColumns = () => {
  if (isSmallDevice()) return 1;
  if (isMobile()) return 2;
  if (isTablet()) return 3;
  if (isDesktop()) return 4;
  return 5;
};

export const getMaxWidth = () => {
  if (isMobile()) return SCREEN_WIDTH;
  if (isTablet()) return 720;
  if (isDesktop()) return 960;
  return 1200;
};

// Tutorial positioning (responsive for all screens)
export const getTutorialPosition = () => {
  return {
    tooltipMaxWidth: isMobile() ? wp(90) : wp(50),
    tooltipPadding: isMobile() ? 16 : 20,
    fontSize: isMobile() ? 13 : 14,
    iconSize: isMobile() ? 28 : 32,
    buttonPadding: isMobile() ? 10 : 12,
  };
};

// Canvas dimensions (responsive)
export const getCanvasDimensions = () => {
  if (isSmallDevice()) {
    return { width: wp(90), height: hp(40) };
  }
  if (isMobile()) {
    return { width: wp(90), height: hp(45) };
  }
  if (isTablet()) {
    return { width: wp(80), height: hp(50) };
  }
  return { width: wp(70), height: hp(60) };
};

// Modal sizing
export const getModalSize = () => {
  if (isMobile()) {
    return { width: wp(90), height: hp(80) };
  }
  if (isTablet()) {
    return { width: wp(70), height: hp(70) };
  }
  return { width: 800, height: 600 };
};

// Export all
export default {
  BREAKPOINTS,
  isSmallDevice,
  isMobile,
  isTablet,
  isDesktop,
  isLargeDesktop,
  getDeviceType,
  normalize,
  spacing,
  fontSize,
  wp,
  hp,
  getGridColumns,
  getMaxWidth,
  getTutorialPosition,
  getCanvasDimensions,
  getModalSize,
  useDimensions,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
