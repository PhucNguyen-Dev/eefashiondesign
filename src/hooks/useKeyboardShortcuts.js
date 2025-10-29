import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Custom hook for keyboard shortcuts
 * Works on web platform, provides haptic feedback on mobile
 */
const useKeyboardShortcuts = (shortcuts = {}) => {
  const handleKeyPress = useCallback(
    (event) => {
      // Check for modifier keys
      const ctrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build shortcut key
      let shortcutKey = '';
      if (ctrl) shortcutKey += 'ctrl+';
      if (shift) shortcutKey += 'shift+';
      if (alt) shortcutKey += 'alt+';
      shortcutKey += event.key.toLowerCase();

      // Check if we have a handler for this shortcut
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
        
        // Provide haptic feedback on mobile
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    // Only add event listener on web
    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [handleKeyPress]);

  return null;
};

/**
 * Common shortcuts for design apps
 */
export const COMMON_SHORTCUTS = {
  UNDO: 'ctrl+z',
  REDO_WINDOWS: 'ctrl+y',
  REDO_MAC: 'ctrl+shift+z',
  SAVE: 'ctrl+s',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  CUT: 'ctrl+x',
  DELETE: 'delete',
  DELETE_ALT: 'backspace',
  SELECT_ALL: 'ctrl+a',
  DUPLICATE: 'ctrl+d',
  GROUP: 'ctrl+g',
  UNGROUP: 'ctrl+shift+g',
  BRING_FORWARD: 'ctrl+]',
  SEND_BACKWARD: 'ctrl+[',
  ZOOM_IN: 'ctrl++',
  ZOOM_OUT: 'ctrl+-',
  ZOOM_RESET: 'ctrl+0',
  TOGGLE_GRID: 'ctrl+\'',
  TOGGLE_RULER: 'ctrl+r',
  ESCAPE: 'escape',
};

export default useKeyboardShortcuts;
