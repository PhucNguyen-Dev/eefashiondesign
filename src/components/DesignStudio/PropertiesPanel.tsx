import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  // @ts-ignore - Slider exists in React Native but TypeScript types may not include it
  Slider,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/constants';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from '../tamagui';
import { Text } from '../tamagui';

// Styled components using Tamagui
const Container = styled(YStack, {
  backgroundColor: '$bgCard',
  borderRadius: '$lg',
  padding: '$md',
  maxHeight: 500,
});

const Header = styled(YStack, {
  marginBottom: '$lg',
});

const Title = styled(Text, {
  fontSize: '$lg',
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: '$xs',
});

const ElementType = styled(Text, {
  fontSize: '$sm',
  color: '$textSecondary',
  textTransform: 'capitalize',
});

const Section = styled(YStack, {
  marginBottom: '$lg',
});

const SectionTitle = styled(Text, {
  fontSize: '$md',
  fontWeight: '600',
  color: '$textPrimary',
  marginBottom: '$sm',
});

const PropertyItem = styled(YStack, {
  marginBottom: '$md',
});

const PropertyHeader = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$xs',
});

const PropertyLabel = styled(XStack, {
  alignItems: 'center',
});

const PropertyIcon = styled(Stack, {
  marginRight: '$xs',
});

const PropertyLabelText = styled(Text, {
  fontSize: '$sm',
  color: '$textSecondary',
});

const PropertyValue = styled(Text, {
  fontSize: '$sm',
  fontWeight: 'bold',
  color: '$primary',
});

const SliderWrapper = styled(Stack, {
  width: '100%',
  height: 40,
});

const ColorGrid = styled(XStack, {
  flexWrap: 'wrap',
  marginTop: '$xs',
});

const ColorOption = styled(Stack, {
  width: 40,
  height: 40,
  borderRadius: '$md',
  marginRight: '$sm',
  marginBottom: '$sm',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    selected: {
      true: {
        borderColor: '$textPrimary',
      },
    },
  } as const,
});

const EmptyState = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: '$xxl',
});

const EmptyText = styled(Text, {
  fontSize: '$lg',
  fontWeight: 'bold',
  color: '$textSecondary',
  marginTop: '$md',
});

const EmptySubtext = styled(Text, {
  fontSize: '$sm',
  color: '$textTertiary',
  marginTop: '$xs',
  textAlign: 'center',
});

interface PropertySliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: string;
}

const PropertySlider: React.FC<PropertySliderProps> = ({ label, value, onValueChange, min = 0, max = 100, icon }) => (
  <PropertyItem>
    <PropertyHeader>
      <PropertyLabel>
        {icon && (
          <PropertyIcon>
            <MaterialCommunityIcons
              name={icon}
              size={16}
              color={COLORS.textSecondary}
            />
          </PropertyIcon>
        )}
        <PropertyLabelText>{label}</PropertyLabelText>
      </PropertyLabel>
      <PropertyValue>{Math.round(value)}</PropertyValue>
    </PropertyHeader>
    <SliderWrapper>
      <Slider
        style={{ width: '100%', height: 40 }}
        value={value}
        onValueChange={onValueChange}
        minimumValue={min}
        maximumValue={max}
        minimumTrackTintColor={COLORS.primary}
        maximumTrackTintColor={COLORS.border}
        thumbTintColor={COLORS.primary}
      />
    </SliderWrapper>
  </PropertyItem>
);

interface ColorOptionComponentProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

const ColorOptionComponent: React.FC<ColorOptionComponentProps> = ({ color, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(color)}
    activeOpacity={0.7}
  >
    <ColorOption
      selected={isSelected}
      style={{ backgroundColor: color }}
    >
      {isSelected && (
        <MaterialCommunityIcons name="check" size={16} color="#fff" />
      )}
    </ColorOption>
  </TouchableOpacity>
);

interface SelectedElement {
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  color?: string;
  fontSize?: number;
  strokeWidth?: number;
}

interface PropertiesPanelProps {
  selectedElement?: SelectedElement | null;
  onUpdateProperty: (property: string, value: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdateProperty }) => {
  if (!selectedElement) {
    return (
      <Container>
        <EmptyState>
          <MaterialCommunityIcons
            name="selection-off"
            size={48}
            color={COLORS.textTertiary}
          />
          <EmptyText>No element selected</EmptyText>
          <EmptySubtext>
            Select an element to edit its properties
          </EmptySubtext>
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
        </Section>

        {/* Size */}
        {selectedElement.type !== 'text' && (
          <Section>
            <SectionTitle>Size</SectionTitle>
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
          </Section>
        )}

        {/* Rotation */}
        <Section>
          <SectionTitle>Transform</SectionTitle>
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
        </Section>

        {/* Color */}
        <Section>
          <SectionTitle>Color</SectionTitle>
          <ColorGrid>
            {commonColors.map((color) => (
              <ColorOptionComponent
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
            <PropertySlider
              label="Font Size"
              value={selectedElement.fontSize || 16}
              onValueChange={(value) => onUpdateProperty('fontSize', value)}
              min={8}
              max={72}
              icon="format-size"
            />
          </Section>
        )}

        {/* Stroke */}
        {selectedElement.type !== 'text' && (
          <Section>
            <SectionTitle>Stroke</SectionTitle>
            <PropertySlider
              label="Width"
              value={selectedElement.strokeWidth || 0}
              onValueChange={(value) => onUpdateProperty('strokeWidth', value)}
              min={0}
              max={20}
              icon="border-outside"
            />
          </Section>
        )}
      </ScrollView>
    </Container>
  );
};

export default PropertiesPanel;
