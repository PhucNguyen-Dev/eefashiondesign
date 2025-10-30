import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';
import PremiumButton from '../../shared/components/PremiumButton';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface Header3DProps {
  navigation: any;
}

interface Tab {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active?: boolean;
}

const HeaderContainer = styled(XStack, {
  height: 70,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 24,
  borderBottomWidth: 1,
  borderBottomColor: '$bgCard',
});

const LeftSection = styled(XStack, {
  alignItems: 'center',
  gap: 16,
});

const LogoContainer = styled(XStack, {
  alignItems: 'center',
  gap: 10,
});

const BrandText = styled(TamaguiText, {
  fontSize: 20,
  fontWeight: '700',
  color: '$textPrimary',
  letterSpacing: -0.5,
});

const UserRole = styled(YStack, {
  backgroundColor: 'rgba(108, 92, 231, 0.2)',
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
});

const RoleText = styled(TamaguiText, {
  fontSize: 12,
  fontWeight: '600',
  color: '#6C5CE7',
});

const CenterSection = styled(XStack, {
  alignItems: 'center',
  gap: 8,
});

const Tab = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
  position: 'relative',
  variants: {
    active: {
      true: {
        backgroundColor: '$bgCard',
      },
    },
  } as any,
});

const TabText = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '500',
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

const TabIndicator = styled(Stack, {
  position: 'absolute',
  bottom: -2,
  left: 16,
  right: 16,
  height: 2,
  backgroundColor: '#4A90E2',
  borderRadius: 2,
});

const RightSection = styled(XStack, {
  alignItems: 'center',
  gap: 12,
});

const IconButton = styled(TouchableOpacity, {
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  backgroundColor: '$bgCard',
  position: 'relative',
});

const Badge = styled(YStack, {
  position: 'absolute',
  top: 6,
  right: 6,
  backgroundColor: '#FF6B6B',
  width: 16,
  height: 16,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
});

const BadgeText = styled(TamaguiText, {
  fontSize: 10,
  fontWeight: '700',
  color: '#FFFFFF',
});

const ProfileButton = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: '$bgCard',
});

const Avatar = styled(YStack, {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#4A90E2',
  alignItems: 'center',
  justifyContent: 'center',
});

const AvatarText = styled(TamaguiText, {
  fontSize: 12,
  fontWeight: '700',
  color: '#FFFFFF',
});

const ProfileName = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '$textPrimary',
});

const Header3D: React.FC<Header3DProps> = ({ navigation }) => {
  const tabs: Tab[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: '3d-atelier', label: '3D Atelier', icon: 'cube-outline', active: true },
    { id: '2d-design', label: '2D Design', icon: 'brush' },
    { id: 'ar-view', label: 'AR View', icon: 'camera' },
  ];

  return (
    <LinearGradient
      colors={['#0F0F1E', '#1A1A2E']}
      style={{ width: '100%' }}
    >
      <HeaderContainer>
        {/* Left Section - Logo & Brand */}
        <LeftSection>
          <LogoContainer>
            <MaterialCommunityIcons name="hanger" size={28} color="#4A90E2" />
            <BrandText>eefashionita</BrandText>
          </LogoContainer>
          <UserRole>
            <RoleText>Designer</RoleText>
          </UserRole>
        </LeftSection>

        {/* Center Section - Navigation Tabs */}
        <CenterSection>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={tab.active}
              onPress={() => {
                if (tab.id === 'home') navigation.navigate('Home');
                if (tab.id === '2d-design') navigation.navigate('DesignStudio');
                if (tab.id === 'ar-view') navigation.navigate('ARView');
              }}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={tab.active ? '#4A90E2' : '#B0B0C0'}
              />
              <TabText active={tab.active}>{tab.label}</TabText>
              {tab.active && <TabIndicator />}
            </Tab>
          ))}
        </CenterSection>

        {/* Right Section - User Profile & Actions */}
        <RightSection>
          {/* Premium Button */}
          <PremiumButton />

          <IconButton>
            <Ionicons name="notifications-outline" size={22} color="#B0B0C0" />
            <Badge>
              <BadgeText>3</BadgeText>
            </Badge>
          </IconButton>

          <IconButton>
            <Ionicons name="settings-outline" size={22} color="#B0B0C0" />
          </IconButton>

          <ProfileButton>
            <Avatar>
              <AvatarText>LE</AvatarText>
            </Avatar>
            <ProfileName>Lovely Emma</ProfileName>
            <Ionicons name="chevron-down" size={16} color="#B0B0C0" />
          </ProfileButton>
        </RightSection>
      </HeaderContainer>
    </LinearGradient>
  );
};

export default Header3D;
