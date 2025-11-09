/**
 * ThemeToggle Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui ThemeToggle
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import ThemeToggleTamagui from './tamagui/ThemeToggle';

const ThemeToggle = ({ style, showLabel = true }) => {
  return <ThemeToggleTamagui style={style} showLabel={showLabel} />;
};

export default ThemeToggle;
