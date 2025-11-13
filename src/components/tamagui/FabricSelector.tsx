import React, { useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface Fabric {
  id: string;
  name: string;
  icon: string;
  description: string;
  properties: string[];
  colors: string[];
}

interface FabricSelectorProps {
  selectedFabric?: Fabric | null;
  onFabricSelect: (fabric: Fabric) => void;
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

const FabricCard = styled(TouchableOpacity, {
  flexDirection: 'row',
  backgroundColor: '$bgCard',
  borderRadius: 16,
  marginBottom: 16,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    selected: {
      true: {
        borderColor: '#6C63FF',
      },
    },
  } as any,
});

const FabricGradient = styled(YStack, {
  width: 100,
  height: 120,
  alignItems: 'center',
  justifyContent: 'center',
});

const FabricInfo = styled(YStack, {
  flex: 1,
  padding: 12,
});

const FabricName = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 4,
});

const FabricDescription = styled(TamaguiText, {
  fontSize: 14,
  color: '$textSecondary',
  marginBottom: 8,
});

const FabricProperties = styled(XStack, {
  flexWrap: 'wrap',
  gap: 6,
});

const PropertyBadge = styled(YStack, {
  backgroundColor: '$bgInput',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
});

const PropertyText = styled(TamaguiText, {
  fontSize: 12,
  color: '$textSecondary',
});

const SelectedIndicator = styled(YStack, {
  position: 'absolute',
  top: 8,
  right: 8,
});

const FabricCardComponent: React.FC<{ fabric: Fabric; isSelected: boolean; onSelect: (fabric: Fabric) => void }> = ({
  fabric,
  isSelected,
  onSelect,
}) => {
  return (
    <FabricCard selected={isSelected} onPress={() => onSelect(fabric)}>
      <LinearGradient colors={fabric.colors} style={{ width: 100, height: 120, alignItems: 'center', justifyContent: 'center' }}>
        <YStack>
          <MaterialCommunityIcons name={fabric.icon as any} size={40} color="#fff" />
        </YStack>
      </LinearGradient>
      <FabricInfo>
        <FabricName>{fabric.name}</FabricName>
        <FabricDescription>{fabric.description}</FabricDescription>
        <FabricProperties>
          {fabric.properties.map((prop, index) => (
            <PropertyBadge key={index}>
              <PropertyText>{prop}</PropertyText>
            </PropertyBadge>
          ))}
        </FabricProperties>
      </FabricInfo>
      {isSelected && (
        <SelectedIndicator>
          <MaterialCommunityIcons name="check-circle" size={24} color="#6C63FF" />
        </SelectedIndicator>
      )}
    </FabricCard>
  );
};

const FabricSelector: React.FC<FabricSelectorProps> = ({ selectedFabric, onFabricSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<'natural' | 'synthetic' | 'special'>('natural');

  const fabricCategories: Record<string, Fabric[]> = {
    natural: [
      {
        id: 'cotton',
        name: 'Cotton',
        icon: 'flower',
        description: 'Breathable and comfortable',
        properties: ['Breathable', 'Soft', 'Durable'],
        colors: ['#FFFFFF', '#F5F5DC'],
      },
      {
        id: 'silk',
        name: 'Silk',
        icon: 'shimmer',
        description: 'Luxurious and smooth',
        properties: ['Smooth', 'Lustrous', 'Lightweight'],
        colors: ['#FFE4E1', '#FFF0F5'],
      },
      {
        id: 'wool',
        name: 'Wool',
        icon: 'sheep',
        description: 'Warm and insulating',
        properties: ['Warm', 'Elastic', 'Water-resistant'],
        colors: ['#D3D3D3', '#A9A9A9'],
      },
      {
        id: 'linen',
        name: 'Linen',
        icon: 'leaf',
        description: 'Cool and crisp',
        properties: ['Cool', 'Strong', 'Absorbent'],
        colors: ['#FAF0E6', '#F5DEB3'],
      },
    ],
    synthetic: [
      {
        id: 'polyester',
        name: 'Polyester',
        icon: 'chemical-weapon',
        description: 'Durable and wrinkle-resistant',
        properties: ['Durable', 'Quick-dry', 'Wrinkle-resistant'],
        colors: ['#E6E6FA', '#DDA0DD'],
      },
      {
        id: 'nylon',
        name: 'Nylon',
        icon: 'molecule',
        description: 'Strong and elastic',
        properties: ['Strong', 'Elastic', 'Lightweight'],
        colors: ['#B0C4DE', '#87CEEB'],
      },
      {
        id: 'spandex',
        name: 'Spandex',
        icon: 'stretch-to-page',
        description: 'Stretchy and flexible',
        properties: ['Stretchy', 'Form-fitting', 'Comfortable'],
        colors: ['#FFB6C1', '#FFC0CB'],
      },
    ],
    special: [
      {
        id: 'denim',
        name: 'Denim',
        icon: 'texture-box',
        description: 'Sturdy cotton twill',
        properties: ['Durable', 'Versatile', 'Classic'],
        colors: ['#4169E1', '#191970'],
      },
      {
        id: 'leather',
        name: 'Leather',
        icon: 'cow',
        description: 'Durable and stylish',
        properties: ['Durable', 'Water-resistant', 'Luxurious'],
        colors: ['#8B4513', '#654321'],
      },
      {
        id: 'velvet',
        name: 'Velvet',
        icon: 'diamond-stone',
        description: 'Soft and luxurious',
        properties: ['Soft', 'Rich texture', 'Elegant'],
        colors: ['#8B008B', '#4B0082'],
      },
    ],
  };

  return (
    <Container>
      {/* Category Tabs */}
      <CategoryTabs>
        <CategoryTab active={selectedCategory === 'natural'} onPress={() => setSelectedCategory('natural')}>
          <MaterialCommunityIcons name="leaf" size={20} color={selectedCategory === 'natural' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'natural'}>Natural</CategoryTabText>
        </CategoryTab>
        <CategoryTab active={selectedCategory === 'synthetic'} onPress={() => setSelectedCategory('synthetic')}>
          <MaterialCommunityIcons name="chemical-weapon" size={20} color={selectedCategory === 'synthetic' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'synthetic'}>Synthetic</CategoryTabText>
        </CategoryTab>
        <CategoryTab active={selectedCategory === 'special'} onPress={() => setSelectedCategory('special')}>
          <MaterialCommunityIcons name="star" size={20} color={selectedCategory === 'special' ? '#fff' : '#888'} />
          <CategoryTabText active={selectedCategory === 'special'}>Special</CategoryTabText>
        </CategoryTab>
      </CategoryTabs>

      {/* Fabric List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {fabricCategories[selectedCategory].map((fabric) => (
          <FabricCardComponent
            key={fabric.id}
            fabric={fabric}
            isSelected={selectedFabric?.id === fabric.id}
            onSelect={onFabricSelect}
          />
        ))}
      </ScrollView>
    </Container>
  );
};

export default FabricSelector;
