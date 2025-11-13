/**
 * Advanced Interactive Effects Components
 * Cross-platform hover, press, and animation effects
 * Optimized for fashion app with premium feel
 */

import React, { useRef } from 'react';
import { Platform, Animated, TouchableOpacity, Pressable } from 'react-native';
import { Stack, styled } from '@tamagui/core';

// Animation durations
export const ANIMATION_DURATION = {
  INSTANT: 150,
  SNAPPY: 200,
  ELEGANT: 300,
  SMOOTH: 400,
  INFORMATIVE: 600,
};

// Lift Card Effect (for template/design cards)
export const LiftCard = styled(Stack, {
  borderRadius: '$6',
  overflow: 'hidden',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    transform: [{ translateY: -8 }, { scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  } : {},
  
  pressStyle: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});

// Elastic Button (primary actions)
export const ElasticButton = styled(Stack, {
  paddingHorizontal: '$5',
  paddingVertical: '$4',
  borderRadius: '$10',
  alignItems: 'center',
  justifyContent: 'center',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    transform: [{ scale: 1.05 }],
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  } : {},
  
  pressStyle: {
    transform: [{ scale: 0.95 }],
  },
});

// Icon Bounce Effect (for icon buttons)
export const IconBounce = styled(Stack, {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    transform: [{ rotate: '5deg' }, { scale: 1.1 }],
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  } : {},
  
  pressStyle: {
    transform: [{ scale: 0.9 }],
    opacity: 0.8,
  },
});

// Glow Input Effect
export const GlowInput = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderRadius: '$4',
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.1)',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s ease',
  }),
  
  focusStyle: {
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    transform: [{ scale: 1.01 }],
  },
});

// List Item Slide Effect
export const ListItemSlide = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  padding: '$4',
  borderRadius: '$4',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    transform: [{ translateX: 4 }],
  } : {},
  
  pressStyle: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    transform: [{ scale: 0.99 }],
  },
});

// Fabric Swatch Pop Effect
export const SwatchPop = styled(Stack, {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: 'transparent',
  
  ...(Platform.OS === 'web' && {
    transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cursor: 'pointer',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    transform: [{ scale: 1.15 }],
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  } : {},
  
  pressStyle: {
    transform: [{ scale: 0.95 }],
  },
  
  variants: {
    selected: {
      true: {
        borderColor: '#6C63FF',
        borderWidth: 3,
      },
    },
  },
});

// Shimmer Card (for premium feel)
export const ShimmerCard = styled(LiftCard, {
  overflow: 'hidden',
  position: 'relative',
});

// Animated Pressable with custom effects
interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  effect?: 'lift' | 'elastic' | 'bounce' | 'scale';
  style?: any;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPress,
  effect = 'scale',
  style,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  
  const handlePressIn = () => {
    if (effect === 'lift') {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.02,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
        Animated.spring(translateYAnim, {
          toValue: -8,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
      ]).start();
    } else if (effect === 'elastic') {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        useNativeDriver: true,
        speed: 50,
        bounciness: 8,
      }).start();
    } else if (effect === 'bounce') {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
    ]).start();
  };
  
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

// Pulse Animation for selected items
interface PulseProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
}

export const Pulse: React.FC<PulseProps> = ({ children, active = false, color = '#6C63FF' }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [active]);
  
  return (
    <Animated.View
      style={{
        transform: [{ scale: pulseAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default {
  LiftCard,
  ElasticButton,
  IconBounce,
  GlowInput,
  ListItemSlide,
  SwatchPop,
  ShimmerCard,
  AnimatedPressable,
  Pulse,
  ANIMATION_DURATION,
};

