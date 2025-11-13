/**
 * ColorPicker Component for Design3D - Legacy wrapper
 * This component is now a wrapper around the Tamagui ColorPicker
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import ColorPickerTamagui from '@components/tamagui/ColorPicker';

const ColorPicker = ({ selectedColor, onColorChange }) => {
  return (
    <ColorPickerTamagui
      selectedColor={selectedColor}
      onColorChange={onColorChange}
      showAdvanced={false}
      showGradients={false}
      showHistory={false}
    />
  );
};

export default ColorPicker;

