import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';
import PremiumButton from '../../../../shared/components/PremiumButton';

const Header = ({ navigation }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: '3d-atelier', label: '3D Atelier', icon: 'cube-outline', active: true },
    { id: '2d-design', label: '2D Design', icon: 'brush' },
    { id: 'ar-view', label: 'AR View', icon: 'camera' },
  ];

  return (
    <LinearGradient
      colors={[THEME_COLORS.background.primary, THEME_COLORS.background.secondary]}
      style={styles.header}
    >
      {/* Left Section - Logo & Brand */}
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="hanger" size={28} color={THEME_COLORS.accent.blue} />
          <Text style={styles.brandText}>eefashionita</Text>
        </View>
        <View style={styles.userRole}>
          <Text style={styles.roleText}>Designer</Text>
        </View>
      </View>

      {/* Center Section - Navigation Tabs */}
      <View style={styles.centerSection}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tab.active && styles.tabActive]}
            onPress={() => {
              if (tab.id === 'home') navigation.navigate('Home');
              if (tab.id === '2d-design') navigation.navigate('DesignStudio');
              if (tab.id === 'ar-view') navigation.navigate('ARView');
            }}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={tab.active ? THEME_COLORS.accent.blue : THEME_COLORS.text.secondary}
            />
            <Text style={[styles.tabText, tab.active && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.active && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Right Section - User Profile & Actions */}
      <View style={styles.rightSection}>
        {/* Premium Button */}
        <PremiumButton />

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color={THEME_COLORS.text.secondary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={22} color={THEME_COLORS.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LE</Text>
          </View>
          <Text style={styles.profileName}>Lovely Emma</Text>
          <Ionicons name="chevron-down" size={16} color={THEME_COLORS.text.secondary} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.background.tertiary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
    letterSpacing: -0.5,
  },
  userRole: {
    backgroundColor: THEME_COLORS.accent.purple + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME_COLORS.accent.purple,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: THEME_COLORS.background.tertiary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME_COLORS.text.secondary,
  },
  tabTextActive: {
    color: THEME_COLORS.accent.blue,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: THEME_COLORS.accent.blue,
    borderRadius: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.tertiary,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: THEME_COLORS.accent.coral,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: THEME_COLORS.background.tertiary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.accent.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
});

export default Header;

