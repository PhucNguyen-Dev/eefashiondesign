import React, { useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from './tamagui';
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

const CategoryTab = styled(XStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
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
  marginLeft: 5,
  variants: {
    active: {
      true: {
        color: '$textPrimary',
      },
    },
  } as const,
});

const FabricCard = styled(XStack, {
  backgroundColor: '$bgInput',
  borderRadius: 15,
  marginBottom: 15,
  overflow: 'hidden',
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

const FabricGradient = styled(Stack, {
  width: 100,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
});

const FabricIconContainer = styled(Stack, {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
});

const FabricInfo = styled(YStack, {
  flex: 1,
  padding: 15,
});

const FabricName = styled(Text, {
  fontSize: 16,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 5,
});

const FabricDescription = styled(Text, {
  fontSize: 12,
  color: '$textSecondary',
  marginBottom: 10,
});

const FabricProperties = styled(XStack, {
  flexWrap: 'wrap',
});

const PropertyBadge = styled(Stack, {
  backgroundColor: 'rgba(108, 99, 255, 0.2)',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 10,
  marginRight: 5,
  marginBottom: 5,
});

const PropertyText = styled(Text, {
  color: '$primary',
  fontSize: 10,
});

const SelectedIndicator = styled(Stack, {
  position: 'absolute',
  top: 10,
  right: 10,
});

const SelectedDetails = styled(YStack, {
  backgroundColor: '$bgInput',
  padding: 15,
  borderRadius: 15,
  marginTop: 20,
});

const SelectedTitle = styled(Text, {
  fontSize: 16,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 5,
});

const SelectedDescription = styled(Text, {
  fontSize: 12,
  color: '$textSecondary',
  lineHeight: 18,
});

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

const FabricSelector: React.FC<FabricSelectorProps> = ({ selectedFabric, onFabricSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('natural');

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

  const FabricCardComponent = ({ fabric }: { fabric: Fabric }) => {
    const isSelected = selectedFabric?.id === fabric.id;

    return (
      <TouchableOpacity onPress={() => onFabricSelect(fabric)}>
        <FabricCard selected={isSelected}>
          <LinearGradient
            colors={fabric.colors}
            style={{ width: 100, padding: 20, justifyContent: 'center', alignItems: 'center' }}
          >
            <FabricIconContainer>
              <MaterialCommunityIcons
                name={fabric.icon}
                size={40}
                color="#fff"
              />
            </FabricIconContainer>
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
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      {/* Category Tabs */}
      <CategoryTabs>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('natural')}
        >
          <CategoryTab active={selectedCategory === 'natural'}>
            <MaterialCommunityIcons
              name="leaf"
              size={20}
              color={selectedCategory === 'natural' ? '#fff' : '#888'}
            />
            <CategoryTabText active={selectedCategory === 'natural'}>
              Natural
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('synthetic')}
        >
          <CategoryTab active={selectedCategory === 'synthetic'}>
            <MaterialCommunityIcons
              name="chemical-weapon"
              size={20}
              color={selectedCategory === 'synthetic' ? '#fff' : '#888'}
            />
            <CategoryTabText active={selectedCategory === 'synthetic'}>
              Synthetic
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, marginHorizontal: 5 }}
          onPress={() => setSelectedCategory('special')}
        >
          <CategoryTab active={selectedCategory === 'special'}>
            <MaterialCommunityIcons
              name="star"
              size={20}
              color={selectedCategory === 'special' ? '#fff' : '#888'}
            />
            <CategoryTabText active={selectedCategory === 'special'}>
              Special
            </CategoryTabText>
          </CategoryTab>
        </TouchableOpacity>
      </CategoryTabs>

      {/* Fabric List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {fabricCategories[selectedCategory].map((fabric) => (
          <FabricCardComponent key={fabric.id} fabric={fabric} />
        ))}
      </ScrollView>

      {/* Selected Fabric Details */}
      {selectedFabric && (
        <SelectedDetails>
          <SelectedTitle>Selected: {selectedFabric.name}</SelectedTitle>
          <SelectedDescription>
            Perfect for your design! This fabric offers excellent {selectedFabric.properties[0].toLowerCase()} properties.
          </SelectedDescription>
        </SelectedDetails>
      )}
    </Container>
  );
};

export default FabricSelector;
