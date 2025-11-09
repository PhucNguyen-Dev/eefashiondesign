import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colorHistoryService from '../services/colorHistoryService';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from './tamagui';
import { Text } from './tamagui';

const { width } = Dimensions.get('window');

// Styled components using Tamagui
const Container = styled(YStack, {
  backgroundColor: '$bgCard',
  borderRadius: 20,
  padding: 20,
});

const Tabs = styled(XStack, {
  marginBottom: 20,
});

const Tab = styled(Stack, {
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  variants: {
    active: {
      true: {
        borderBottomColor: '$primary',
      },
    },
  } as const,
});

const TabText = styled(Text, {
  color: '$textSecondary',
  fontSize: 14,
  variants: {
    active: {
      true: {
        color: '$primary',
        fontWeight: 'bold',
      },
    },
  } as const,
});

const CurrentColorContainer = styled(XStack, {
  alignItems: 'center',
  marginBottom: 20,
  padding: 15,
  backgroundColor: '$bgInput',
  borderRadius: 15,
});

const CurrentColor = styled(Stack, {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 15,
  borderWidth: 3,
  borderColor: '$textPrimary',
});

const ColorInfo = styled(YStack, {
  flex: 1,
});

const ColorLabel = styled(Text, {
  color: '$textSecondary',
  fontSize: 12,
  marginBottom: 5,
});

const ColorValue = styled(Text, {
  color: '$textPrimary',
  fontSize: 18,
  fontWeight: 'bold',
});

const PaletteContainer = styled(YStack, {
  marginBottom: 20,
});

const ColorRow = styled(XStack, {
  justifyContent: 'space-between',
  marginBottom: 10,
});

const ColorSwatch = styled(Stack, {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '$bgInput',
});

const CustomContainer = styled(YStack, {
  marginBottom: 20,
});

const SliderContainer = styled(YStack, {
  marginBottom: 20,
});

const SliderLabel = styled(Text, {
  color: '$textPrimary',
  fontSize: 14,
  marginBottom: 10,
});

const Slider = styled(Stack, {
  height: 40,
  position: 'relative',
});

const HueSlider = styled(Stack, {
  height: 40,
  position: 'relative',
});

const HueGradient = styled(Stack, {
  height: 40,
  borderRadius: 20,
});

const SliderTrack = styled(Stack, {
  height: 40,
  borderRadius: 20,
});

const SliderThumb = styled(Stack, {
  position: 'absolute',
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '$textPrimary',
  top: 5,
  borderWidth: 3,
  borderColor: '$primary',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
});

const GradientContainer = styled(Stack, {
  maxHeight: 200,
});

const GradientOption = styled(YStack, {
  marginBottom: 15,
});

const GradientPreview = styled(Stack, {
  height: 50,
  borderRadius: 15,
  marginBottom: 5,
});

const GradientName = styled(Text, {
  color: '$textPrimary',
  fontSize: 14,
  textAlign: 'center',
});

const RecentContainer = styled(YStack, {
  marginTop: 20,
});

const RecentLabel = styled(Text, {
  color: '$textSecondary',
  fontSize: 12,
  marginBottom: 10,
});

const RecentColor = styled(Stack, {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
  borderWidth: 2,
  borderColor: '$bgInput',
  justifyContent: 'center',
  alignItems: 'center',
});

const EmptyText = styled(Text, {
  color: '$textTertiary',
  fontSize: 12,
  fontStyle: 'italic',
});

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
  const [selectedTab, setSelectedTab] = useState('palette');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
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

  const handleColorSelect = async (color: string, shouldPersist = true) => {
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
        updateColorPreview(newHue, saturation, brightness);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newHue = Math.max(0, Math.min(360, (gestureState.moveX / width) * 360));
        finalizeColorSelection(newHue, saturation, brightness);
        setIsDragging(false);
      },
    })
  ).current;

  const updateColorPreview = (h: number, s: number, b: number) => {
    // Convert HSB to RGB and update color preview without saving to history
    const rgb = hsbToRgb(h, s / 100, b / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(hex);
  };

  const finalizeColorSelection = async (h: number, s: number, b: number) => {
    const rgb = hsbToRgb(h, s / 100, b / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    await handleColorSelect(hex, true);
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

  const hsbToRgb = (h: number, s: number, b: number) => {
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

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  return (
    <Container>
      {/* Tabs */}
      <Tabs>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setSelectedTab('palette')}
        >
          <Tab active={selectedTab === 'palette'}>
            <TabText active={selectedTab === 'palette'}>
              Palette
            </TabText>
          </Tab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setSelectedTab('custom')}
        >
          <Tab active={selectedTab === 'custom'}>
            <TabText active={selectedTab === 'custom'}>
              Custom
            </TabText>
          </Tab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setSelectedTab('gradient')}
        >
          <Tab active={selectedTab === 'gradient'}>
            <TabText active={selectedTab === 'gradient'}>
              Gradient
            </TabText>
          </Tab>
        </TouchableOpacity>
      </Tabs>

      {/* Current Color Display */}
      <CurrentColorContainer>
        <CurrentColor style={{ backgroundColor: currentColor }} />
        <ColorInfo>
          <ColorLabel>Selected Color</ColorLabel>
          <ColorValue>{currentColor.toUpperCase()}</ColorValue>
        </ColorInfo>
      </CurrentColorContainer>

      {/* Palette Tab */}
      {selectedTab === 'palette' && (
        <PaletteContainer>
          {presetColors.map((row, rowIndex) => (
            <ColorRow key={rowIndex}>
              {row.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => handleColorSelect(color)}
                  activeOpacity={0.7}
                >
                  <ColorSwatch style={{ backgroundColor: color }}>
                    {currentColor === color && (
                      <MaterialCommunityIcons name="check" size={20} color="#fff" />
                    )}
                  </ColorSwatch>
                </TouchableOpacity>
              ))}
            </ColorRow>
          ))}
        </PaletteContainer>
      )}

      {/* Custom Tab */}
      {selectedTab === 'custom' && (
        <CustomContainer>
          {/* Hue Slider */}
          <SliderContainer>
            <SliderLabel>Hue</SliderLabel>
            <HueSlider {...hueSliderPan.panHandlers}>
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
                style={{ height: 40, borderRadius: 20 }}
              />
              <SliderThumb
                style={{
                  left: (hue / 360) * (width - 60),
                }}
              />
            </HueSlider>
          </SliderContainer>

          {/* Saturation Slider */}
          <SliderContainer>
            <SliderLabel>Saturation</SliderLabel>
            <Slider {...saturationSliderPan.panHandlers}>
              <LinearGradient
                colors={['#808080', currentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40, borderRadius: 20 }}
              />
              <SliderThumb
                style={{
                  left: (saturation / 100) * (width - 60),
                }}
              />
            </Slider>
          </SliderContainer>

          {/* Brightness Slider */}
          <SliderContainer>
            <SliderLabel>Brightness</SliderLabel>
            <Slider {...brightnessSliderPan.panHandlers}>
              <LinearGradient
                colors={['#000000', currentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40, borderRadius: 20 }}
              />
              <SliderThumb
                style={{
                  left: (brightness / 100) * (width - 60),
                }}
              />
            </Slider>
          </SliderContainer>
        </CustomContainer>
      )}

      {/* Gradient Tab */}
      {selectedTab === 'gradient' && (
        <ScrollView style={{ maxHeight: 200 }}>
          <GradientContainer>
            {gradients.map((gradient, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleColorSelect(gradient.colors[0])}
              >
                <GradientOption>
                  <LinearGradient
                    colors={gradient.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 50, borderRadius: 15, marginBottom: 5 }}
                  />
                  <GradientName>{gradient.name}</GradientName>
                </GradientOption>
              </TouchableOpacity>
            ))}
          </GradientContainer>
        </ScrollView>
      )}

      {/* Recent Colors */}
      <RecentContainer>
        <RecentLabel>Recent Colors</RecentLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentColors.length > 0 ? (
            recentColors.map((color, index) => (
              <TouchableOpacity
                key={`${color}-${index}`}
                onPress={() => handleColorSelect(color)}
              >
                <RecentColor style={{ backgroundColor: color }}>
                  {currentColor === color && (
                    <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  )}
                </RecentColor>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyText>No recent colors yet</EmptyText>
          )}
        </ScrollView>
      </RecentContainer>
    </Container>
  );
};

export default ColorPicker;
