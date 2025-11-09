/**
 * DesignTips Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui DesignTips
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import DesignTipsTamagui from './tamagui/DesignTips';

const DesignTips = ({ visible, onClose, context }) => {
  return (
    <DesignTipsTamagui
      visible={visible}
      onClose={onClose}
      context={context}
    />
  );
};

export default DesignTips;
