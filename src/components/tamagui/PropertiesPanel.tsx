import React from 'react';
import { TouchableOpacity, ScrollView, Slider } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface Element {
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  color?: string;
  fontSize?: number;
  [key: string]: any;
}

interface PropertiesPanelProps {
  selectedElement?: Element | null;
  onUpdateProperty: (property: string, value: any) => void;
}

const Container = styled(YStack, {
  flex: 1,
  backgroundColor: '$bg',
  padding: 16,
});

const EmptyState = styled(YStack, {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
});

const EmptyText = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: '600',
  color: '$textSecondary',
  marginTop: 16,
  marginBottom: 8,
});

const EmptySubtext = styled(TamaguiText, {
  fontSize: 14,
  color: '$textTertiary',
  textAlign: 'center',
});

const Header = styled(YStack, {
  marginBottom: 24,
});

const Title = styled(TamaguiText, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 4,
});

const ElementType = styled(TamaguiText, {
  fontSize: 14,
  color: '$textSecondary',
  textTransform: 'capitalize',
});

const Section = styled(YStack, {
  marginBottom: 24,
});

const SectionTitle = styled(TamaguiText, {
  fontSize: 16,
  fontWeight: '600',
  color: '$textPrimary',
  marginBottom: 16,
});

const PropertyItem = styled(YStack, {
  marginBottom: 16,
});

const PropertyHeader = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
});

const PropertyLabel = styled(XStack, {
  alignItems: 'center',
  gap: 8,
});

const PropertyLabelText = styled(TamaguiText, {
  fontSize: 14,
  color: '$textSecondary',
});

const PropertyValue = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '$textPrimary',
});

const ColorGrid = styled(XStack, {
  flexWrap: 'wrap',
  gap: 12,
});

const ColorOptionButton = styled(TouchableOpacity, {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    selected: {
      true: {
        borderWidth: 3,
        borderColor: '#6C63FF',
      },
    },
  } as any,
});

const PropertySliderComponent: React.FC<{
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}> = ({ label, value, onValueChange, min = 0, max = 100, icon }) => (
  <PropertyItem>
    <PropertyHeader>
      <PropertyLabel>
        {icon && <MaterialCommunityIcons name={icon} size={16} color="#888" />}
        <PropertyLabelText>{label}</PropertyLabelText>
      </PropertyLabel>
      <PropertyValue>{Math.round(value)}</PropertyValue>
    </PropertyHeader>
    <Slider
      style={{ width: '100%', height: 40 }}
      value={value}
      onValueChange={onValueChange}
      minimumValue={min}
      maximumValue={max}
      minimumTrackTintColor="#6C63FF"
      maximumTrackTintColor="#E0E0E0"
      thumbTintColor="#6C63FF"
    />
  </PropertyItem>
);

const ColorOption: React.FC<{
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}> = ({ color, isSelected, onSelect }) => (
  <ColorOptionButton
    selected={isSelected}
    style={{ backgroundColor: color }}
    onPress={() => onSelect(color)}
    activeOpacity={0.7}
  >
    {isSelected && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
  </ColorOptionButton>
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdateProperty }) => {
  if (!selectedElement) {
    return (
      <Container>
        <EmptyState>
          <MaterialCommunityIcons name="selection-off" size={48} color="#CCCCCC" />
          <EmptyText>No element selected</EmptyText>
          <EmptySubtext>Select an element to edit its properties</EmptySubtext>
        </EmptyState>
      </Container>
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
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header>
          <Title>Properties</Title>
          <ElementType>{selectedElement.type}</ElementType>
        </Header>

        {/* Position */}
        <Section>
          <SectionTitle>Position</SectionTitle>
          <PropertySliderComponent
            label="X"
            value={selectedElement.x || 0}
            onValueChange={(value) => onUpdateProperty('x', value)}
            max={800}
            icon="axis-x-arrow"
          />
          <PropertySliderComponent
            label="Y"
            value={selectedElement.y || 0}
            onValueChange={(value) => onUpdateProperty('y', value)}
            max={1000}
            icon="axis-y-arrow"
          />
        </Section>

        {/* Size */}
        {selectedElement.type !== 'text' && (
          <Section>
            <SectionTitle>Size</SectionTitle>
            <PropertySliderComponent
              label="Width"
              value={selectedElement.width || 100}
              onValueChange={(value) => onUpdateProperty('width', value)}
              max={800}
              icon="arrow-expand-horizontal"
            />
            <PropertySliderComponent
              label="Height"
              value={selectedElement.height || 100}
              onValueChange={(value) => onUpdateProperty('height', value)}
              max={1000}
              icon="arrow-expand-vertical"
            />
          </Section>
        )}

        {/* Transform */}
        <Section>
          <SectionTitle>Transform</SectionTitle>
          <PropertySliderComponent
            label="Rotation"
            value={selectedElement.rotation || 0}
            onValueChange={(value) => onUpdateProperty('rotation', value)}
            min={0}
            max={360}
            icon="rotate-right"
          />
          <PropertySliderComponent
            label="Opacity"
            value={(selectedElement.opacity || 1) * 100}
            onValueChange={(value) => onUpdateProperty('opacity', value / 100)}
            min={0}
            max={100}
            icon="opacity"
          />
        </Section>

        {/* Color */}
        <Section>
          <SectionTitle>Color</SectionTitle>
          <ColorGrid>
            {commonColors.map((color) => (
              <ColorOption
                key={color}
                color={color}
                isSelected={selectedElement.color === color}
                onSelect={(color) => onUpdateProperty('color', color)}
              />
            ))}
          </ColorGrid>
        </Section>

        {/* Text Properties */}
        {selectedElement.type === 'text' && (
          <Section>
            <SectionTitle>Text</SectionTitle>
            <PropertySliderComponent
              label="Font Size"
              value={selectedElement.fontSize || 16}
              onValueChange={(value) => onUpdateProperty('fontSize', value)}
              min={12}
              max={72}
              icon="format-size"
            />
          </Section>
        )}
      </ScrollView>
    </Container>
  );
};

export default PropertiesPanel;
