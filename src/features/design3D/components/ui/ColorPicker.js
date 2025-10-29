import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const ColorPicker = ({ selectedColor, onColorChange }) => {
  // Preset colors
  const presetColors = [
    '#4A90E2', // Blue
    '#6C5CE7', // Purple
    '#00D9C0', // Teal
    '#FF6B6B', // Coral
    '#7FFFD4', // Mint
    '#FBD38D', // Gold
    '#F687B3', // Pink
    '#68D391', // Green
    '#FC8181', // Red
    '#63B3ED', // Light Blue
    '#B794F4', // Lavender
    '#F6AD55', // Orange
    '#4A5568', // Gray
    '#2D3748', // Dark Gray
    '#FFFFFF', // White
    '#000000', // Black
  ];

  return (
    <View style={styles.container}>
      {/* Current Color Display */}
      <View style={styles.currentColorSection}>
        <View style={styles.currentColorDisplay}>
          <View style={[styles.currentColorSwatch, { backgroundColor: selectedColor }]} />
          <View style={styles.currentColorInfo}>
            <Text style={styles.currentColorLabel}>Selected Color</Text>
            <TextInput
              style={styles.colorInput}
              value={selectedColor}
              onChangeText={onColorChange}
              placeholder="#000000"
              placeholderTextColor={THEME_COLORS.text.tertiary}
            />
          </View>
        </View>
      </View>

      {/* Preset Colors Grid */}
      <View style={styles.presetsSection}>
        <Text style={styles.sectionLabel}>Preset Colors</Text>
        <View style={styles.presetsGrid}>
          {presetColors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.presetSwatch,
                selectedColor === color && styles.presetSwatchActive,
              ]}
              onPress={() => onColorChange(color)}
            >
              <View style={[styles.presetColor, { backgroundColor: color }]}>
                {selectedColor === color && (
                  <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Sliders (HSV) */}
      <View style={styles.slidersSection}>
        <Text style={styles.sectionLabel}>Adjust Color</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Hue</Text>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderThumb, { left: '50%' }]} />
          </View>
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Saturation</Text>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderThumb, { left: '70%' }]} />
          </View>
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Value</Text>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderThumb, { left: '80%' }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  currentColorSection: {
    gap: 12,
  },
  currentColorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  currentColorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME_COLORS.background.tertiary,
  },
  currentColorInfo: {
    flex: 1,
    gap: 6,
  },
  currentColorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME_COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorInput: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    fontFamily: 'monospace',
  },
  presetsSection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME_COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetSwatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    padding: 4,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  presetSwatchActive: {
    backgroundColor: THEME_COLORS.accent.blue + '20',
    borderWidth: 2,
    borderColor: THEME_COLORS.accent.blue,
    padding: 2,
  },
  presetColor: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME_COLORS.background.tertiary,
  },
  slidersSection: {
    gap: 12,
  },
  sliderRow: {
    gap: 8,
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME_COLORS.text.secondary,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLORS.background.secondary,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.accent.blue,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default ColorPicker;

