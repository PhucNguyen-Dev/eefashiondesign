/**
 * PropertiesPanel Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui PropertiesPanel
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import PropertiesPanelTamagui from '../tamagui/PropertiesPanel';

const PropertiesPanel = ({ selectedElement, onUpdateProperty }) => {
  return (
    <PropertiesPanelTamagui
      selectedElement={selectedElement}
      onUpdateProperty={onUpdateProperty}
    />
  );
};

export default PropertiesPanel;
