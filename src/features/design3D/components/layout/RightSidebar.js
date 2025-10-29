import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS, MATERIAL_TYPES } from '../../../../core/utils/constants';
import ColorPicker from '../ui/ColorPicker';
import PropertySlider from '../ui/PropertySlider';

const RightSidebar = ({
  viewOrientation,
  setViewOrientation,
  selectedMaterial,
  setSelectedMaterial,
  selectedColor,
  setSelectedColor,
  materialProps,
  setMaterialProps,
  isSimulating,
  setIsSimulating,
}) => {
  const [expandedSection, setExpandedSection] = useState('view');

  // View Orientations
  const viewOrientations = [
    { id: 'front', label: 'Front', icon: 'human-handsup' },
    { id: 'back', label: 'Back', icon: 'human-handsdown' },
    { id: 'left', label: 'Left', icon: 'rotate-left' },
    { id: 'right', label: 'Right', icon: 'rotate-right' },
    { id: 'top', label: 'Top', icon: 'arrow-up-bold' },
    { id: 'walking', label: 'Walking', icon: 'walk' },
  ];

  // Material Types
  const materials = [
    { id: 'denim', label: 'Denim', color: '#4A5568', icon: 'texture' },
    { id: 'cotton', label: 'Cotton', color: '#F7FAFC', icon: 'cloud' },
    { id: 'leather', label: 'Leather', color: '#744210', icon: 'shield' },
    { id: 'silk', label: 'Silk', color: '#FBD38D', icon: 'shimmer' },
    { id: 'wool', label: 'Wool', color: '#CBD5E0', icon: 'sheep' },
    { id: 'linen', label: 'Linen', color: '#EDF2F7', icon: 'leaf' },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateMaterialProp = (key, value) => {
    setMaterialProps({ ...materialProps, [key]: value });
  };

  return (
    <View style={styles.sidebar}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* View Orientation Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('view')}
          >
            <MaterialCommunityIcons name="rotate-3d-variant" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>View Orientation</Text>
            <Ionicons
              name={expandedSection === 'view' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'view' && (
            <View style={styles.orientationGrid}>
              {viewOrientations.map((orientation) => (
                <TouchableOpacity
                  key={orientation.id}
                  style={[
                    styles.orientationButton,
                    viewOrientation === orientation.id && styles.orientationButtonActive,
                  ]}
                  onPress={() => setViewOrientation(orientation.id)}
                >
                  <MaterialCommunityIcons
                    name={orientation.icon}
                    size={24}
                    color={
                      viewOrientation === orientation.id
                        ? THEME_COLORS.accent.blue
                        : THEME_COLORS.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.orientationLabel,
                      viewOrientation === orientation.id && styles.orientationLabelActive,
                    ]}
                  >
                    {orientation.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Material Selector Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('material')}
          >
            <MaterialCommunityIcons name="palette" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Material</Text>
            <Ionicons
              name={expandedSection === 'material' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'material' && (
            <View style={styles.sectionContent}>
              <View style={styles.materialGrid}>
                {materials.map((material) => (
                  <TouchableOpacity
                    key={material.id}
                    style={[
                      styles.materialButton,
                      selectedMaterial === material.id && styles.materialButtonActive,
                    ]}
                    onPress={() => setSelectedMaterial(material.id)}
                  >
                    <View
                      style={[
                        styles.materialSwatch,
                        { backgroundColor: material.color },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={material.icon}
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text
                      style={[
                        styles.materialLabel,
                        selectedMaterial === material.id && styles.materialLabelActive,
                      ]}
                    >
                      {material.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Color Picker Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('color')}
          >
            <Ionicons name="color-palette" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Color</Text>
            <Ionicons
              name={expandedSection === 'color' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'color' && (
            <View style={styles.sectionContent}>
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </View>
          )}
        </View>

        {/* Material Properties Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('properties')}
          >
            <Ionicons name="options-outline" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Properties</Text>
            <Ionicons
              name={expandedSection === 'properties' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'properties' && (
            <View style={styles.sectionContent}>
              <PropertySlider
                label="Roughness"
                value={materialProps.roughness}
                onValueChange={(value) => updateMaterialProp('roughness', value)}
                icon="texture-box"
              />
              <PropertySlider
                label="Shininess"
                value={materialProps.shininess}
                onValueChange={(value) => updateMaterialProp('shininess', value)}
                icon="shimmer"
              />
              <PropertySlider
                label="Thickness"
                value={materialProps.thickness}
                onValueChange={(value) => updateMaterialProp('thickness', value)}
                icon="layers"
              />
              <PropertySlider
                label="Weight"
                value={materialProps.weight}
                onValueChange={(value) => updateMaterialProp('weight', value)}
                icon="weight"
              />
            </View>
          )}
        </View>

        {/* Simulate Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.simulateButton, isSimulating && styles.simulateButtonActive]}
            onPress={() => setIsSimulating(!isSimulating)}
          >
            <LinearGradient
              colors={
                isSimulating
                  ? [THEME_COLORS.accent.coral, THEME_COLORS.accent.purple]
                  : [THEME_COLORS.accent.blue, THEME_COLORS.accent.teal]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.simulateGradient}
            >
              <MaterialCommunityIcons
                name={isSimulating ? 'pause' : 'play'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.simulateText}>
                {isSimulating ? 'Stop Simulation' : 'Simulate Physics'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 320,
    backgroundColor: THEME_COLORS.background.primary,
    borderLeftWidth: 1,
    borderLeftColor: THEME_COLORS.background.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.background.tertiary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  sectionContent: {
    padding: 16,
  },
  orientationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  orientationButton: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orientationButtonActive: {
    backgroundColor: THEME_COLORS.accent.blue + '15',
    borderColor: THEME_COLORS.accent.blue,
  },
  orientationLabel: {
    fontSize: 11,
    color: THEME_COLORS.text.secondary,
    textAlign: 'center',
  },
  orientationLabelActive: {
    color: THEME_COLORS.accent.blue,
    fontWeight: '600',
  },
  materialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  materialButton: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: THEME_COLORS.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  materialButtonActive: {
    borderColor: THEME_COLORS.accent.blue,
    backgroundColor: THEME_COLORS.background.tertiary,
  },
  materialSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialLabel: {
    flex: 1,
    fontSize: 13,
    color: THEME_COLORS.text.secondary,
  },
  materialLabelActive: {
    color: THEME_COLORS.text.primary,
    fontWeight: '600',
  },
  simulateButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  simulateButtonActive: {
    transform: [{ scale: 0.98 }],
  },
  simulateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
  },
  simulateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default RightSidebar;

