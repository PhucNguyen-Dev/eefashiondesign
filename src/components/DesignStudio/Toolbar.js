/**
 * Toolbar Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui Toolbar
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import ToolbarTamagui from '../tamagui/Toolbar';

  return (
    <ToolbarTamagui
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
      onUndo={onUndo}
      onRedo={onRedo}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );
};

export default Toolbar;
