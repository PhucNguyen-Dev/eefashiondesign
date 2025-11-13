import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Accessibility utilities
 */

/**
 * Check if screen reader is enabled
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.error('Failed to check screen reader status:', error);
    return false;
  }
};

/**
 * Announce to screen reader
 */
export const announceForAccessibility = (message: string): void => {
  try {
    AccessibilityInfo.announceForAccessibility(message);
  } catch (error) {
    console.error('Failed to announce for accessibility:', error);
  }
};

/**
 * Set accessibility focus
 */
export const setAccessibilityFocus = (reactTag: number): void => {
  try {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  } catch (error) {
    console.error('Failed to set accessibility focus:', error);
  }
};

/**
 * Generate accessible label for button
 */
export const getButtonLabel = (action: string, itemName: string = ''): string => {
  return `${action}${itemName ? ` ${itemName}` : ''} button`;
};

type AccessibilityAction = 'tap' | 'swipe' | 'longPress' | 'drag';

/**
 * Generate accessible hint
 */
export const getAccessibilityHint = (action: AccessibilityAction): string => {
  const hints: Record<AccessibilityAction, string> = {
    tap: 'Double tap to activate',
    swipe: 'Swipe to navigate',
    longPress: 'Long press for options',
    drag: 'Drag to reorder',
  };

  return hints[action] || 'Double tap to activate';
};

interface ButtonAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  accessibilityRole: string;
}

/**
 * Common accessibility props for buttons
 */
export const getButtonAccessibility = (
  label: string,
  hint: string,
  role: string = 'button'
): ButtonAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: role,
});

interface ImageAccessibilityProps {
  accessible: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}

/**
 * Common accessibility props for images
 */
export const getImageAccessibility = (
  alt: string,
  decorative: boolean = false
): ImageAccessibilityProps => {
  if (decorative) {
    return {
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no',
    };
  }

  return {
    accessible: true,
    accessibilityLabel: alt,
    accessibilityRole: 'image',
  };
};

interface InputAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  accessibilityRole: string;
}

/**
 * Common accessibility props for text input
 */
export const getInputAccessibility = (
  label: string,
  hint: string,
  required: boolean = false
): InputAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label + (required ? ' required' : ''),
  accessibilityHint: hint,
  accessibilityRole: 'text',
});

interface SwitchAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityRole: string;
  accessibilityState: { checked: boolean };
}

/**
 * Common accessibility props for switches/toggles
 */
export const getSwitchAccessibility = (
  label: string,
  state: boolean
): SwitchAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityRole: 'switch',
  accessibilityState: { checked: state },
});

interface TabAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityRole: string;
  accessibilityState: { selected: boolean };
}

/**
 * Common accessibility props for tabs
 */
export const getTabAccessibility = (
  label: string,
  selected: boolean,
  index: number,
  total: number
): TabAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: `${label}, ${index + 1} of ${total}`,
  accessibilityRole: 'tab',
  accessibilityState: { selected },
});

interface CardAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityHint: string;
  accessibilityRole: string;
}

/**
 * Common accessibility props for cards/items
 */
export const getCardAccessibility = (
  title: string,
  description: string
): CardAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: title,
  accessibilityHint: description,
  accessibilityRole: 'button',
});

interface ProgressAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityRole: string;
  accessibilityValue: {
    min: number;
    max: number;
    now: number;
  };
}

/**
 * Common accessibility props for progress indicators
 */
export const getProgressAccessibility = (
  label: string,
  current: number,
  total: number
): ProgressAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: `${label}: ${current} of ${total}`,
  accessibilityRole: 'progressbar',
  accessibilityValue: {
    min: 0,
    max: total,
    now: current,
  },
});

interface AlertAccessibilityProps {
  accessible: boolean;
  accessibilityLabel: string;
  accessibilityRole: string;
  accessibilityLiveRegion: 'none' | 'polite' | 'assertive';
}

/**
 * Common accessibility props for alerts
 */
export const getAlertAccessibility = (
  type: string,
  message: string
): AlertAccessibilityProps => ({
  accessible: true,
  accessibilityLabel: `${type}: ${message}`,
  accessibilityRole: 'alert',
  accessibilityLiveRegion: 'polite',
});

/**
 * Color contrast checker (WCAG AA standard)
 */
export const hasGoodContrast = (foreground: string, background: string): boolean => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  return ratio >= 4.5;
};

/**
 * Check if text size is accessible
 */
export const isAccessibleTextSize = (fontSize: number): boolean => {
  // Minimum recommended font size is 14px
  return fontSize >= 14;
};

/**
 * Check if touch target is accessible
 */
export const isAccessibleTouchTarget = (width: number, height: number): boolean => {
  // Minimum touch target size is 44x44 points
  return width >= 44 && height >= 44;
};

/**
 * Get reading time estimate
 */
export const getReadingTime = (text: string, wordsPerMinute: number = 200): string => {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} minute read`;
};

/**
 * Format number for screen readers
 */
export const formatNumberForScreenReader = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  }
  return num.toString();
};

/**
 * Format date for screen readers
 */
export const formatDateForScreenReader = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Reduce motion preference
 */
export const shouldReduceMotion = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await AccessibilityInfo.isReduceMotionEnabled();
    }
    return false;
  } catch (error) {
    console.error('Failed to check reduce motion preference:', error);
    return false;
  }
};

/**
 * Bold text preference (iOS)
 */
export const isBoldTextEnabled = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await AccessibilityInfo.isBoldTextEnabled();
    }
    return false;
  } catch (error) {
    console.error('Failed to check bold text preference:', error);
    return false;
  }
};

/**
 * Grayscale preference (iOS)
 */
export const isGrayscaleEnabled = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      return await AccessibilityInfo.isGrayscaleEnabled();
    }
    return false;
  } catch (error) {
    console.error('Failed to check grayscale preference:', error);
    return false;
  }
};

/**
 * Subscribe to accessibility changes
 */
export const subscribeToAccessibilityChanges = (
  callback: (isEnabled: boolean) => void
): (() => void) => {
  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    callback
  );

  return () => {
    subscription?.remove();
  };
};

export default {
  isScreenReaderEnabled,
  announceForAccessibility,
  setAccessibilityFocus,
  getButtonLabel,
  getAccessibilityHint,
  getButtonAccessibility,
  getImageAccessibility,
  getInputAccessibility,
  getSwitchAccessibility,
  getTabAccessibility,
  getCardAccessibility,
  getProgressAccessibility,
  getAlertAccessibility,
  hasGoodContrast,
  isAccessibleTextSize,
  isAccessibleTouchTarget,
  getReadingTime,
  formatNumberForScreenReader,
  formatDateForScreenReader,
  shouldReduceMotion,
  isBoldTextEnabled,
  isGrayscaleEnabled,
  subscribeToAccessibilityChanges,
};
