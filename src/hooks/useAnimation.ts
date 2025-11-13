import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

type AnimationDirection = 'up' | 'down' | 'left' | 'right';

interface SlideAnimationResult {
  slideAnim: Animated.Value;
  transform: any[];
}

interface RotationAnimationResult {
  rotateAnim: Animated.Value;
  rotate: Animated.AnimatedInterpolation<string>;
}

interface BounceAnimationResult {
  bounceAnim: Animated.Value;
  bounce: () => void;
}

interface ShakeAnimationResult {
  shakeAnim: Animated.Value;
  shake: () => void;
}

interface CardFlipAnimationResult {
  flipAnim: Animated.Value;
  flip: () => void;
  isFlipped: boolean;
  frontAnimatedStyle: { transform: { rotateY: Animated.AnimatedInterpolation<string> }[] };
  backAnimatedStyle: { transform: { rotateY: Animated.AnimatedInterpolation<string> }[] };
}

/**
 * Fade in animation hook
 */
export const useFadeIn = (duration: number = 500, delay: number = 0): Animated.Value => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration, delay]);

  return fadeAnim;
};

/**
 * Slide in animation hook
 */
export const useSlideIn = (
  direction: AnimationDirection = 'up',
  distance: number = 50,
  duration: number = 500
): SlideAnimationResult => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, duration]);

  const getTransform = (): any[] => {
    switch (direction) {
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: Animated.multiply(slideAnim, -1) }];
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: Animated.multiply(slideAnim, -1) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return { slideAnim, transform: getTransform() };
};

/**
 * Scale animation hook
 */
export const useScale = (from: number = 0, to: number = 1, duration: number = 500): Animated.Value => {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: to,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, to]);

  return scaleAnim;
};

/**
 * Pulse animation hook
 */
export const usePulse = (minScale: number = 1, maxScale: number = 1.1, duration: number = 1000): Animated.Value => {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: minScale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim, minScale, maxScale, duration]);

  return pulseAnim;
};

/**
 * Rotation animation hook
 */
export const useRotation = (duration: number = 1000, loop: boolean = false): RotationAnimationResult => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const animation = Animated.timing(rotateAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });

    if (loop) {
      animationRef.current = Animated.loop(animation);
      animationRef.current.start();
    } else {
      animation.start();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      rotateAnim.stopAnimation();
    };
  }, [rotateAnim, duration, loop]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { rotateAnim, rotate };
};

/**
 * Bounce animation hook
 */
export const useBounce = (toValue: number = 1, friction: number = 2): BounceAnimationResult => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const bounce = (): void => {
    bounceAnim.setValue(0);
    Animated.spring(bounceAnim, {
      toValue,
      friction,
      useNativeDriver: true,
    }).start();
  };

  return { bounceAnim, bounce };
};

/**
 * Shake animation hook
 */
export const useShake = (): ShakeAnimationResult => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = (): void => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { shakeAnim, shake };
};

/**
 * Progress animation hook
 */
export const useProgress = (targetProgress: number, duration: number = 1000): Animated.Value => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, targetProgress, duration]);

  return progressAnim;
};

/**
 * Card flip animation hook
 */
export const useCardFlip = (): CardFlipAnimationResult => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const flip = (): void => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return {
    flipAnim,
    flip,
    isFlipped,
    frontAnimatedStyle: { transform: [{ rotateY: frontInterpolate }] },
    backAnimatedStyle: { transform: [{ rotateY: backInterpolate }] },
  };
};
