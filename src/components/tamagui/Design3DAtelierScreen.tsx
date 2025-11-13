import React, { useState } from 'react';
import { Stack, styled } from '@tamagui/core';
import { supports3D } from '@infrastructure/platform/guards/GLCapabilityGuard';
import { THEME_COLORS } from '@infrastructure/config/constants';

// Import components
import TamaguiHeader3D from './Header3D';
import TamaguiLeftSidebar from './LeftSidebar';
import TamaguiRightSidebar from './RightSidebar';
import TamaguiBottomBar3D from './BottomBar3D';
import Viewport3D from '../../features/design3D/components/viewport/Viewport3D';
import TamaguiMobileFallback from './MobileFallback';

interface Design3DAtelierScreenProps {
  navigation: any;
}

const Container = styled(Stack, {
  flex: 1,
  backgroundColor: THEME_COLORS.background.primary,
});

const MainContent = styled(Stack, {
  flex: 1,
  flexDirection: 'row',
});

const ViewportContainer = styled(Stack, {
  flex: 1,
  backgroundColor: THEME_COLORS.background.secondary,
});

export const TamaguiDesign3DAtelierScreen: React.FC<Design3DAtelierScreenProps> = ({ navigation }) => {
  // State management
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedGarment, setSelectedGarment] = useState('jumpsuit');
  const [selectedMaterial, setSelectedMaterial] = useState('denim');
  const [selectedColor, setSelectedColor] = useState('#4A90E2');
  const [viewOrientation, setViewOrientation] = useState('front');
  const [isSimulating, setIsSimulating] = useState(false);

  // Material properties
  const [materialProps, setMaterialProps] = useState({
    roughness: 0.7,
    shininess: 0.3,
    thickness: 0.5,
    weight: 0.6,
  });

  // Check if device supports 3D
  const canUse3D = supports3D();

  // If mobile/tablet, show fallback UI
  if (!canUse3D) {
    return <TamaguiMobileFallback navigation={navigation} />;
  }

  return (
    <Container>
      {/* Header */}
      <TamaguiHeader3D navigation={navigation} />

      {/* Main Content Area */}
      <MainContent>
        {/* Left Sidebar - Tools */}
        <TamaguiLeftSidebar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          selectedGarment={selectedGarment}
          setSelectedGarment={setSelectedGarment}
        />

        {/* Center Viewport */}
        <ViewportContainer>
          <Viewport3D
            selectedGarment={selectedGarment}
            selectedMaterial={selectedMaterial}
            selectedColor={selectedColor}
            viewOrientation={viewOrientation}
            materialProps={materialProps}
            isSimulating={isSimulating}
          />
        </ViewportContainer>

        {/* Right Sidebar - Properties */}
        <TamaguiRightSidebar
          viewOrientation={viewOrientation}
          setViewOrientation={setViewOrientation}
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          materialProps={materialProps}
          setMaterialProps={setMaterialProps}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
        />
      </MainContent>

      {/* Bottom Bar - Actions */}
      <TamaguiBottomBar3D navigation={navigation} />
    </Container>
  );
};
