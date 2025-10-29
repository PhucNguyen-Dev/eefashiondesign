import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

/**
 * Fade in animation hook
 */
export const useFadeIn = (duration = 500, delay = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return fadeAnim;
};

/**
 * Slide in animation hook
 */
export const useSlideIn = (direction = 'up', distance = 50, duration = 500) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTransform = () => {
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
export const useScale = (from = 0, to = 1, duration = 500) => {
  const scaleAnim = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: to,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return scaleAnim;
};

/**
 * Pulse animation hook
 */
export const usePulse = (minScale = 1, maxScale = 1.1, duration = 1000) => {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;
  const animationRef = useRef(null);

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
  }, []);

  return pulseAnim;
};

/**
 * Rotation animation hook
 */
export const useRotation = (duration = 1000, loop = false) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

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
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { rotateAnim, rotate };
};

/**
 * Bounce animation hook
 */
export const useBounce = (toValue = 1, friction = 2) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const bounce = () => {
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
export const useShake = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
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
export const useProgress = (targetProgress, duration = 1000) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [targetProgress]);

  return progressAnim;
};

/**
 * Card flip animation hook
 */
export const useCardFlip = () => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => {
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
