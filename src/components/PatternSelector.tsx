import React, { useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Rect, Line, Path, Pattern, Defs } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styled, Stack, XStack, YStack } from '@tamagui/core';
import { Text } from './tamagui';

const { width } = Dimensions.get('window');

// Styled components using Tamagui
const Container = styled(YStack, {
  flex: 1,
  maxHeight: 400,
});

const CategoryTabs = styled(XStack, {
  marginBottom: 20,
});

const CategoryTab = styled(Stack, {
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  backgroundColor: '$bgInput',
  borderRadius: 15,
  marginHorizontal: 5,
  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
      },
    },
  } as const,
});

const CategoryTabText = styled(Text, {
  color: '$textSecondary',
  fontSize: 14,
  variants: {
    active: {
      true: {
        color: '$textPrimary',
        fontWeight: 'bold',
      },
    },
  } as const,
});

const PatternGrid = styled(XStack, {
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const PatternCard = styled(YStack, {
  width: (width - 80) / 3,
  marginBottom: 15,
  alignItems: 'center',
  padding: 10,
  backgroundColor: '$bgInput',
  borderRadius: 15,
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
      },
    },
  } as const,
});

const PatternPreview = styled(Stack, {
  width: 80,
  height: 80,
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '$textPrimary',
  marginBottom: 8,
});

const PatternPlaceholder = styled(Stack, {
  width: 80,
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
});

const PatternName = styled(Text, {
  color: '$textPrimary',
  fontSize: 12,
  textAlign: 'center',
});

const SelectedIndicator = styled(Stack, {
  position: 'absolute',
  top: 5,
  right: 5,
});

const OptionsContainer = styled(YStack, {
  backgroundColor: '$bgInput',
  padding: 15,
  borderRadius: 15,
  marginTop: 20,
});

const OptionsTitle = styled(Text, {
  fontSize: 16,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 15,
});

const OptionRow = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
});

const OptionLabel = styled(Text, {
  color: '$textSecondary',
  fontSize: 14,
});

const ScaleButtons = styled(XStack, {
  alignItems: 'center',
});

const ScaleButton = styled(Stack, {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '$primary',
  justifyContent: 'center',
  alignItems: 'center',
});

const ScaleValue = styled(Text, {
  color: '$textPrimary',
  fontSize: 14,
  marginHorizontal: 15,
});

const RotationButtons = styled(XStack, {});

const RotationButton = styled(Stack, {
  paddingHorizontal: 15,
  paddingVertical: 8,
  backgroundColor: 'rgba(108, 99, 255, 0.2)',
  borderRadius: 10,
  marginLeft: 10,
});

const RotationText = styled(Text, {
  color: '$primary',
  fontSize: 12,
});

interface PatternType {
  id: string;
  name: string;
  type: string;
}

interface PatternSelectorProps {
  selectedPattern?: PatternType | null;
  onPatternSelect: (pattern: PatternType) => void;
}

const PatternSelector: React.FC<PatternSelectorProps> = ({ selectedPattern, onPatternSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('geometric');

  const patterns: Record<string, PatternType[]> = {
    geometric: [
      { id: 'stripes', name: 'Stripes', type: 'lines' },
      { id: 'dots', name: 'Polka Dots', type: 'circles' },
      { id: 'checkers', name: 'Checkers', type: 'squares' },
      { id: 'zigzag', name: 'Zigzag', type: 'zigzag' },
      { id: 'diamonds', name: 'Diamonds', type: 'diamonds' },
    ],
    floral: [
      { id: 'roses', name: 'Roses', type: 'floral' },
      { id: 'leaves', name: 'Leaves', type: 'leaves' },
      { id: 'vines', name: 'Vines', type: 'vines' },
      { id: 'tropical', name: 'Tropical', type: 'tropical' },
    ],
    abstract: [
      { id: 'watercolor', name: 'Watercolor', type: 'watercolor' },
      { id: 'marble', name: 'Marble', type: 'marble' },
      { id: 'gradient', name: 'Gradient', type: 'gradient' },
      { id: 'splatter', name: 'Splatter', type: 'splatter' },
    ],
  };

  const renderPattern = (pattern: PatternType) => {
    const size = 80;
    
    switch (pattern.type) {
      case 'lines':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="stripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <Line x1="0" y1="0" x2="0" y2="10" stroke="#6C63FF" strokeWidth="2" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#stripes)" />
          </Svg>
        );
      case 'circles':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Circle cx="10" cy="10" r="3" fill="#FF6B6B" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#dots)" />
          </Svg>
        );
      case 'squares':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="checkers" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Rect x="0" y="0" width="10" height="10" fill="#4ECDC4" />
                <Rect x="10" y="10" width="10" height="10" fill="#4ECDC4" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#checkers)" />
          </Svg>
        );
      case 'zigzag':
        return (
          <Svg width={size} height={size}>
            <Path
              d="M0,20 L10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,40 L10,30 L20,40 L30,30 L40,40 L50,30 L60,40 L70,30 L80,40"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,60 L10,50 L20,60 L30,50 L40,60 L50,50 L60,60 L70,50 L80,60"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        );
      default:
        return (
          <PatternPlaceholder style={{ backgroundColor: '#6C63FF' }}>
            <MaterialCommunityIcons name="texture" size={40} color="#fff" />
          </PatternPlaceholder>
        );
    }
  };

  const PatternCardComponent = ({ pattern }: { pattern: PatternType }) => {
    const isSelected = selectedPattern?.id === pattern.id;

    return (
      <TouchableOpacity onPress={() => onPatternSelect(pattern)}>
        <PatternCard selected={isSelected}>
          <PatternPreview>
            {renderPattern(pattern)}
          </PatternPreview>
          <PatternName>{pattern.name}</PatternName>
          {isSelected && (
            <SelectedIndicator>
              <MaterialCommunityIcons name="check-circle" size={20} color="#6C63FF" />
            </SelectedIndicator>
          )}
        </PatternCard>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      {/* Category Tabs */}
      <CategoryTabs>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('geometric')}
        >
          <CategoryTab active={selectedCategory === 'geometric'}>
            <CategoryTabText active={selectedCategory === 'geometric'}>
              Geometric
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('floral')}
        >
          <CategoryTab active={selectedCategory === 'floral'}>
            <CategoryTabText active={selectedCategory === 'floral'}>
              Floral
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('abstract')}
        >
          <CategoryTab active={selectedCategory === 'abstract'}>
            <CategoryTabText active={selectedCategory === 'abstract'}>
              Abstract
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
      </CategoryTabs>

      {/* Pattern Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <PatternGrid>
          {patterns[selectedCategory].map((pattern) => (
            <PatternCardComponent key={pattern.id} pattern={pattern} />
          ))}
        </PatternGrid>
      </ScrollView>

      {/* Pattern Options */}
      {selectedPattern && (
        <OptionsContainer>
          <OptionsTitle>Pattern Options</OptionsTitle>
          <OptionRow>
            <OptionLabel>Scale</OptionLabel>
            <ScaleButtons>
              <TouchableOpacity>
                <ScaleButton>
                  <MaterialCommunityIcons name="minus" size={20} color="#fff" />
                </ScaleButton>
              </TouchableOpacity>
              <ScaleValue>100%</ScaleValue>
              <TouchableOpacity>
                <ScaleButton>
                  <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                </ScaleButton>
              </TouchableOpacity>
            </ScaleButtons>
          </OptionRow>
          <OptionRow>
            <OptionLabel>Rotation</OptionLabel>
            <RotationButtons>
              <TouchableOpacity>
                <RotationButton>
                  <RotationText>0°</RotationText>
                </RotationButton>
              </TouchableOpacity>
              <TouchableOpacity>
                <RotationButton>
                  <RotationText>45°</RotationText>
                </RotationButton>
              </TouchableOpacity>
              <TouchableOpacity>
                <RotationButton>
                  <RotationText>90°</RotationText>
                </RotationButton>
              </TouchableOpacity>
            </RotationButtons>
          </OptionRow>
        </OptionsContainer>
      )}
    </Container>
  );
};

export default PatternSelector;
