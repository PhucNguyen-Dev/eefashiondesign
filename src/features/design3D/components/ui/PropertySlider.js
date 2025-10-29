import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const PropertySlider = ({ label, value, onValueChange, icon, min = 0, max = 1 }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handlePress = (event) => {
    // Simple click-to-set value (in real implementation, use PanResponder)
    const newValue = min + (max - min) * 0.5;
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons name={icon} size={16} color={THEME_COLORS.text.secondary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>{Math.round(value * 100)}%</Text>
      </View>

      <TouchableOpacity
        style={styles.sliderContainer}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
          <View style={[styles.thumb, { left: `${percentage}%` }]} />
        </View>
      </TouchableOpacity>

      <View style={styles.markers}>
        <Text style={styles.markerText}>0%</Text>
        <Text style={styles.markerText}>25%</Text>
        <Text style={styles.markerText}>50%</Text>
        <Text style={styles.markerText}>75%</Text>
        <Text style={styles.markerText}>100%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLORS.accent.blue,
    fontFamily: 'monospace',
  },
  sliderContainer: {
    paddingVertical: 8,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLORS.background.secondary,
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: THEME_COLORS.accent.blue,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME_COLORS.accent.blue,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  markerText: {
    fontSize: 10,
    color: THEME_COLORS.text.tertiary,
  },
});

export default PropertySlider;

