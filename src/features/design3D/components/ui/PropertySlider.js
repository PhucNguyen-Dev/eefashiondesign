/**
 * PropertySlider Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui PropertySlider
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import PropertySliderTamagui from '../../../../components/tamagui/PropertySlider';

  return (
    <PropertySliderTamagui
      label={label}
      value={value}
      onValueChange={onValueChange}
      icon={icon}
      min={min}
      max={max}
    />
  );
};

export default PropertySlider;

