import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const Viewport3D = ({
  selectedGarment,
  selectedMaterial,
  selectedColor,
  viewOrientation,
  materialProps,
  isSimulating,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  // Placeholder 3D scene
  // In the future, this will be replaced with React Three Fiber
  const renderPlaceholder3D = () => {
    return (
      <View style={styles.placeholder3D}>
        {/* Grid Background */}
        {showGrid && (
          <View style={styles.gridContainer}>
            {[...Array(10)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, styles.gridLineHorizontal, { top: `${i * 10}%` }]} />
            ))}
            {[...Array(10)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLine, styles.gridLineVertical, { left: `${i * 10}%` }]} />
            ))}
          </View>
        )}

        {/* 3D Model Placeholder */}
        <View style={styles.modelPlaceholder}>
          <LinearGradient
            colors={[selectedColor + '40', selectedColor + '10']}
            style={styles.modelGradient}
          >
            <MaterialCommunityIcons
              name={getGarmentIcon(selectedGarment)}
              size={120}
              color={selectedColor}
            />
          </LinearGradient>

          {/* Model Info */}
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>{selectedGarment.toUpperCase()}</Text>
            <Text style={styles.modelMaterial}>{selectedMaterial} Material</Text>
            <Text style={styles.modelOrientation}>View: {viewOrientation}</Text>
          </View>
        </View>

        {/* Axis Helper */}
        {showAxis && (
          <View style={styles.axisHelper}>
            <View style={styles.axisX}>
              <View style={[styles.axisLine, { backgroundColor: '#FF0000' }]} />
              <Text style={[styles.axisLabel, { color: '#FF0000' }]}>X</Text>
            </View>
            <View style={styles.axisY}>
              <View style={[styles.axisLine, { backgroundColor: '#00FF00' }]} />
              <Text style={[styles.axisLabel, { color: '#00FF00' }]}>Y</Text>
            </View>
            <View style={styles.axisZ}>
              <View style={[styles.axisLine, { backgroundColor: '#0000FF' }]} />
              <Text style={[styles.axisLabel, { color: '#0000FF' }]}>Z</Text>
            </View>
          </View>
        )}

        {/* Simulation Indicator */}
        {isSimulating && (
          <View style={styles.simulationIndicator}>
            <LinearGradient
              colors={[THEME_COLORS.accent.coral, THEME_COLORS.accent.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.simulationGradient}
            >
              <MaterialCommunityIcons name="play" size={16} color="#FFFFFF" />
              <Text style={styles.simulationText}>Physics Simulation Active</Text>
            </LinearGradient>
          </View>
        )}

        {/* 3D Engine Placeholder Notice */}
        <View style={styles.placeholderNotice}>
          <MaterialCommunityIcons name="cube-outline" size={24} color={THEME_COLORS.text.tertiary} />
          <Text style={styles.placeholderText}>3D Engine Placeholder</Text>
          <Text style={styles.placeholderSubtext}>
            React Three Fiber will be integrated here
          </Text>
        </View>
      </View>
    );
  };

  const getGarmentIcon = (garment) => {
    const icons = {
      jumpsuit: 'human-handsup',
      dress: 'human-female-dance',
      shirt: 'tshirt-crew',
      pants: 'human-male',
      jacket: 'coat-rack',
    };
    return icons[garment] || 'hanger';
  };

  return (
    <View style={styles.viewport}>
      {/* Viewport Controls */}
      <View style={styles.viewportControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowGrid(!showGrid)}
        >
          <MaterialCommunityIcons
            name="grid"
            size={18}
            color={showGrid ? THEME_COLORS.accent.blue : THEME_COLORS.text.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowAxis(!showAxis)}
        >
          <MaterialCommunityIcons
            name="axis-arrow"
            size={18}
            color={showAxis ? THEME_COLORS.accent.blue : THEME_COLORS.text.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="fullscreen" size={18} color={THEME_COLORS.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="camera" size={18} color={THEME_COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* 3D Scene */}
      {renderPlaceholder3D()}

      {/* Rotation Controls */}
      <View style={styles.rotationControls}>
        <TouchableOpacity style={styles.rotationButton}>
          <Ionicons name="arrow-back" size={20} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rotationButton}>
          <Ionicons name="arrow-forward" size={20} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rotationButton}>
          <Ionicons name="arrow-up" size={20} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rotationButton}>
          <Ionicons name="arrow-down" size={20} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    position: 'relative',
  },
  viewportControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.primary + 'CC',
    backdropFilter: 'blur(10px)',
  },
  placeholder3D: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: THEME_COLORS.background.tertiary + '40',
  },
  gridLineHorizontal: {
    width: '100%',
    height: 1,
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
  },
  modelPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modelGradient: {
    width: 200,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: THEME_COLORS.background.tertiary,
  },
  modelInfo: {
    marginTop: 20,
    alignItems: 'center',
    gap: 4,
  },
  modelName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
  },
  modelMaterial: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
  },
  modelOrientation: {
    fontSize: 12,
    color: THEME_COLORS.text.tertiary,
  },
  axisHelper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    gap: 8,
  },
  axisX: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  axisY: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  axisZ: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  axisLine: {
    width: 30,
    height: 2,
  },
  axisLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  simulationIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  simulationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  simulationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderNotice: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    gap: 6,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.text.tertiary,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: THEME_COLORS.text.tertiary + '80',
  },
  rotationControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  rotationButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: THEME_COLORS.background.primary + 'CC',
    backdropFilter: 'blur(10px)',
  },
});

export default Viewport3D;

