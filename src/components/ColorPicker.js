import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colorHistoryService from '../services/colorHistoryService';

const { width } = Dimensions.get('window');

const ColorPicker = ({ currentColor, onColorChange }) => {
  const [selectedTab, setSelectedTab] = useState('palette');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [recentColors, setRecentColors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const presetColors = [
    ['#FF6B6B', '#4ECDC4', '#6C63FF', '#FFD93D', '#A8E6CF'],
    ['#FF8B94', '#FFD3B6', '#FFAAA5', '#C7CEEA', '#B2E1D4'],
    ['#000000', '#333333', '#666666', '#999999', '#FFFFFF'],
    ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#FFE4B5'],
    ['#800020', '#DC143C', '#FF1493', '#FF69B4', '#FFC0CB'],
  ];

  const gradients = [
    { colors: ['#6C63FF', '#4ECDC4'], name: 'Ocean' },
    { colors: ['#FF6B6B', '#FFD93D'], name: 'Sunset' },
    { colors: ['#A8E6CF', '#DCEDC1'], name: 'Nature' },
    { colors: ['#FFD3B6', '#FF8B94'], name: 'Peach' },
    { colors: ['#C7CEEA', '#B2E1D4'], name: 'Pastel' },
  ];

  // Load recent colors from history on mount
  useEffect(() => {
    loadRecentColors();
  }, []);

  const loadRecentColors = async () => {
    const colors = await colorHistoryService.getRecentColors(10);
    setRecentColors(colors);
  };

  const handleColorSelect = async (color, shouldPersist = true) => {
    onColorChange(color);
    if (shouldPersist) {
      await colorHistoryService.addColor(color);
      await loadRecentColors();
    }
  };

  const hueSliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHue = Math.max(0, Math.min(360, (gestureState.moveX / width) * 360));
        setHue(newHue);
        updateColor(newHue, saturation, brightness, false);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newHue = Math.max(0, Math.min(360, (gestureState.moveX / width) * 360));
        setHue(newHue);
        updateColor(newHue, saturation, brightness, true);
        setIsDragging(false);
      },
    })
  ).current;

  const updateColor = async (h, s, b, shouldPersist = true) => {
    // Convert HSB to RGB
  const updateColorPreview = (h, s, b) => {
    // Convert HSB to RGB and update color preview without saving to history
    const rgb = hsbToRgb(h, s / 100, b / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(hex);
  };

  const finalizeColorSelection = async (h, s, b) => {
    const rgb = hsbToRgb(h, s / 100, b / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    await handleColorSelect(hex, shouldPersist);
  };

  const saturationSliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newSaturation = Math.max(0, Math.min(100, (gestureState.moveX / (width - 60)) * 100));
        setSaturation(newSaturation);
        updateColorPreview(hue, newSaturation, brightness);
      },
      onPanResponderRelease: () => {
        finalizeColorSelection(hue, saturation, brightness);
      },
    })
  ).current;

  const brightnessSliderPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newBrightness = Math.max(0, Math.min(100, (gestureState.moveX / (width - 60)) * 100));
        setBrightness(newBrightness);
        updateColorPreview(hue, saturation, newBrightness);
      },
      onPanResponderRelease: () => {
        finalizeColorSelection(hue, saturation, brightness);
      },
    })
  ).current;

  const hsbToRgb = (h, s, b) => {
    const c = b * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = b - c;
    let r, g, b2;

    if (h >= 0 && h < 60) {
      [r, g, b2] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b2] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b2] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b2] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b2] = [x, 0, c];
    } else {
      [r, g, b2] = [c, 0, x];
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b2 + m) * 255),
    };
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'palette' && styles.activeTab]}
          onPress={() => setSelectedTab('palette')}
        >
          <Text style={[styles.tabText, selectedTab === 'palette' && styles.activeTabText]}>
            Palette
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'custom' && styles.activeTab]}
          onPress={() => setSelectedTab('custom')}
        >
          <Text style={[styles.tabText, selectedTab === 'custom' && styles.activeTabText]}>
            Custom
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'gradient' && styles.activeTab]}
          onPress={() => setSelectedTab('gradient')}
        >
          <Text style={[styles.tabText, selectedTab === 'gradient' && styles.activeTabText]}>
            Gradient
          </Text>
        </TouchableOpacity>
      </View>

      {/* Current Color Display */}
      <View style={styles.currentColorContainer}>
        <View style={[styles.currentColor, { backgroundColor: currentColor }]} />
        <View style={styles.colorInfo}>
          <Text style={styles.colorLabel}>Selected Color</Text>
          <Text style={styles.colorValue}>{currentColor.toUpperCase()}</Text>
        </View>
      </View>

      {/* Palette Tab */}
      {selectedTab === 'palette' && (
        <View style={styles.paletteContainer}>
          {presetColors.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.colorRow}>
              {row.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorSwatch, { backgroundColor: color }]}
                  onPress={() => handleColorSelect(color)}
                >
                  {currentColor === color && (
                    <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Custom Tab */}
      {selectedTab === 'custom' && (
        <View style={styles.customContainer}>
          {/* Hue Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Hue</Text>
            <View style={styles.hueSlider} {...hueSliderPan.panHandlers}>
              <LinearGradient
                colors={[
                  '#FF0000',
                  '#FFFF00',
                  '#00FF00',
                  '#00FFFF',
                  '#0000FF',
                  '#FF00FF',
                  '#FF0000',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.hueGradient}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: (hue / 360) * (width - 60) },
                ]}
              />
            </View>
          </View>

          {/* Saturation Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Saturation</Text>
            <View style={styles.slider} {...saturationSliderPan.panHandlers}>
              <LinearGradient
                colors={['#808080', currentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sliderTrack}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: (saturation / 100) * (width - 60) },
                ]}
              />
            </View>
          </View>

          {/* Brightness Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Brightness</Text>
            <View style={styles.slider} {...brightnessSliderPan.panHandlers}>
              <LinearGradient
                colors={['#000000', currentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sliderTrack}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: (brightness / 100) * (width - 60) },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Gradient Tab */}
      {selectedTab === 'gradient' && (
        <ScrollView style={styles.gradientContainer}>
          {gradients.map((gradient, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gradientOption}
              onPress={() => handleColorSelect(gradient.colors[0])}
            >
              <LinearGradient
                colors={gradient.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientPreview}
              />
              <Text style={styles.gradientName}>{gradient.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Recent Colors */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentLabel}>Recent Colors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentColors.length > 0 ? (
            recentColors.map((color, index) => (
              <TouchableOpacity
                key={`${color}-${index}`}
                style={[styles.recentColor, { backgroundColor: color }]}
                onPress={() => handleColorSelect(color)}
              >
                {currentColor === color && (
                  <MaterialCommunityIcons name="check" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent colors yet</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6C63FF',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
  },
  activeTabText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  currentColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2A2A3E',
    borderRadius: 15,
  },
  currentColor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#fff',
  },
  colorInfo: {
    flex: 1,
  },
  colorLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  colorValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paletteContainer: {
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A2A3E',
  },
  customContainer: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  slider: {
    height: 40,
    position: 'relative',
  },
  hueSlider: {
    height: 40,
    position: 'relative',
  },
  hueGradient: {
    height: 40,
    borderRadius: 20,
  },
  sliderTrack: {
    height: 40,
    borderRadius: 20,
  },
  sliderThumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    top: 5,
    borderWidth: 3,
    borderColor: '#6C63FF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientContainer: {
    maxHeight: 200,
  },
  gradientOption: {
    marginBottom: 15,
  },
  gradientPreview: {
    height: 50,
    borderRadius: 15,
    marginBottom: 5,
  },
  gradientName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  recentContainer: {
    marginTop: 20,
  },
  recentLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  recentColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#2A2A3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default ColorPicker;
