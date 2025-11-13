import React, { useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import Svg, { Circle, Rect, Line, Path, Pattern as SvgPattern, Defs as SvgDefs } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface PatternType {
  id: string;
  name: string;
  type: string;
}

interface PatternSelectorProps {
  selectedPattern?: PatternType | null;
  onPatternSelect: (pattern: PatternType) => void;
}

const Container = styled(YStack, {
  flex: 1,
  backgroundColor: '$bg',
  padding: 16,
});

const CategoryTabs = styled(XStack, {
  marginBottom: 20,
  gap: 8,
});

const CategoryTab = styled(TouchableOpacity, {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: '$bgCard',
  variants: {
    active: {
      true: {
        backgroundColor: '#6C63FF',
      },
    },
  } as any,
});

const CategoryTabText = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '#888',
  variants: {
    active: {
      true: {
        color: '#fff',
      },
    },
  } as any,
});

const PatternCard = styled(TouchableOpacity, {
  backgroundColor: '$bgCard',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  borderWidth: 2,
  borderColor: 'transparent',
  alignItems: 'center',
  variants: {
    selected: {
      true: {
        borderColor: '#6C63FF',
      },
    },
  } as any,
});

const PatternPreview = styled(YStack, {
  width: 80,
  height: 80,
  borderRadius: 12,
  backgroundColor: '#f5f5f5',
  marginBottom: 12,
  overflow: 'hidden',
});

const PatternName = styled(TamaguiText, {
  fontSize: 16,
  fontWeight: '600',
  color: '$textPrimary',
});

const SelectedIndicator = styled(YStack, {
  position: 'absolute',
  top: 8,
  right: 8,
});

const renderPattern = (pattern: PatternType) => {
  const size = 80;
  
  switch (pattern.type) {
    case 'lines':
      return (
        <Svg width={size} height={size}>
          <SvgDefs>
            <SvgPattern id="stripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <Line x1="0" y1="0" x2="0" y2="10" stroke="#6C63FF" strokeWidth="2" />
            </SvgPattern>
          </SvgDefs>
          <Rect x="0" y="0" width={size} height={size} fill="url(#stripes)" />
        </Svg>
      );
    case 'circles':
      return (
        <Svg width={size} height={size}>
          <SvgDefs>
            <SvgPattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <Circle cx="10" cy="10" r="3" fill="#FF6B6B" />
            </SvgPattern>
          </SvgDefs>
          <Rect x="0" y="0" width={size} height={size} fill="url(#dots)" />
        </Svg>
      );
    case 'squares':
      return (
        <Svg width={size} height={size}>
          <SvgDefs>
            <SvgPattern id="checkers" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <Rect x="0" y="0" width="10" height="10" fill="#4ECDC4" />
              <Rect x="10" y="10" width="10" height="10" fill="#4ECDC4" />
            </SvgPattern>
          </SvgDefs>
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
    case 'diamonds':
      return (
        <Svg width={size} height={size}>
          <Path d="M40,0 L80,40 L40,80 L0,40 Z" fill="#A8E6CF" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size}>
          <Rect x="0" y="0" width={size} height={size} fill="#e0e0e0" />
          <MaterialCommunityIcons name="texture-box" size={40} color="#888" />
        </Svg>
      );
  }
};

const PatternSelector: React.FC<PatternSelectorProps> = ({ selectedPattern, onPatternSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<'geometric' | 'floral' | 'abstract'>('geometric');

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

  return (
    <Container>
      {/* Category Tabs */}
      <CategoryTabs>
        <CategoryTab active={selectedCategory === 'geometric'} onPress={() => setSelectedCategory('geometric')}>
          <MaterialCommunityIcons name="shape" size={20} color={selectedCategory === 'geometric' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'geometric'}>Geometric</CategoryTabText>
        </CategoryTab>
        <CategoryTab active={selectedCategory === 'floral'} onPress={() => setSelectedCategory('floral')}>
          <MaterialCommunityIcons name="flower" size={20} color={selectedCategory === 'floral' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'floral'}>Floral</CategoryTabText>
        </CategoryTab>
        <CategoryTab active={selectedCategory === 'abstract'} onPress={() => setSelectedCategory('abstract')}>
          <MaterialCommunityIcons name="palette" size={20} color={selectedCategory === 'abstract' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'abstract'}>Abstract</CategoryTabText>
        </CategoryTab>
      </CategoryTabs>

      {/* Pattern List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {patterns[selectedCategory].map((pattern) => {
          const isSelected = selectedPattern?.id === pattern.id;
          return (
            <PatternCard key={pattern.id} selected={isSelected} onPress={() => onPatternSelect(pattern)}>
              <PatternPreview>{renderPattern(pattern)}</PatternPreview>
              <PatternName>{pattern.name}</PatternName>
              {isSelected && (
                <SelectedIndicator>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#6C63FF" />
                </SelectedIndicator>
              )}
            </PatternCard>
          );
        })}
      </ScrollView>
    </Container>
  );
};

export default PatternSelector;
