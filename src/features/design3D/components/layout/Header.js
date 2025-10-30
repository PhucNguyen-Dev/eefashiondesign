/**
 * Header Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui Header3D
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import Header3DTamagui from '../../../../components/tamagui/Header3D';

const Header = ({ navigation }) => {
  return <Header3DTamagui navigation={navigation} />;
};

export default Header;
