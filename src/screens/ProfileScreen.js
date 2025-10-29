import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { useAuth } from '../core/state/hooks/useAuth';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || user?.email || 'Fashion Designer',
    email: user?.email || 'designer@fashioncraft.com',
    bio: 'Passionate about creating unique fashion designs',
    avatar: null,
    level: 'Professional',
    designs: 42,
    followers: 1250,
    following: 320,
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoSave: true,
    syncCloud: true,
    privateProfile: false,
  });

  const [activeTab, setActiveTab] = useState('portfolio');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
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

  const StatCard = ({ icon, value, label }) => (
    <View style={styles.statCard}>
      <MaterialCommunityIcons name={icon} size={24} color="#6C63FF" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  StatCard.propTypes = {
    icon: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    label: PropTypes.string.isRequired,
  };

  const SettingItem = ({ icon, label, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={icon} size={24} color="#6C63FF" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: '#6C63FF' }}
        thumbColor={value ? '#fff' : '#888'}
      />
    </View>
  );

  SettingItem.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  const confirmSignOut = useCallback(() => {
    if (isSigningOut) {
      return;
    }

    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            handleSignOut();
          },
        },
      ],
    );
  }, [handleSignOut, isSigningOut]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#6C63FF', '#4ECDC4']}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={50} color="#fff" />
              </View>
            )}
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileLevel}>{profile.level}</Text>
          <Text style={styles.profileBio}>{profile.bio}</Text>
          
          <View style={styles.statsContainer}>
            <StatCard icon="hanger" value={profile.designs} label="Designs" />
            <StatCard icon="account-group" value={profile.followers} label="Followers" />
            <StatCard icon="account-plus" value={profile.following} label="Following" />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
          onPress={() => setActiveTab('portfolio')}
        >
          <Text style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
            Portfolio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'portfolio' && (
        <View style={styles.portfolioContainer}>
          <View style={styles.portfolioGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <TouchableOpacity key={item} style={styles.portfolioItem}>
                <LinearGradient
                  colors={['#6C63FF', '#4ECDC4']}
                  style={styles.portfolioGradient}
                >
                  <MaterialCommunityIcons name="tshirt-crew" size={40} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'achievements' && (
        <View style={styles.achievementsContainer}>
          {[
            { icon: 'trophy', title: 'First Design', description: 'Created your first design' },
            { icon: 'star', title: 'Popular Designer', description: 'Reached 1000 followers' },
            { icon: 'medal', title: 'Trendsetter', description: 'Design featured in trends' },
          ].map((achievement) => (
            <View key={achievement.title} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <MaterialCommunityIcons name={achievement.icon} size={30} color="#FFD93D" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'settings' && (
        <View style={styles.settingsContainer}>
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
            icon="content-save"
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

          <TouchableOpacity
            style={[styles.logoutButton, isSigningOut && styles.logoutButtonDisabled]}
            onPress={confirmSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <View style={styles.logoutLoading}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.logoutText, styles.logoutLoadingText]}>Logging out...</Text>
              </View>
            ) : (
              <Text style={styles.logoutText}>Log Out</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in a future update.')}
      >
        <LinearGradient
          colors={['#6C63FF', '#4ECDC4']}
          style={styles.editProfileGradient}
        >
          <Feather name="edit" size={20} color="#fff" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarButton: {
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
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  profileLevel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 15,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6C63FF',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
  },
  activeTabText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  portfolioContainer: {
    paddingHorizontal: 20,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  portfolioGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#888',
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutLoadingText: {
    marginLeft: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editProfileButton: {
    margin: 20,
  },
  editProfileGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;
