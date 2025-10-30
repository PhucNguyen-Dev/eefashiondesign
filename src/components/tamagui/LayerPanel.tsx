import React, { useRef } from 'react';
import { TouchableOpacity, FlatList, Animated } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface Layer {
  id: string | number;
  name?: string;
  type: string;
  visible: boolean;
}

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string | number;
  onSelectLayer: (id: string | number) => void;
  onToggleVisibility: (id: string | number) => void;
  onDeleteLayer: (id: string | number) => void;
  onReorderLayers?: (layers: Layer[]) => void;
}

interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (id: string | number) => void;
  onToggleVisibility: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const Container = styled(YStack, {
  backgroundColor: '$bgCard',
  borderRadius: '$lg',
  padding: '$md',
  maxHeight: 400,
});

const Header = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$md',
});

const Title = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '$textPrimary',
});

const HeaderActions = styled(XStack, {});

const HeaderButton = styled(TouchableOpacity, {
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$bgInput',
  borderRadius: '$md',
  marginLeft: '$xs',
});

const LayerItemContainer = styled(Stack, {
  marginBottom: '$sm',
  borderRadius: '$md',
  backgroundColor: '$bgInput',
  overflow: 'hidden',
  variants: {
    selected: {
      true: {
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        borderWidth: 2,
        borderColor: '$primary',
      },
    },
  } as any,
});

const LayerContent = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  padding: '$sm',
});

const LayerIcon = styled(YStack, {
  width: 40,
  height: 40,
  borderRadius: '$md',
  backgroundColor: '$bgCard',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '$sm',
});

const LayerInfo = styled(YStack, {
  flex: 1,
});

const LayerName = styled(TamaguiText, {
  fontSize: 16,
  color: '$textPrimary',
  marginBottom: 2,
  variants: {
    selected: {
      true: {
        fontWeight: 'bold',
        color: '$primary',
      },
    },
  } as any,
});

const LayerType = styled(TamaguiText, {
  fontSize: 12,
  color: '$textTertiary',
  textTransform: 'capitalize',
});

const LayerActions = styled(XStack, {});

const ActionButton = styled(TouchableOpacity, {
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '$xs',
});

const EmptyContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 60,
});

const EmptyText = styled(TamaguiText, {
  fontSize: 16,
  color: '$textTertiary',
  marginTop: '$sm',
});

const LayerItem: React.FC<LayerItemProps> = ({ 
  layer, 
  isSelected, 
  onSelect, 
  onToggleVisibility, 
  onDelete 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(layer.id);
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <LayerItemContainer selected={isSelected}>
        <LayerContent onPress={handlePress} activeOpacity={0.7}>
          {/* Layer Icon */}
          <LayerIcon>
            <MaterialCommunityIcons
              name={layer.type === 'text' ? 'format-text' : 'shape'}
              size={20}
              color={isSelected ? '#6C63FF' : '#B0B0C0'}
            />
          </LayerIcon>

          {/* Layer Info */}
          <LayerInfo>
            <LayerName selected={isSelected} numberOfLines={1}>
              {layer.name || `Layer ${layer.id}`}
            </LayerName>
            <LayerType>{layer.type}</LayerType>
          </LayerInfo>

          {/* Actions */}
          <LayerActions>
            <ActionButton onPress={() => onToggleVisibility(layer.id)}>
              <MaterialCommunityIcons
                name={layer.visible ? 'eye' : 'eye-off'}
                size={20}
                color={layer.visible ? '#B0B0C0' : '#666677'}
              />
            </ActionButton>

            <ActionButton onPress={() => onDelete(layer.id)}>
              <MaterialCommunityIcons name="delete" size={20} color="#FF6B6B" />
            </ActionButton>
          </LayerActions>
        </LayerContent>
      </LayerItemContainer>
    </Animated.View>
  );
};

const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
  onReorderLayers,
}) => {
  const renderLayer = ({ item }: { item: Layer }) => (
    <LayerItem
      layer={item}
      isSelected={item.id === selectedLayerId}
      onSelect={onSelectLayer}
      onToggleVisibility={onToggleVisibility}
      onDelete={onDeleteLayer}
    />
  );

  return (
    <Container>
      <Header>
        <Title>Layers</Title>
        <HeaderActions>
          <HeaderButton>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color="#FFFFFF"
            />
          </HeaderButton>
        </HeaderActions>
      </Header>

      <FlatList
        data={layers}
        renderItem={renderLayer}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyContainer>
            <MaterialCommunityIcons name="layers-off" size={48} color="#666677" />
            <EmptyText>No layers yet</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  );
};

export default LayerPanel;
