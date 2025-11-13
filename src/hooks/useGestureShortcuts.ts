import { useEffect, useRef, useState } from 'react';
import { PanResponder, Platform, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import * as Haptics from 'expo-haptics';

type GestureState = 'active' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | null;

interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTwoFingerTap?: () => void;
  onThreeFingerTap?: () => void;
  onPinchIn?: () => void;
  onPinchOut?: () => void;
}

interface GestureStartInfo {
  x: number;
  y: number;
  time: number;
  touches: number;
}

interface GestureShortcutsResult {
  panHandlers: any;
  gestureState: GestureState;
}

interface GestureHint {
  gesture: string;
  action: string;
  icon: string;
}

/**
 * Custom hook for gesture-based shortcuts
 * Provides swipe gestures for common actions
 */
const useGestureShortcuts = (callbacks: GestureCallbacks = {}): GestureShortcutsResult => {
  const [gestureState, setGestureState] = useState<GestureState>(null);
  const gestureStartRef = useRef<GestureStartInfo | null>(null);
  const velocityThreshold = 0.3;
  const distanceThreshold = 50;

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTwoFingerTap,
    onThreeFingerTap,
    onPinchIn,
    onPinchOut,
  } = callbacks;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Only activate for significant movements
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },
      onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        gestureStartRef.current = {
          x: gestureState.x0,
          y: gestureState.y0,
          time: Date.now(),
          touches: evt.nativeEvent.touches.length,
        };
        setGestureState('active');
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Track gesture but don't trigger yet
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (!gestureStartRef.current) return;

        const { dx, dy, vx, vy } = gestureState;
        const touches = gestureStartRef.current.touches;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = Math.sqrt(vx * vx + vy * vy);

        // Check for multi-finger taps
        if (distance < 20 && touches > 1) {
          if (Platform.OS !== 'web') {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          
          if (touches === 2 && onTwoFingerTap) {
            onTwoFingerTap();
          } else if (touches === 3 && onThreeFingerTap) {
            onThreeFingerTap();
          }
          setGestureState(null);
          return;
        }

        // Check for swipe gestures
        if (distance > distanceThreshold || velocity > velocityThreshold) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          if (Platform.OS !== 'web') {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          // Determine swipe direction
          if (angle >= -45 && angle < 45) {
            // Right swipe
            if (onSwipeRight) onSwipeRight();
            setGestureState('swipe-right');
          } else if (angle >= 45 && angle < 135) {
            // Down swipe
            if (onSwipeDown) onSwipeDown();
            setGestureState('swipe-down');
          } else if (angle >= -135 && angle < -45) {
            // Up swipe
            if (onSwipeUp) onSwipeUp();
            setGestureState('swipe-up');
          } else {
            // Left swipe
            if (onSwipeLeft) onSwipeLeft();
            setGestureState('swipe-left');
          }

          // Reset after a short delay
          setTimeout(() => { setGestureState(null); }, 500);
        } else {
          setGestureState(null);
        }

        gestureStartRef.current = null;
      },
      onPanResponderTerminate: () => {
        gestureStartRef.current = null;
        setGestureState(null);
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    gestureState,
  };
};

/**
 * Predefined gesture shortcuts for common actions
 */
export const GESTURE_SHORTCUTS: Readonly<Record<string, string>> = {
  UNDO: 'swipe-left',
  REDO: 'swipe-right',
  LAYER_UP: 'swipe-up',
  LAYER_DOWN: 'swipe-down',
  ZOOM_IN: 'pinch-out',
  ZOOM_OUT: 'pinch-in',
  RESET_VIEW: 'two-finger-tap',
  SHOW_MENU: 'three-finger-tap',
} as const;

/**
 * Gesture tutorial hints
 */
export const GESTURE_HINTS: readonly GestureHint[] = [
  {
    gesture: 'Swipe Left',
    action: 'Undo last action',
    icon: 'arrow-undo',
  },
  {
    gesture: 'Swipe Right',
    action: 'Redo action',
    icon: 'arrow-redo',
  },
  {
    gesture: 'Swipe Up',
    action: 'Move layer up',
    icon: 'arrow-up',
  },
  {
    gesture: 'Swipe Down',
    action: 'Move layer down',
    icon: 'arrow-down',
  },
  {
    gesture: 'Two Finger Tap',
    action: 'Reset view',
    icon: 'refresh',
  },
  {
    gesture: 'Three Finger Tap',
    action: 'Show menu',
    icon: 'menu',
  },
] as const;

/**
 * Hook for pinch-to-zoom gesture
 */
export const usePinchGesture = (onPinch: (scale: number) => void): any => {
  const initialDistance = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent) => evt.nativeEvent.touches.length === 2,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          initialDistance.current = Math.sqrt(dx * dx + dy * dy);
        }
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2 && initialDistance.current) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          const currentDistance = Math.sqrt(dx * dx + dy * dy);
          
          const scale = currentDistance / initialDistance.current;
          
          if (onPinch) {
            onPinch(scale);
          }
        }
      },
      onPanResponderRelease: () => {
        initialDistance.current = null;
      },
    })
  ).current;

  return panResponder.panHandlers;
};

/**
 * Hook for double tap gesture
 */
export const useDoubleTapGesture = (onDoubleTap: () => void): (() => void) => {
  const lastTapRef = useRef<number | null>(null);
  const doubleTapDelay = 300; // ms

  const handlePress = (): void => {
    const now = Date.now();
    
    if (lastTapRef.current && now - lastTapRef.current < doubleTapDelay) {
      // Double tap detected
      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      if (onDoubleTap) {
        onDoubleTap();
      }
      lastTapRef.current = null;
    } else {
      // First tap
      lastTapRef.current = now;
    }
  };

  return handlePress;
};

/**
 * Hook for long press gesture
 */
export const useLongPressGesture = (onLongPress: () => void, duration: number = 500): any => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        timeoutRef.current = setTimeout(() => {
          if (Platform.OS !== 'web') {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          if (onLongPress) {
            onLongPress();
          }
        }, duration);
      },
      onPanResponderMove: () => {
        // Cancel on move
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      onPanResponderRelease: () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
};

export default useGestureShortcuts;
