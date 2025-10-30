/**
 * LayerPanel Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui LayerPanel
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import LayerPanelTamagui from '../tamagui/LayerPanel';

const LayerPanel = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
  onReorderLayers,
}) => {
  return (
    <LayerPanelTamagui
      layers={layers}
      selectedLayerId={selectedLayerId}
      onSelectLayer={onSelectLayer}
      onToggleVisibility={onToggleVisibility}
      onDeleteLayer={onDeleteLayer}
      onReorderLayers={onReorderLayers}
    />
  );
};

export default LayerPanel;
