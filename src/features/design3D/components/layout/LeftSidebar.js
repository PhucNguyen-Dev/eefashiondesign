import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const LeftSidebar = ({ selectedTool, setSelectedTool, selectedGarment, setSelectedGarment }) => {
  const [expandedSection, setExpandedSection] = useState('tools');

  // View Controls
  const viewControls = [
    { id: 'rotate', icon: 'rotate-3d-variant', label: 'Rotate' },
    { id: 'pan', icon: 'pan', label: 'Pan' },
    { id: 'zoom', icon: 'magnify', label: 'Zoom' },
    { id: 'reset', icon: 'restore', label: 'Reset View' },
  ];

  // Garment Types
  const garmentTypes = [
    { id: 'jumpsuit', icon: 'human-handsup', label: 'Jumpsuit', color: THEME_COLORS.accent.blue },
    { id: 'dress', icon: 'human-female-dance', label: 'Dress', color: THEME_COLORS.accent.purple },
    { id: 'shirt', icon: 'tshirt-crew', label: 'Shirt', color: THEME_COLORS.accent.teal },
    { id: 'pants', icon: 'human-male', label: 'Pants', color: THEME_COLORS.accent.coral },
    { id: 'jacket', icon: 'coat-rack', label: 'Jacket', color: THEME_COLORS.accent.mint },
  ];

  // Design Tools
  const designTools = [
    { id: 'select', icon: 'cursor-default', label: 'Select' },
    { id: 'material', icon: 'palette', label: 'Material' },
    { id: 'pattern', icon: 'texture', label: 'Pattern' },
    { id: 'draw', icon: 'brush', label: 'Draw' },
    { id: 'text', icon: 'format-text', label: 'Text' },
    { id: 'measure', icon: 'ruler', label: 'Measure' },
  ];

  // Advanced Tools
  const advancedTools = [
    { id: 'lighting', icon: 'lightbulb-on', label: 'Lighting' },
    { id: 'seams', icon: 'vector-polyline', label: 'Seams' },
    { id: 'pleating', icon: 'waves', label: 'Pleating' },
    { id: 'uv-map', icon: 'grid', label: 'UV Map' },
    { id: 'pose', icon: 'human-handsdown', label: 'Pose' },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View style={styles.sidebar}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* View Controls Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('view')}
          >
            <Ionicons name="eye-outline" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>View Controls</Text>
            <Ionicons
              name={expandedSection === 'view' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'view' && (
            <View style={styles.sectionContent}>
              {viewControls.map((control) => (
                <TouchableOpacity key={control.id} style={styles.controlButton}>
                  <MaterialCommunityIcons
                    name={control.icon}
                    size={20}
                    color={THEME_COLORS.text.secondary}
                  />
                  <Text style={styles.controlLabel}>{control.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Garment Selector Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('garment')}
          >
            <MaterialCommunityIcons name="hanger" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Garment Type</Text>
            <Ionicons
              name={expandedSection === 'garment' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'garment' && (
            <View style={styles.sectionContent}>
              {garmentTypes.map((garment) => (
                <TouchableOpacity
                  key={garment.id}
                  style={[
                    styles.garmentButton,
                    selectedGarment === garment.id && styles.garmentButtonActive,
                  ]}
                  onPress={() => setSelectedGarment(garment.id)}
                >
                  <View
                    style={[
                      styles.garmentIcon,
                      { backgroundColor: garment.color + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={garment.icon}
                      size={24}
                      color={selectedGarment === garment.id ? garment.color : THEME_COLORS.text.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.garmentLabel,
                      selectedGarment === garment.id && styles.garmentLabelActive,
                    ]}
                  >
                    {garment.label}
                  </Text>
                  {selectedGarment === garment.id && (
                    <Ionicons name="checkmark-circle" size={18} color={garment.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Design Tools Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('tools')}
          >
            <Feather name="tool" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Design Tools</Text>
            <Ionicons
              name={expandedSection === 'tools' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'tools' && (
            <View style={styles.toolGrid}>
              {designTools.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[
                    styles.toolButton,
                    selectedTool === tool.id && styles.toolButtonActive,
                  ]}
                  onPress={() => setSelectedTool(tool.id)}
                >
                  <MaterialCommunityIcons
                    name={tool.icon}
                    size={22}
                    color={
                      selectedTool === tool.id
                        ? THEME_COLORS.accent.blue
                        : THEME_COLORS.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.toolLabel,
                      selectedTool === tool.id && styles.toolLabelActive,
                    ]}
                  >
                    {tool.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Advanced Tools Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('advanced')}
          >
            <Ionicons name="options-outline" size={18} color={THEME_COLORS.text.primary} />
            <Text style={styles.sectionTitle}>Advanced Tools</Text>
            <Ionicons
              name={expandedSection === 'advanced' ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={THEME_COLORS.text.secondary}
            />
          </TouchableOpacity>

          {expandedSection === 'advanced' && (
            <View style={styles.sectionContent}>
              {advancedTools.map((tool) => (
                <TouchableOpacity key={tool.id} style={styles.advancedToolButton}>
                  <MaterialCommunityIcons
                    name={tool.icon}
                    size={20}
                    color={THEME_COLORS.text.secondary}
                  />
                  <Text style={styles.advancedToolLabel}>{tool.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={THEME_COLORS.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: THEME_COLORS.background.primary,
    borderRightWidth: 1,
    borderRightColor: THEME_COLORS.background.tertiary,
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
    padding: 12,
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  controlLabel: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
  },
  garmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  garmentButtonActive: {
    backgroundColor: THEME_COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: THEME_COLORS.accent.blue + '40',
  },
  garmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  garmentLabel: {
    flex: 1,
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
  },
  garmentLabelActive: {
    color: THEME_COLORS.text.primary,
    fontWeight: '600',
  },
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  toolButton: {
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toolButtonActive: {
    backgroundColor: THEME_COLORS.accent.blue + '15',
    borderColor: THEME_COLORS.accent.blue,
  },
  toolLabel: {
    fontSize: 12,
    color: THEME_COLORS.text.secondary,
    textAlign: 'center',
  },
  toolLabelActive: {
    color: THEME_COLORS.accent.blue,
    fontWeight: '600',
  },
  advancedToolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  advancedToolLabel: {
    flex: 1,
    fontSize: 14,
    color: THEME_COLORS.text.primary,
  },
});

export default LeftSidebar;

