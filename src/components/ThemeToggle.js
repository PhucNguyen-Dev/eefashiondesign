import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../config/constants';

const ThemeToggle = ({ style, showLabel = true }) => {
  const { isDark, toggleTheme, colors } = useTheme();
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
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Theme
        </Text>
      )}
      
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.toggleContainer, { backgroundColor: colors.bgInput }]}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          {/* Sun Icon */}
          <Animated.View
            style={[styles.icon, styles.sunIcon, { opacity: sunOpacity }]}
          >
            <MaterialCommunityIcons
              name="white-balance-sunny"
              size={18}
              color="#FFD93D"
            />
          </Animated.View>

          {/* Moon Icon */}
          <Animated.View
            style={[styles.icon, styles.moonIcon, { opacity: moonOpacity }]}
          >
            <MaterialCommunityIcons name="moon-waning-crescent" size={18} color="#6C63FF" />
          </Animated.View>

          {/* Slider */}
          <Animated.View
            style={[
              styles.slider,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={isDark ? ['#6C63FF', '#4ECDC4'] : ['#FFD93D', '#FF6B6B']}
              style={styles.sliderGradient}
            >
              <MaterialCommunityIcons
                name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'}
                size={16}
                color="#fff"
              />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.sm,
  },
  toggleContainer: {
    width: 64,
    height: 32,
    borderRadius: BORDER_RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    position: 'relative',
  },
  icon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunIcon: {
    position: 'absolute',
    left: 6,
  },
  moonIcon: {
    position: 'absolute',
    right: 6,
  },
  slider: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sliderGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeToggle;
