import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface ThemeToggleProps {
  style?: any;
  showLabel?: boolean;
}

const Container = styled(XStack, {
  alignItems: 'center',
  gap: '$sm',
});

const Label = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
});

const ToggleContainer = styled(XStack, {
  width: 64,
  height: 32,
  borderRadius: 16,
  backgroundColor: '$bgInput',
  alignItems: 'center',
  padding: 2,
  position: 'relative',
});

const Icon = styled(YStack, {
  width: 28,
  height: 28,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
});

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style, showLabel = true }) => {
  const { isDark, toggleTheme } = useTheme();
  const toggleAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: isDark ? 1 : 0,
      friction: 5,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  const sunOpacity = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  const moonOpacity = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Container style={style}>
      {showLabel && <Label>Theme</Label>}
      
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity onPress={handleToggle} activeOpacity={0.8}>
          <ToggleContainer>
            {/* Sun Icon */}
            <Animated.View style={{ opacity: sunOpacity }}>
              <Icon style={{ left: 6 }}>
                <MaterialCommunityIcons
                  name="white-balance-sunny"
                  size={18}
                  color="#FFD93D"
                />
              </Icon>
            </Animated.View>

            {/* Moon Icon */}
            <Animated.View style={{ opacity: moonOpacity }}>
              <Icon style={{ right: 6 }}>
                <MaterialCommunityIcons
                  name="moon-waning-crescent"
                  size={18}
                  color="#6C63FF"
                />
              </Icon>
            </Animated.View>

            {/* Slider */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 28,
                height: 28,
                borderRadius: 14,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                transform: [{ translateX }],
              }}
            >
              <LinearGradient
                colors={isDark ? ['#6C63FF', '#4ECDC4'] : ['#FFD93D', '#FF6B6B']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'}
                  size={16}
                  color="#fff"
                />
              </LinearGradient>
            </Animated.View>
          </ToggleContainer>
        </TouchableOpacity>
      </Animated.View>
    </Container>
  );
};

export default ThemeToggle;
