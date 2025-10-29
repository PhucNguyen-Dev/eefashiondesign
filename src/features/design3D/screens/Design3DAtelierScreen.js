import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { isWeb, isDesktop, supports3D } from '../../../core/utils/platform';
import { THEME_COLORS } from '../../../core/utils/constants';

// Import components (will create these next)
import Header from '../components/layout/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import BottomBar from '../components/layout/BottomBar';
import Viewport3D from '../components/viewport/Viewport3D';
import MobileFallback from '../components/ui/MobileFallback';

const { width, height } = Dimensions.get('window');

const Design3DAtelierScreen = ({ navigation }) => {
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
    return <MobileFallback navigation={navigation} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Left Sidebar - Tools */}
        <LeftSidebar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          selectedGarment={selectedGarment}
          setSelectedGarment={setSelectedGarment}
        />

        {/* Center Viewport */}
        <View style={styles.viewportContainer}>
          <Viewport3D
            selectedGarment={selectedGarment}
            selectedMaterial={selectedMaterial}
            selectedColor={selectedColor}
            viewOrientation={viewOrientation}
            materialProps={materialProps}
            isSimulating={isSimulating}
          />
        </View>

        {/* Right Sidebar - Properties */}
        <RightSidebar
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
      </View>

      {/* Bottom Bar - Actions */}
      <BottomBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background.primary,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  viewportContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background.secondary,
  },
});

export default Design3DAtelierScreen;

