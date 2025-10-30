/**
 * PatternSelector Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui PatternSelector
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import PatternSelectorTamagui from './tamagui/PatternSelector';

const PatternSelector = ({ selectedPattern, onPatternSelect }) => {
  return (
    <PatternSelectorTamagui
      selectedPattern={selectedPattern}
      onPatternSelect={onPatternSelect}
    />
  );
};

export default PatternSelector;
