/**
 * BottomBar Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui BottomBar3D
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import BottomBar3DTamagui from '../../../../components/tamagui/BottomBar3D';

const BottomBar = ({ navigation }) => {
  return <BottomBar3DTamagui navigation={navigation} />;
};

export default BottomBar;
