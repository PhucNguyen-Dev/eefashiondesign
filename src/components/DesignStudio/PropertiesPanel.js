import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Slider,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/constants';

const PropertySlider = ({ label, value, onValueChange, min = 0, max = 100, icon }) => (
  <View style={styles.propertyItem}>
    <View style={styles.propertyHeader}>
      <View style={styles.propertyLabel}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={16}
            color={COLORS.textSecondary}
            style={styles.propertyIcon}
          />
        )}
        <Text style={styles.propertyLabelText}>{label}</Text>
      </View>
      <Text style={styles.propertyValue}>{Math.round(value)}</Text>
    </View>
    <Slider
      style={styles.slider}
      value={value}
      onValueChange={onValueChange}
      minimumValue={min}
      maximumValue={max}
      minimumTrackTintColor={COLORS.primary}
      maximumTrackTintColor={COLORS.border}
      thumbTintColor={COLORS.primary}
    />
  </View>
);

const ColorOption = ({ color, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.colorOption,
      { backgroundColor: color },
      isSelected && styles.colorOptionSelected,
    ]}
    onPress={() => onSelect(color)}
    activeOpacity={0.7}
  >
    {isSelected && (
      <MaterialCommunityIcons name="check" size={16} color="#fff" />
    )}
  </TouchableOpacity>
);

const PropertiesPanel = ({ selectedElement, onUpdateProperty }) => {
  if (!selectedElement) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="selection-off"
            size={48}
            color={COLORS.textTertiary}
          />
          <Text style={styles.emptyText}>No element selected</Text>
          <Text style={styles.emptySubtext}>
            Select an element to edit its properties
          </Text>
        </View>
      </View>
    );
  }

  const commonColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#6C63FF',
    '#FFD93D',
    '#A8E6CF',
    '#FF8B94',
    '#C7CEEA',
    '#000000',
    '#FFFFFF',
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Properties</Text>
          <Text style={styles.elementType}>{selectedElement.type}</Text>
        </View>

        {/* Position */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position</Text>
          <PropertySlider
            label="X"
            value={selectedElement.x || 0}
            onValueChange={(value) => onUpdateProperty('x', value)}
            max={800}
            icon="axis-x-arrow"
          />
          <PropertySlider
            label="Y"
            value={selectedElement.y || 0}
            onValueChange={(value) => onUpdateProperty('y', value)}
            max={1000}
            icon="axis-y-arrow"
          />
        </View>

        {/* Size */}
        {selectedElement.type !== 'text' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size</Text>
            <PropertySlider
              label="Width"
              value={selectedElement.width || 100}
              onValueChange={(value) => onUpdateProperty('width', value)}
              max={800}
              icon="arrow-expand-horizontal"
            />
            <PropertySlider
              label="Height"
              value={selectedElement.height || 100}
              onValueChange={(value) => onUpdateProperty('height', value)}
              max={1000}
              icon="arrow-expand-vertical"
            />
          </View>
        )}

        {/* Rotation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transform</Text>
          <PropertySlider
            label="Rotation"
            value={selectedElement.rotation || 0}
            onValueChange={(value) => onUpdateProperty('rotation', value)}
            min={0}
            max={360}
            icon="rotate-right"
          />
          <PropertySlider
            label="Opacity"
            value={(selectedElement.opacity || 1) * 100}
            onValueChange={(value) => onUpdateProperty('opacity', value / 100)}
            min={0}
            max={100}
            icon="opacity"
          />
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorGrid}>
            {commonColors.map((color) => (
              <ColorOption
                key={color}
                color={color}
                isSelected={selectedElement.color === color}
                onSelect={(color) => onUpdateProperty('color', color)}
              />
            ))}
          </View>
        </View>

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Text</Text>
            <PropertySlider
              label="Font Size"
              value={selectedElement.fontSize || 16}
              onValueChange={(value) => onUpdateProperty('fontSize', value)}
              min={8}
              max={72}
              icon="format-size"
            />
          </View>
        )}

        {/* Stroke */}
        {selectedElement.type !== 'text' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stroke</Text>
            <PropertySlider
              label="Width"
              value={selectedElement.strokeWidth || 0}
              onValueChange={(value) => onUpdateProperty('strokeWidth', value)}
              min={0}
              max={20}
              icon="border-outside"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    maxHeight: 500,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  elementType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  propertyItem: {
    marginBottom: SPACING.md,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  propertyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyIcon: {
    marginRight: SPACING.xs,
  },
  propertyLabelText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  propertyValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default PropertiesPanel;
