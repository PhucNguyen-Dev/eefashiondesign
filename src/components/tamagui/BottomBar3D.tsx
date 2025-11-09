import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface BottomBar3DProps {
  navigation: any;
}

interface Action {
  id: string;
  label: string;
  icon: string;
  iconType: 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';
  color: string;
  gradient: string[];
}

const BottomBarContainer = styled(XStack, {
  height: 70,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  backgroundColor: '$bg',
  borderTopWidth: 1,
  borderTopColor: '$bgCard',
});

const LeftSection = styled(XStack, {
  alignItems: 'center',
  gap: 12,
});

const ActionButton = styled(TouchableOpacity, {
  borderRadius: 10,
  overflow: 'hidden',
});

const ActionLabel = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '#FFFFFF',
});

const CenterSection = styled(Stack, {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const ViewModeToggle = styled(XStack, {
  backgroundColor: '$bgSecondary',
  borderRadius: 10,
  padding: 4,
  gap: 4,
});

const ViewModeButton = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  variants: {
    active: {
      true: {
        backgroundColor: '$bgCard',
      },
    },
  } as any,
});

const ViewModeText = styled(TamaguiText, {
  fontSize: 13,
  color: '$textSecondary',
  variants: {
    active: {
      true: {
        color: '#4A90E2',
        fontWeight: '600',
      },
    },
  } as any,
});

const RightSection = styled(XStack, {
  alignItems: 'center',
  gap: 20,
});

const ZoomControl = styled(XStack, {
  alignItems: 'center',
  gap: 8,
  backgroundColor: '$bgSecondary',
  borderRadius: 10,
  padding: 4,
});

const ZoomButton = styled(TouchableOpacity, {
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  backgroundColor: '$bgCard',
});

const ZoomIndicator = styled(XStack, {
  alignItems: 'center',
  gap: 6,
  paddingHorizontal: 12,
});

const ZoomText = styled(TamaguiText, {
  fontSize: 13,
  fontWeight: '600',
  color: '$textPrimary',
});

const InfoSection = styled(XStack, {
  alignItems: 'center',
  gap: 12,
  paddingHorizontal: 16,
  paddingVertical: 8,
  backgroundColor: '$bgSecondary',
  borderRadius: 10,
});

const InfoItem = styled(XStack, {
  alignItems: 'center',
  gap: 6,
});

const InfoText = styled(TamaguiText, {
  fontSize: 12,
  color: '$textTertiary',
});

const Separator = styled(Stack, {
  width: 1,
  height: 16,
  backgroundColor: '$bgCard',
});

const BottomBar3D: React.FC<BottomBar3DProps> = ({ navigation }) => {
  const actions: Action[] = [
    {
      id: 'save',
      label: 'Save & Sync',
      icon: 'cloud-upload',
      iconType: 'Feather',
      color: '#4A90E2',
      gradient: ['#4A90E2', '#00D9C0'],
    },
    {
      id: 'export',
      label: 'Export Render',
      icon: 'download',
      iconType: 'Feather',
      color: '#6C5CE7',
      gradient: ['#6C5CE7', '#4A90E2'],
    },
    {
      id: 'share',
      label: 'Share & Collaborate',
      icon: 'share-2',
      iconType: 'Feather',
      color: '#00D9C0',
      gradient: ['#00D9C0', '#7FFFD4'],
    },
  ];

  const renderIcon = (action: Action) => {
    const IconComponent =
      action.iconType === 'Feather'
        ? Feather
        : action.iconType === 'Ionicons'
        ? Ionicons
        : MaterialCommunityIcons;

    return <IconComponent name={action.icon as any} size={20} color="#FFFFFF" />;
  };

  return (
    <BottomBarContainer>
      {/* Left Section - Action Buttons */}
      <LeftSection>
        {actions.map((action) => (
          <ActionButton key={action.id}>
            <LinearGradient
              colors={action.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 20,
                paddingVertical: 12,
              }}
            >
              {renderIcon(action)}
              <ActionLabel>{action.label}</ActionLabel>
            </LinearGradient>
          </ActionButton>
        ))}
      </LeftSection>

      {/* Center Section - View Mode Toggle */}
      <CenterSection>
        <ViewModeToggle>
          <ViewModeButton active={true}>
            <MaterialCommunityIcons name="cube-outline" size={18} color="#4A90E2" />
            <ViewModeText active={true}>3D View</ViewModeText>
          </ViewModeButton>
          <ViewModeButton>
            <MaterialCommunityIcons name="grid" size={18} color="#B0B0C0" />
            <ViewModeText>Wireframe</ViewModeText>
          </ViewModeButton>
          <ViewModeButton>
            <MaterialCommunityIcons name="texture" size={18} color="#B0B0C0" />
            <ViewModeText>Texture</ViewModeText>
          </ViewModeButton>
        </ViewModeToggle>
      </CenterSection>

      {/* Right Section - Zoom & Info */}
      <RightSection>
        <ZoomControl>
          <ZoomButton>
            <Ionicons name="remove" size={16} color="#B0B0C0" />
          </ZoomButton>
          <ZoomIndicator>
            <MaterialCommunityIcons name="magnify" size={16} color="#B0B0C0" />
            <ZoomText>100%</ZoomText>
          </ZoomIndicator>
          <ZoomButton>
            <Ionicons name="add" size={16} color="#B0B0C0" />
          </ZoomButton>
        </ZoomControl>

        <InfoSection>
          <InfoItem>
            <MaterialCommunityIcons name="triangle-outline" size={14} color="#666677" />
            <InfoText>12.5K Polygons</InfoText>
          </InfoItem>
          <Separator />
          <InfoItem>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#666677" />
            <InfoText>Auto-saved 2m ago</InfoText>
          </InfoItem>
        </InfoSection>
      </RightSection>
    </BottomBarContainer>
  );
};

export default BottomBar3D;
