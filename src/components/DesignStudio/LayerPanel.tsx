import React, { useRef } from 'react';
import {
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/constants';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from '../tamagui';
import { Text } from '../tamagui';

// Styled components using Tamagui
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

const Title = styled(Text, {
  fontSize: '$lg',
  fontWeight: 'bold',
  color: '$textPrimary',
});

const HeaderActions = styled(XStack, {});

const HeaderButton = styled(Stack, {
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$bgInput',
  borderRadius: '$md',
  marginLeft: '$xs',
});

const ListContainer = styled(Stack, {
  flex: 1,
});

const LayerItemWrapper = styled(Stack, {
  marginBottom: '$sm',
  borderRadius: '$md',
  backgroundColor: '$bgInput',
  overflow: 'hidden',
  variants: {
    selected: {
      true: {
        backgroundColor: '$primary20',
        borderWidth: 2,
        borderColor: '$primary',
      },
    },
  } as const,
});

const LayerContent = styled(XStack, {
  alignItems: 'center',
  padding: '$sm',
});

const LayerIcon = styled(Stack, {
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

const LayerName = styled(Text, {
  fontSize: '$md',
  color: '$textPrimary',
  marginBottom: 2,
  variants: {
    selected: {
      true: {
        fontWeight: 'bold',
        color: '$primary',
      },
    },
  } as const,
});

const LayerType = styled(Text, {
  fontSize: '$xs',
  color: '$textTertiary',
  textTransform: 'capitalize',
});

const LayerActions = styled(XStack, {});

const ActionButton = styled(Stack, {
  width: 32,
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '$xs',
});

const EmptyContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: '$xxl',
});

const EmptyText = styled(Text, {
  fontSize: '$md',
  color: '$textTertiary',
  marginTop: '$sm',
});

interface Layer {
  id: string;
  name?: string;
  type: string;
  visible: boolean;
}

interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({ layer, isSelected, onSelect, onToggleVisibility, onDelete }) => {
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
      <LayerItemWrapper selected={isSelected}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <LayerContent>
            {/* Layer Icon */}
            <LayerIcon>
              <MaterialCommunityIcons
                name={layer.type === 'text' ? 'format-text' : 'shape'}
                size={20}
                color={isSelected ? COLORS.primary : COLORS.textSecondary}
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
              <TouchableOpacity onPress={() => onToggleVisibility(layer.id)}>
                <ActionButton>
                  <MaterialCommunityIcons
                    name={layer.visible ? 'eye' : 'eye-off'}
                    size={20}
                    color={layer.visible ? COLORS.textSecondary : COLORS.textTertiary}
                  />
                </ActionButton>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDelete(layer.id)}>
                <ActionButton>
                  <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
                </ActionButton>
              </TouchableOpacity>
            </LayerActions>
          </LayerContent>
        </TouchableOpacity>
      </LayerItemWrapper>
    </Animated.View>
  );
};

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId?: string;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayers?: (layers: Layer[]) => void;
}

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
          <TouchableOpacity>
            <HeaderButton>
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={COLORS.textPrimary}
              />
            </HeaderButton>
          </TouchableOpacity>
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
            <MaterialCommunityIcons name="layers-off" size={48} color={COLORS.textTertiary} />
            <EmptyText>No layers yet</EmptyText>
          </EmptyContainer>
        }
      />
    </Container>
  );
};

export default LayerPanel;
