import React, { useState, useEffect } from 'react';
import { styled, Stack, Text as TamaguiText } from '@tamagui/core';
import { ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { hsbToRgb, rgbToHex, hexToRgb, rgbToHsb } from '../../utils/helpers';
import colorHistoryService from '../../services/colorHistoryService';

const { width } = Dimensions.get('window');

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface ColorPickerProps {
  currentColor?: string;
  selectedColor?: string;
  onColorChange: (color: string) => void;
  showAdvanced?: boolean;
  showGradients?: boolean;
  showHistory?: boolean;
}

// Styled components using Tamagui
const Container = styled(YStack, {
  backgroundColor: '$bgCard',
  borderRadius: '$lg',
  padding: '$lg',
  gap: '$md',
});

const TabContainer = styled(XStack, {
  gap: '$sm',
  marginBottom: '$md',
});

const Tab = styled(TouchableOpacity, {
  flex: 1,
  paddingVertical: '$sm',
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
  variants: {
    active: {
      true: {
        borderBottomColor: '$primary',
      },
    },
  } as any,
});

const TabText = styled(TamaguiText, {
  fontSize: 14,
  color: '#8E8E93',
});

const TabTextActive = styled(TamaguiText, {
  fontSize: 14,
  color: '#6C63FF',
  fontWeight: 'bold',
});

const CurrentColorContainer = styled(XStack, {
  alignItems: 'center',
  gap: '$md',
  padding: '$md',
  backgroundColor: '$bgSecondary',
  borderRadius: '$md',
});

const ColorSwatch = styled(Stack, {
  width: 60,
  height: 60,
  borderRadius: '$lg',
  borderWidth: 3,
  borderColor: '$border',
});

const ColorInfo = styled(YStack, {
  flex: 1,
  gap: '$xs',
});

const ColorLabel = styled(TamaguiText, {
  fontSize: 12,
  color: '$textSecondary',
});

const ColorValue = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '$textPrimary',
});

const PaletteGrid = styled(YStack, {
  gap: '$sm',
});

const ColorRow = styled(XStack, {
  justifyContent: 'space-between',
  gap: '$sm',
});

const SwatchButton = styled(TouchableOpacity, {
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '$bgSecondary',
});

const SectionLabel = styled(TamaguiText, {
  fontSize: 12,
  fontWeight: '600',
  color: '$textSecondary',
  textTransform: 'uppercase',
  marginBottom: '$sm',
});

const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  selectedColor,
  onColorChange,
  showAdvanced = true,
  showGradients = true,
  showHistory = true,
}) => {
  const activeColor = currentColor || selectedColor || '#6C63FF';
  const [selectedTab, setSelectedTab] = useState('palette');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState(activeColor);

  // Preset color palettes
  const presetColors = [
    ['#FF6B6B', '#4ECDC4', '#6C63FF', '#FFD93D', '#A8E6CF'],
    ['#FF8B94', '#FFD3B6', '#FFAAA5', '#C7CEEA', '#B2E1D4'],
    ['#4A90E2', '#6C5CE7', '#00D9C0', '#F687B3', '#68D391'],
    ['#000000', '#333333', '#666666', '#999999', '#FFFFFF'],
    ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#FFE4B5'],
  ];

  const gradients = [
    { colors: ['#6C63FF', '#4ECDC4'], name: 'Ocean' },
    { colors: ['#FF6B6B', '#FFD93D'], name: 'Sunset' },
    { colors: ['#A8E6CF', '#DCEDC1'], name: 'Nature' },
    { colors: ['#FFD3B6', '#FF8B94'], name: 'Peach' },
    { colors: ['#C7CEEA', '#B2E1D4'], name: 'Pastel' },
  ];

  useEffect(() => {
    if (showHistory) {
      loadRecentColors();
    }
  }, [showHistory]);

  useEffect(() => {
    // Update HSB sliders when color changes externally
    const rgb = hexToRgb(activeColor);
    const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
    setHue(hsb.h);
    setSaturation(Math.round(hsb.s * 100));
    setBrightness(Math.round(hsb.b * 100));
    setHexInput(activeColor.toUpperCase());
  }, [activeColor]);

  const loadRecentColors = async () => {
    const colors = await colorHistoryService.getRecentColors(10);
    setRecentColors(colors);
  };

  const handleColorSelect = async (color: string, shouldPersist = true) => {
    onColorChange(color);
    if (shouldPersist && showHistory) {
      await colorHistoryService.addColor(color);
      await loadRecentColors();
    }
  };

  const handleHexInputChange = (text: string) => {
    setHexInput(text);
    // Validate and apply hex color
    if (/^#[0-9A-F]{6}$/i.test(text)) {
      handleColorSelect(text, false);
    }
  };

  const updateColorFromHSB = (h: number, s: number, b: number) => {
    const rgb = hsbToRgb(h, s / 100, b / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(hex);
  };

  const finalizeColorSelection = async () => {
    if (showHistory) {
      await colorHistoryService.addColor(activeColor);
      await loadRecentColors();
    }
  };

  return (
    <Container>
      {/* Tabs */}
      {(showAdvanced || showGradients) && (
        <TabContainer>
          <Tab onPress={() => setSelectedTab('palette')}>
            {selectedTab === 'palette' ? (
              <TabTextActive>Palette</TabTextActive>
            ) : (
              <TabText>Palette</TabText>
            )}
          </Tab>
          {showAdvanced && (
            <Tab onPress={() => setSelectedTab('custom')}>
              {selectedTab === 'custom' ? (
                <TabTextActive>Custom</TabTextActive>
              ) : (
                <TabText>Custom</TabText>
              )}
            </Tab>
          )}
          {showGradients && (
            <Tab onPress={() => setSelectedTab('gradient')}>
              {selectedTab === 'gradient' ? (
                <TabTextActive>Gradient</TabTextActive>
              ) : (
                <TabText>Gradient</TabText>
              )}
            </Tab>
          )}
        </TabContainer>
      )}

      {/* Current Color Display */}
      <CurrentColorContainer>
        <ColorSwatch style={{ backgroundColor: activeColor }} />
        <ColorInfo>
          <ColorLabel>Selected Color</ColorLabel>
          <TextInput
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'monospace',
            }}
            value={hexInput}
            onChangeText={handleHexInputChange}
            placeholder="#000000"
            placeholderTextColor="#888"
            autoCapitalize="characters"
          />
        </ColorInfo>
      </CurrentColorContainer>

      {/* Palette Tab */}
      {selectedTab === 'palette' && (
        <PaletteGrid>
          {presetColors.map((row, rowIndex) => (
            <ColorRow key={rowIndex}>
              {row.map((color) => (
                <SwatchButton
                  key={color}
                  style={{ backgroundColor: color }}
                  onPress={() => handleColorSelect(color)}
                >
                  {activeColor.toUpperCase() === color.toUpperCase() && (
                    <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
                  )}
                </SwatchButton>
              ))}
            </ColorRow>
          ))}
        </PaletteGrid>
      )}

      {/* Custom Tab - HSB Sliders */}
      {selectedTab === 'custom' && showAdvanced && (
        <YStack gap="$md">
          {/* Hue Slider */}
          <YStack gap="$sm">
            <ColorLabel>Hue: {hue}°</ColorLabel>
            <TouchableOpacity
              style={{ height: 40, position: 'relative' }}
              onPress={(e) => {
                const newHue = Math.max(0, Math.min(360, (e.nativeEvent.locationX / (width - 80)) * 360));
                setHue(Math.round(newHue));
                updateColorFromHSB(newHue, saturation, brightness);
              }}
              onPressIn={() => {}}
              onPressOut={() => finalizeColorSelection()}
            >
              <LinearGradient
                colors={['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40, borderRadius: 20 }}
              />
              <Stack
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#FFFFFF',
                  top: 5,
                  left: (hue / 360) * (width - 80),
                  borderWidth: 3,
                  borderColor: '#6C63FF',
                  elevation: 5,
                }}
              />
            </TouchableOpacity>
          </YStack>

          {/* Saturation Slider */}
          <YStack gap="$sm">
            <ColorLabel>Saturation: {saturation}%</ColorLabel>
            <TouchableOpacity
              style={{ height: 40, position: 'relative' }}
              onPress={(e) => {
                const newSat = Math.max(0, Math.min(100, (e.nativeEvent.locationX / (width - 80)) * 100));
                setSaturation(Math.round(newSat));
                updateColorFromHSB(hue, newSat, brightness);
              }}
              onPressOut={() => finalizeColorSelection()}
            >
              <LinearGradient
                colors={['#808080', activeColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40, borderRadius: 20 }}
              />
              <Stack
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#FFFFFF',
                  top: 5,
                  left: (saturation / 100) * (width - 80),
                  borderWidth: 3,
                  borderColor: '#6C63FF',
                  elevation: 5,
                }}
              />
            </TouchableOpacity>
          </YStack>

          {/* Brightness Slider */}
          <YStack gap="$sm">
            <ColorLabel>Brightness: {brightness}%</ColorLabel>
            <TouchableOpacity
              style={{ height: 40, position: 'relative' }}
              onPress={(e) => {
                const newBright = Math.max(0, Math.min(100, (e.nativeEvent.locationX / (width - 80)) * 100));
                setBrightness(Math.round(newBright));
                updateColorFromHSB(hue, saturation, newBright);
              }}
              onPressOut={() => finalizeColorSelection()}
            >
              <LinearGradient
                colors={['#000000', activeColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40, borderRadius: 20 }}
              />
              <Stack
                style={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#FFFFFF',
                  top: 5,
                  left: (brightness / 100) * (width - 80),
                  borderWidth: 3,
                  borderColor: '#6C63FF',
                  elevation: 5,
                }}
              />
            </TouchableOpacity>
          </YStack>
        </YStack>
      )}

      {/* Gradient Tab */}
      {selectedTab === 'gradient' && showGradients && (
        <ScrollView style={{ maxHeight: 250 }}>
          <YStack gap="$md">
            {gradients.map((gradient, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleColorSelect(gradient.colors[0])}
              >
                <YStack gap="$xs">
                  <LinearGradient
                    colors={gradient.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 50, borderRadius: 15 }}
                  />
                  <ColorLabel style={{ textAlign: 'center' }}>{gradient.name}</ColorLabel>
                </YStack>
              </TouchableOpacity>
            ))}
          </YStack>
        </ScrollView>
      )}

      {/* Recent Colors */}
      {showHistory && recentColors.length > 0 && (
        <YStack gap="$sm">
          <SectionLabel>Recent Colors</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$sm">
              {recentColors.map((color, index) => (
                <TouchableOpacity
                  key={`${color}-${index}`}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor: '#2A2A3E',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => handleColorSelect(color)}
                >
                  {activeColor.toUpperCase() === color.toUpperCase() && (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </XStack>
          </ScrollView>
        </YStack>
      )}
    </Container>
  );
};

export default ColorPicker;
