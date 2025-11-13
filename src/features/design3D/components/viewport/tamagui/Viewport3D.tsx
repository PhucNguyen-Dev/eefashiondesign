import React, { useState } from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '@infrastructure/config/constants.js';

const Viewport3D = ({
  selectedGarment,
  selectedMaterial,
  selectedColor,
  viewOrientation,
  materialProps,
  isSimulating,
}: any) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const getGarmentIcon = (garment: string) => {
    const icons: any = {
      jumpsuit: 'human-handsup',
      dress: 'human-female-dance',
      shirt: 'tshirt-crew',
      pants: 'human-male',
      jacket: 'coat-rack',
    };
    return icons[garment] || 'hanger';
  };

  // Placeholder 3D scene
  const renderPlaceholder3D = () => {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center" position="relative">
        {/* Grid Background */}
        {showGrid && (
          <Stack position="absolute" top={0} left={0} right={0} bottom={0}>
            {Array.from({ length: 10 }, (_, i) => (
              <Stack
                key={`h-line-${i}`}
                position="absolute"
                width="100%"
                height={1}
                backgroundColor={THEME_COLORS.background.tertiary + '40'}
                top={`${i * 10}%`}
              />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <Stack
                key={`v-line-${i}`}
                position="absolute"
                width={1}
                height="100%"
                backgroundColor={THEME_COLORS.background.tertiary + '40'}
                left={`${i * 10}%`}
              />
            ))}
          </Stack>
        )}

        {/* 3D Model Placeholder */}
        <Stack alignItems="center" justifyContent="center" zIndex={1}>
          <LinearGradient
            colors={[selectedColor + '40', selectedColor + '10']}
            style={{
              width: 200,
              height: 300,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              borderWidth: 2,
              borderColor: THEME_COLORS.background.tertiary,
            }}
          >
            <MaterialCommunityIcons
              name={getGarmentIcon(selectedGarment)}
              size={120}
              color={selectedColor}
            />
          </LinearGradient>

          {/* Model Info */}
          <Stack marginTop={20} alignItems="center">
            <TamaguiText fontSize={18} fontWeight="700" color={THEME_COLORS.text.primary}>
              {selectedGarment.toUpperCase()}
            </TamaguiText>
            <TamaguiText fontSize={14} color={THEME_COLORS.text.secondary}>
              {selectedMaterial} Material
            </TamaguiText>
            <TamaguiText fontSize={12} color={THEME_COLORS.text.tertiary}>
              View: {viewOrientation}
            </TamaguiText>
          </Stack>
        </Stack>

        {/* Axis Helper */}
        {showAxis && (
          <Stack position="absolute" bottom={20} left={20}>
            <Stack flexDirection="row" alignItems="center" marginBottom={8}>
              <Stack width={30} height={2} backgroundColor="#FF0000" marginRight={6} />
              <TamaguiText fontSize={12} fontWeight="700" color="#FF0000">X</TamaguiText>
            </Stack>
            <Stack flexDirection="row" alignItems="center" marginBottom={8}>
              <Stack width={30} height={2} backgroundColor="#00FF00" marginRight={6} />
              <TamaguiText fontSize={12} fontWeight="700" color="#00FF00">Y</TamaguiText>
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              <Stack width={30} height={2} backgroundColor="#0000FF" marginRight={6} />
              <TamaguiText fontSize={12} fontWeight="700" color="#0000FF">Z</TamaguiText>
            </Stack>
          </Stack>
        )}

        {/* Simulation Indicator */}
        {isSimulating && (
          <Stack position="absolute" top={20} left={20} borderRadius={8} overflow="hidden">
            <LinearGradient
              colors={[THEME_COLORS.accent.coral, THEME_COLORS.accent.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 }}
            >
              <MaterialCommunityIcons name="play" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <TamaguiText fontSize={13} fontWeight="600" color="#FFFFFF">
                Physics Simulation Active
              </TamaguiText>
            </LinearGradient>
          </Stack>
        )}

        {/* 3D Engine Placeholder Notice */}
        <Stack position="absolute" bottom={80} alignItems="center">
          <MaterialCommunityIcons name="cube-outline" size={24} color={THEME_COLORS.text.tertiary} />
          <TamaguiText fontSize={14} fontWeight="600" color={THEME_COLORS.text.tertiary} marginTop={6}>
            3D Engine Placeholder
          </TamaguiText>
          <TamaguiText fontSize={12} color={THEME_COLORS.text.tertiary + '80'} marginTop={6}>
            React Three Fiber will be integrated here
          </TamaguiText>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack flex={1} position="relative">
      {/* Viewport Controls */}
      <Stack position="absolute" top={16} right={16} flexDirection="row" zIndex={10}>
        <TouchableOpacity onPress={() => setShowGrid(!showGrid)}>
          <Stack
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius={8}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <MaterialCommunityIcons
              name="grid"
              size={18}
              color={showGrid ? THEME_COLORS.accent.blue : THEME_COLORS.text.secondary}
            />
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowAxis(!showAxis)}>
          <Stack
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius={8}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <MaterialCommunityIcons
              name="axis-arrow"
              size={18}
              color={showAxis ? THEME_COLORS.accent.blue : THEME_COLORS.text.secondary}
            />
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity>
          <Stack
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius={8}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <MaterialCommunityIcons name="fullscreen" size={18} color={THEME_COLORS.text.secondary} />
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity>
          <Stack
            width={40}
            height={40}
            alignItems="center"
            justifyContent="center"
            borderRadius={8}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
          >
            <MaterialCommunityIcons name="camera" size={18} color={THEME_COLORS.text.secondary} />
          </Stack>
        </TouchableOpacity>
      </Stack>

      {/* 3D Scene */}
      {renderPlaceholder3D()}

      {/* Rotation Controls */}
      <Stack position="absolute" bottom={16} right={16} flexDirection="row">
        <TouchableOpacity>
          <Stack
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            borderRadius={10}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <Ionicons name="arrow-back" size={20} color={THEME_COLORS.text.primary} />
          </Stack>
        </TouchableOpacity>
        <TouchableOpacity>
          <Stack
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            borderRadius={10}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <Ionicons name="arrow-forward" size={20} color={THEME_COLORS.text.primary} />
          </Stack>
        </TouchableOpacity>
        <TouchableOpacity>
          <Stack
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            borderRadius={10}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
            marginRight={8}
          >
            <Ionicons name="arrow-up" size={20} color={THEME_COLORS.text.primary} />
          </Stack>
        </TouchableOpacity>
        <TouchableOpacity>
          <Stack
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            borderRadius={10}
            backgroundColor={THEME_COLORS.background.primary + 'CC'}
          >
            <Ionicons name="arrow-down" size={20} color={THEME_COLORS.text.primary} />
          </Stack>
        </TouchableOpacity>
      </Stack>
    </Stack>
  );
};

export default Viewport3D;
