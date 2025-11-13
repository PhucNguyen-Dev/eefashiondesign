/**
 * Profile Screen - Redesigned with Modern, Luxury, Elegant Design
 * Features: Glassmorphism, Advanced Animations, Premium Feel
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Stack, Text, styled } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { GlassCard, GlassModal, GlassButton } from './GlassComponents';
import { ElasticButton, AnimatedPressable, Pulse } from './InteractiveEffects';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatar: string | null;
  level: string;
  designs: number;
  followers: number;
  following: number;
}

interface SettingsData {
  notifications: boolean;
  darkMode: boolean;
  autoSave: boolean;
  syncCloud: boolean;
  privateProfile: boolean;
}

interface ProfileScreenProps {
  user?: any;
  signOut?: () => Promise<any>;
}

// Styled Components with Glassmorphism
const Container = styled(Stack, {
  flex: 1,
  backgroundColor: '#0A0A14',
});

const HeaderContainer = styled(Stack, {
  paddingTop: 60,
  paddingBottom: 30,
  paddingHorizontal: 20,
  position: 'relative',
});

const AvatarSection = styled(Stack, {
  alignItems: 'center',
  marginBottom: 20,
});

const AvatarWrapper = styled(Stack, {
  position: 'relative',
  marginBottom: 15,
});

const Avatar = styled(Image, {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 4,
  borderColor: '#6C63FF',
});

const AvatarPlaceholder = styled(Stack, {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: 'rgba(108, 99, 255, 0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 4,
  borderColor: '#6C63FF',
});

const EditAvatarButton = styled(Stack, {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#6C63FF',
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#0A0A14',
  
  ...(Platform.OS === 'web' && {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  
  shadowColor: '#6C63FF',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
});

const ProfileName = styled(Text, {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginBottom: 5,
});

const ProfileLevel = styled(Text, {
  fontSize: 14,
  color: '#6C63FF',
  textAlign: 'center',
  marginBottom: 8,
  fontWeight: '600',
  letterSpacing: 1,
  textTransform: 'uppercase',
});

const ProfileBio = styled(Text, {
  fontSize: 14,
  color: 'rgba(255,255,255,0.7)',
  textAlign: 'center',
  marginBottom: 25,
  paddingHorizontal: 40,
  lineHeight: 20,
});

const StatsContainer = styled(Stack, {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingHorizontal: 20,
  marginBottom: 30,
});

const StatValue = styled(Text, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  marginTop: 8,
  textAlign: 'center',
});

const StatLabel = styled(Text, {
  fontSize: 12,
  color: 'rgba(255,255,255,0.6)',
  marginTop: 4,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
});

const TabsContainer = styled(Stack, {
  flexDirection: 'row',
  paddingHorizontal: 20,
  marginBottom: 25,
  gap: 10,
});

const TabButton = styled(Stack, {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center',
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.05)',
  
  ...(Platform.OS === 'web' && {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
});

const ActiveTabButton = styled(TabButton, {
  backgroundColor: 'rgba(108, 99, 255, 0.2)',
  borderWidth: 1,
  borderColor: '#6C63FF',
});

const TabText = styled(Text, {
  color: 'rgba(255,255,255,0.6)',
  fontSize: 14,
  fontWeight: '500',
});

const ActiveTabText = styled(Text, {
  color: '#6C63FF',
  fontSize: 14,
  fontWeight: 'bold',
});

const ContentContainer = styled(Stack, {
  paddingHorizontal: 20,
  paddingBottom: 30,
});

const SettingLabel = styled(Text, {
  color: '#fff',
  fontSize: 16,
  marginLeft: 15,
  fontWeight: '500',
});

const LogoutText = styled(Text, {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
});

// Stat Card Component with Glass Effect
const StatCard: React.FC<{ icon: string; value: number | string; label: string }> = ({ 
  icon, 
  value, 
  label 
}) => (
  <AnimatedPressable effect="bounce">
    <GlassCard intensity="medium" elevated style={{ alignItems: 'center', padding: 20, minWidth: 100 }}>
      <MaterialCommunityIcons name={icon as any} size={28} color="#6C63FF" />
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </GlassCard>
  </AnimatedPressable>
);

// Setting Item Component with Glass Effect
const SettingItem: React.FC<{ 
  icon: string; 
  label: string; 
  value: boolean; 
  onToggle: (value: boolean) => void;
}> = ({ icon, label, value, onToggle }) => (
  <GlassCard intensity="light" style={{ marginBottom: 15 }}>
    <XStack justifyContent="space-between" alignItems="center">
      <XStack alignItems="center" gap="$3">
        <MaterialCommunityIcons name={icon as any} size={24} color="#6C63FF" />
        <SettingLabel>{label}</SettingLabel>
      </XStack>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: '#6C63FF' }}
        thumbColor={value ? '#fff' : '#888'}
      />
    </XStack>
  </GlassCard>
);

export const ProfileScreenRedesigned: React.FC<ProfileScreenProps> = ({ user, signOut }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.user_metadata?.name || user?.email || 'Fashion Designer',
    email: user?.email || 'designer@fashioncraft.com',
    bio: 'Passionate about creating unique fashion designs',
    avatar: null,
    level: 'Professional',
    designs: 42,
    followers: 1250,
    following: 320,
  });

  const [settings, setSettings] = useState<SettingsData>({
    notifications: true,
    darkMode: true,
    autoSave: true,
    syncCloud: true,
    privateProfile: false,
  });

  const [activeTab, setActiveTab] = useState<'portfolio' | 'achievements' | 'settings'>('settings');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignOut = useCallback(async () => {
    if (!signOut) return;
    try {
      setIsSigningOut(true);
      const result = await signOut();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('[ProfileScreen] Sign out error:', error);
      Alert.alert('Error', 'Unexpected error while logging out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut]);

  const confirmSignOut = useCallback(() => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: handleSignOut },
      ]
    );
  }, [handleSignOut]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  return (
    <Container>
      <LinearGradient
        colors={['#1A1A2E', '#0A0A14']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header Section */}
          <HeaderContainer>
            <AvatarSection>
              <AvatarWrapper>
                {profile.avatar ? (
                  <Avatar source={{ uri: profile.avatar }} />
                ) : (
                  <AvatarPlaceholder>
                    <Ionicons name="person" size={50} color="#6C63FF" />
                  </AvatarPlaceholder>
                )}
                <TouchableOpacity onPress={handlePickImage}>
                  <EditAvatarButton>
                    <Ionicons name="camera" size={20} color="#fff" />
                  </EditAvatarButton>
                </TouchableOpacity>
              </AvatarWrapper>
              
              <ProfileName>{profile.name}</ProfileName>
              <ProfileLevel>{profile.level}</ProfileLevel>
              <ProfileBio>{profile.bio}</ProfileBio>
            </AvatarSection>
          </HeaderContainer>

          {/* Stats Section */}
          <StatsContainer>
            <StatCard icon="palette" value={profile.designs} label="Designs" />
            <StatCard icon="account-group" value={profile.followers} label="Followers" />
            <StatCard icon="heart" value={profile.following} label="Following" />
          </StatsContainer>

          {/* Tabs */}
          <TabsContainer>
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => setActiveTab('portfolio')}
            >
              {activeTab === 'portfolio' ? (
                <ActiveTabButton>
                  <ActiveTabText>Portfolio</ActiveTabText>
                </ActiveTabButton>
              ) : (
                <TabButton>
                  <TabText>Portfolio</TabText>
                </TabButton>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => setActiveTab('achievements')}
            >
              {activeTab === 'achievements' ? (
                <ActiveTabButton>
                  <ActiveTabText>Achievements</ActiveTabText>
                </ActiveTabButton>
              ) : (
                <TabButton>
                  <TabText>Achievements</TabText>
                </TabButton>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => setActiveTab('settings')}
            >
              {activeTab === 'settings' ? (
                <ActiveTabButton>
                  <ActiveTabText>Settings</ActiveTabText>
                </ActiveTabButton>
              ) : (
                <TabButton>
                  <TabText>Settings</TabText>
                </TabButton>
              )}
            </TouchableOpacity>
          </TabsContainer>

          {/* Content */}
          <ContentContainer>
            {activeTab === 'settings' && (
              <YStack gap="$3">
                <SettingItem
                  icon="bell"
                  label="Notifications"
                  value={settings.notifications}
                  onToggle={(value) => setSettings({ ...settings, notifications: value })}
                />
                <SettingItem
                  icon="theme-light-dark"
                  label="Dark Mode"
                  value={settings.darkMode}
                  onToggle={(value) => setSettings({ ...settings, darkMode: value })}
                />
                <SettingItem
                  icon="content-save-auto"
                  label="Auto Save"
                  value={settings.autoSave}
                  onToggle={(value) => setSettings({ ...settings, autoSave: value })}
                />
                <SettingItem
                  icon="cloud-sync"
                  label="Cloud Sync"
                  value={settings.syncCloud}
                  onToggle={(value) => setSettings({ ...settings, syncCloud: value })}
                />
                <SettingItem
                  icon="lock"
                  label="Private Profile"
                  value={settings.privateProfile}
                  onToggle={(value) => setSettings({ ...settings, privateProfile: value })}
                />

                {/* Logout Button */}
                <TouchableOpacity
                  onPress={confirmSignOut}
                  disabled={isSigningOut}
                  style={{ marginTop: 20 }}
                >
                  <LinearGradient
                    colors={isSigningOut ? ['#888', '#666'] : ['#FF6B6B', '#FF5252']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      padding: 18,
                      borderRadius: 15,
                      alignItems: 'center',
                      opacity: isSigningOut ? 0.7 : 1,
                    }}
                  >
                    {isSigningOut ? (
                      <XStack gap="$3" alignItems="center">
                        <ActivityIndicator size="small" color="#fff" />
                        <LogoutText>Logging out...</LogoutText>
                      </XStack>
                    ) : (
                      <LogoutText>Log Out</LogoutText>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </YStack>
            )}
          </ContentContainer>
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

export default ProfileScreenRedesigned;

