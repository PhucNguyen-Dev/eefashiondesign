/**
 * MobileFallback Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui MobileFallback
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import MobileFallbackTamagui from '@components/tamagui/MobileFallback';

const MobileFallback = ({ navigation }) => {
  return <MobileFallbackTamagui navigation={navigation} />;
};

export default MobileFallback;
