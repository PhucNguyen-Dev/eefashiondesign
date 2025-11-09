import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, Text, styled } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
}

interface SettingItemProps {
  icon: string;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

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

const Container = styled(Stack, {
  flex: 1,
  backgroundColor: '#0F0F1E',
});

const HeaderGradient = styled(Stack, {
  padding: 20,
  paddingTop: 40,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
});

const AvatarContainer = styled(Stack, {
  alignSelf: 'center',
  marginBottom: 15,
});

const Avatar = styled(Image, {
  width: 100,
  height: 100,
  borderRadius: 50,
  borderWidth: 3,
  borderColor: '#fff',
});

const AvatarPlaceholder = styled(Stack, {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#fff',
});

const EditAvatarButton = styled(Stack, {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#FF6B6B',
  width: 30,
  height: 30,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#fff',
});

const ProfileName = styled(Text, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginBottom: 5,
});

const ProfileLevel = styled(Text, {
  fontSize: 14,
  color: 'rgba(255,255,255,0.8)',
  textAlign: 'center',
  marginBottom: 10,
});

const ProfileBio = styled(Text, {
  fontSize: 14,
  color: 'rgba(255,255,255,0.7)',
  textAlign: 'center',
  marginBottom: 20,
  paddingHorizontal: 30,
});

const StatsContainer = styled(Stack, {
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const StatCard = styled(Stack, {
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.1)',
  padding: 15,
  borderRadius: 15,
  minWidth: 80,
});

const StatValue = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
  marginTop: 5,
});

const StatLabel = styled(Text, {
  fontSize: 12,
  color: 'rgba(255,255,255,0.7)',
  marginTop: 2,
});

const Tabs = styled(Stack, {
  flexDirection: 'row',
  paddingHorizontal: 20,
  marginBottom: 20,
});

const Tab = styled(Stack, {
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: 'transparent',
});

const ActiveTab = styled(Tab, {
  borderBottomColor: '#6C63FF',
});

const TabText = styled(Text, {
  color: '#888',
  fontSize: 14,
});

const ActiveTabText = styled(Text, {
  color: '#6C63FF',
  fontSize: 14,
  fontWeight: 'bold',
});

const PortfolioGrid = styled(Stack, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
});

const PortfolioItem = styled(Stack, {
  width: '48%',
  height: 150,
  marginBottom: 15,
  borderRadius: 15,
  overflow: 'hidden',
});

const AchievementCard = styled(Stack, {
  flexDirection: 'row',
  backgroundColor: '#1A1A2E',
  padding: 15,
  borderRadius: 15,
  marginBottom: 15,
  marginHorizontal: 20,
});

const AchievementIcon = styled(Stack, {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'rgba(255, 217, 61, 0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
});

const AchievementInfo = styled(Stack, {
  flex: 1,
});

const AchievementTitle = styled(Text, {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 5,
});

const AchievementDescription = styled(Text, {
  fontSize: 12,
  color: '#888',
});

const SettingsContainer = styled(Stack, {
  paddingHorizontal: 20,
});

const SettingItemContainer = styled(Stack, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#1A1A2E',
  padding: 15,
  borderRadius: 15,
  marginBottom: 15,
});

const SettingLeft = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
});

const SettingLabel = styled(Text, {
  color: '#fff',
  fontSize: 16,
  marginLeft: 15,
});

const LogoutButton = styled(Stack, {
  backgroundColor: '#FF6B6B',
  padding: 15,
  borderRadius: 15,
  alignItems: 'center',
  marginTop: 20,
});

const LogoutButtonDisabled = styled(LogoutButton, {
  opacity: 0.7,
});

const LogoutText = styled(Text, {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
});

const EditProfileButton = styled(Stack, {
  margin: 20,
});

const EditProfileGradient = styled(Stack, {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 15,
  borderRadius: 25,
});

const EditProfileText = styled(Text, {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 10,
});

const StatCardComponent: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <StatCard>
    <MaterialCommunityIcons name={icon as any} size={24} color="#6C63FF" />
    <StatValue>{value}</StatValue>
    <StatLabel>{label}</StatLabel>
  </StatCard>
);

const SettingItemComponent: React.FC<SettingItemProps> = ({ icon, label, value, onToggle }) => (
  <SettingItemContainer>
    <SettingLeft>
      <MaterialCommunityIcons name={icon as any} size={24} color="#6C63FF" />
      <SettingLabel>{label}</SettingLabel>
    </SettingLeft>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#333', true: '#6C63FF' }}
      thumbColor={value ? '#fff' : '#888'}
    />
  </SettingItemContainer>
);

interface ProfileScreenProps {
  user?: any;
  signOut?: () => Promise<any>;
}

export const TamaguiProfileScreen: React.FC<ProfileScreenProps> = ({ user, signOut }) => {
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

  const [activeTab, setActiveTab] = useState<'portfolio' | 'achievements' | 'settings'>('portfolio');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setProfile((prev) => ({
        ...prev,
        name: 'Fashion Designer',
        email: 'designer@fashioncraft.com',
        avatar: null,
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      name: user.user_metadata?.name || user.email || prev.name,
      email: user.email || prev.email,
      avatar: user.user_metadata?.avatar_url || prev.avatar,
    }));
  }, [user]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  const confirmSignOut = useCallback(() => {
    if (isSigningOut) return;

    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: handleSignOut,
        },
      ],
    );
  }, [handleSignOut, isSigningOut]);

  const achievements = [
    { icon: 'trophy', title: 'First Design', description: 'Created your first design' },
    { icon: 'star', title: 'Popular Designer', description: 'Reached 1000 followers' },
    { icon: 'medal', title: 'Trendsetter', description: 'Design featured in trends' },
  ];

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <Container>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            marginBottom: 20,
          }}
        >
          <LinearGradient
            colors={['#6C63FF', '#4ECDC4']}
            style={{
              padding: 20,
              paddingTop: 40,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
          >
            <TouchableOpacity onPress={pickImage}>
              <AvatarContainer>
                {profile.avatar ? (
                  <Avatar source={{ uri: profile.avatar }} />
                ) : (
                  <AvatarPlaceholder>
                    <MaterialCommunityIcons name="account" size={50} color="#fff" />
                  </AvatarPlaceholder>
                )}
                <EditAvatarButton>
                  <Ionicons name="camera" size={16} color="#fff" />
                </EditAvatarButton>
              </AvatarContainer>
            </TouchableOpacity>
            
            <ProfileName>{profile.name}</ProfileName>
            <ProfileLevel>{profile.level}</ProfileLevel>
            <ProfileBio>{profile.bio}</ProfileBio>
            
            <StatsContainer>
              <StatCardComponent icon="hanger" value={profile.designs} label="Designs" />
              <StatCardComponent icon="account-group" value={profile.followers} label="Followers" />
              <StatCardComponent icon="account-plus" value={profile.following} label="Following" />
            </StatsContainer>
          </LinearGradient>
        </Animated.View>

        {/* Tabs */}
        <Tabs>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setActiveTab('portfolio')}
          >
            {activeTab === 'portfolio' ? (
              <ActiveTab>
                <ActiveTabText>Portfolio</ActiveTabText>
              </ActiveTab>
            ) : (
              <Tab>
                <TabText>Portfolio</TabText>
              </Tab>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setActiveTab('achievements')}
          >
            {activeTab === 'achievements' ? (
              <ActiveTab>
                <ActiveTabText>Achievements</ActiveTabText>
              </ActiveTab>
            ) : (
              <Tab>
                <TabText>Achievements</TabText>
              </Tab>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setActiveTab('settings')}
          >
            {activeTab === 'settings' ? (
              <ActiveTab>
                <ActiveTabText>Settings</ActiveTabText>
              </ActiveTab>
            ) : (
              <Tab>
                <TabText>Settings</TabText>
              </Tab>
            )}
          </TouchableOpacity>
        </Tabs>

        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <PortfolioGrid>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <TouchableOpacity key={item}>
                <PortfolioItem>
                  <LinearGradient
                    colors={['#6C63FF', '#4ECDC4']}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <MaterialCommunityIcons name="tshirt-crew" size={40} color="#fff" />
                  </LinearGradient>
                </PortfolioItem>
              </TouchableOpacity>
            ))}
          </PortfolioGrid>
        )}

        {activeTab === 'achievements' && (
          <Stack>
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.title}>
                <AchievementIcon>
                  <MaterialCommunityIcons name={achievement.icon as any} size={30} color="#FFD93D" />
                </AchievementIcon>
                <AchievementInfo>
                  <AchievementTitle>{achievement.title}</AchievementTitle>
                  <AchievementDescription>{achievement.description}</AchievementDescription>
                </AchievementInfo>
              </AchievementCard>
            ))}
          </Stack>
        )}

        {activeTab === 'settings' && (
          <SettingsContainer>
            <SettingItemComponent
              icon="bell"
              label="Notifications"
              value={settings.notifications}
              onToggle={(value) => setSettings({ ...settings, notifications: value })}
            />
            <SettingItemComponent
              icon="theme-light-dark"
              label="Dark Mode"
              value={settings.darkMode}
              onToggle={(value) => setSettings({ ...settings, darkMode: value })}
            />
            <SettingItemComponent
              icon="content-save"
              label="Auto Save"
              value={settings.autoSave}
              onToggle={(value) => setSettings({ ...settings, autoSave: value })}
            />
            <SettingItemComponent
              icon="cloud-sync"
              label="Cloud Sync"
              value={settings.syncCloud}
              onToggle={(value) => setSettings({ ...settings, syncCloud: value })}
            />
            <SettingItemComponent
              icon="lock"
              label="Private Profile"
              value={settings.privateProfile}
              onToggle={(value) => setSettings({ ...settings, privateProfile: value })}
            />

            <TouchableOpacity
              onPress={confirmSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <LogoutButtonDisabled>
                  <Stack flexDirection="row" alignItems="center">
                    <ActivityIndicator size="small" color="#fff" />
                    <LogoutText style={{ marginLeft: 10 }}>Logging out...</LogoutText>
                  </Stack>
                </LogoutButtonDisabled>
              ) : (
                <LogoutButton>
                  <LogoutText>Log Out</LogoutText>
                </LogoutButton>
              )}
            </TouchableOpacity>
          </SettingsContainer>
        )}

        {/* Edit Profile Button */}
        <TouchableOpacity
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in a future update.')}
        >
          <EditProfileButton>
            <LinearGradient
              colors={['#6C63FF', '#4ECDC4']}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
                borderRadius: 25,
              }}
            >
              <Feather name="edit" size={20} color="#fff" />
              <EditProfileText>Edit Profile</EditProfileText>
            </LinearGradient>
          </EditProfileButton>
        </TouchableOpacity>
      </Container>
    </ScrollView>
  );
};
