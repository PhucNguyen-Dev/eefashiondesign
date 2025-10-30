/**
 * FabricSelector Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui FabricSelector
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import FabricSelectorTamagui from './tamagui/FabricSelector';

const FabricSelector = ({ selectedFabric, onFabricSelect }) => {
  return (
    <FabricSelectorTamagui
      selectedFabric={selectedFabric}
      onFabricSelect={onFabricSelect}
    />
  );
};

export default FabricSelector;
