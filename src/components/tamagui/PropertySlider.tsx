import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface PropertySliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  min?: number;
  max?: number;
}

const Container = styled(YStack, {
  marginBottom: 20,
});

const Header = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});

const LabelContainer = styled(XStack, {
  alignItems: 'center',
  gap: 8,
});

const Label = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '$textPrimary',
});

const Value = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '700',
  color: '#4A90E2',
  fontFamily: 'monospace',
});

const SliderContainer = styled(TouchableOpacity, {
  paddingVertical: 8,
});

const Track = styled(Stack, {
  height: 8,
  borderRadius: 4,
  backgroundColor: '$bgSecondary',
  position: 'relative',
  overflow: 'hidden',
});

const Fill = styled(Stack, {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  backgroundColor: '#4A90E2',
  borderRadius: 4,
});

const Thumb = styled(Stack, {
  position: 'absolute',
  top: -6,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#4A90E2',
  borderWidth: 3,
  borderColor: '#FFFFFF',
  marginLeft: -10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});

const Markers = styled(XStack, {
  justifyContent: 'space-between',
  marginTop: 6,
});

const MarkerText = styled(TamaguiText, {
  fontSize: 10,
  color: '$textTertiary',
});

const PropertySlider: React.FC<PropertySliderProps> = ({ 
  label, 
  value, 
  onValueChange, 
  icon, 
  min = 0, 
  max = 1 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handlePress = () => {
    // Simple click-to-set value (in real implementation, use PanResponder)
    const newValue = min + (max - min) * 0.5;
    onValueChange(newValue);
  };

  return (
    <Container>
      <Header>
        <LabelContainer>
          <MaterialCommunityIcons name={icon} size={16} color="#B0B0C0" />
          <Label>{label}</Label>
        </LabelContainer>
        <Value>{Math.round(value * 100)}%</Value>
      </Header>

      <SliderContainer onPress={handlePress} activeOpacity={0.8}>
        <Track>
          <Fill style={{ width: `${percentage}%` }} />
          <Thumb style={{ left: `${percentage}%` }} />
        </Track>
      </SliderContainer>

      <Markers>
        <MarkerText>0%</MarkerText>
        <MarkerText>25%</MarkerText>
        <MarkerText>50%</MarkerText>
        <MarkerText>75%</MarkerText>
        <MarkerText>100%</MarkerText>
      </Markers>
    </Container>
  );
};

export default PropertySlider;
