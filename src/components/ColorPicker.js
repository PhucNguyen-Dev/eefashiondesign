/**
 * ColorPicker Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui ColorPicker
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import ColorPickerTamagui from './tamagui/ColorPicker';

  return (
    <ColorPickerTamagui
      currentColor={currentColor}
      onColorChange={onColorChange}
      showAdvanced={true}
      showGradients={true}
      showHistory={true}
    />
  );
};

export default ColorPicker;
