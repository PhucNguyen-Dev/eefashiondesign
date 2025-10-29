import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const BottomBar = ({ navigation }) => {
  const actions = [
    {
      id: 'save',
      label: 'Save & Sync',
      icon: 'cloud-upload',
      iconType: 'Feather',
      color: THEME_COLORS.accent.blue,
      gradient: [THEME_COLORS.accent.blue, THEME_COLORS.accent.teal],
    },
    {
      id: 'export',
      label: 'Export Render',
      icon: 'download',
      iconType: 'Feather',
      color: THEME_COLORS.accent.purple,
      gradient: [THEME_COLORS.accent.purple, THEME_COLORS.accent.blue],
    },
    {
      id: 'share',
      label: 'Share & Collaborate',
      icon: 'share-2',
      iconType: 'Feather',
      color: THEME_COLORS.accent.teal,
      gradient: [THEME_COLORS.accent.teal, THEME_COLORS.accent.mint],
    },
  ];

  const renderIcon = (action) => {
    const IconComponent =
      action.iconType === 'Feather'
        ? Feather
        : action.iconType === 'Ionicons'
        ? Ionicons
        : MaterialCommunityIcons;

    return <IconComponent name={action.icon} size={20} color="#FFFFFF" />;
  };

  return (
    <View style={styles.bottomBar}>
      {/* Left Section - Action Buttons */}
      <View style={styles.leftSection}>
        {actions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.actionButton}>
            <LinearGradient
              colors={action.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              {renderIcon(action)}
              <Text style={styles.actionLabel}>{action.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Center Section - View Mode Toggle */}
      <View style={styles.centerSection}>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity style={[styles.viewModeButton, styles.viewModeButtonActive]}>
            <MaterialCommunityIcons name="cube-outline" size={18} color={THEME_COLORS.accent.blue} />
            <Text style={[styles.viewModeText, styles.viewModeTextActive]}>3D View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewModeButton}>
            <MaterialCommunityIcons name="grid" size={18} color={THEME_COLORS.text.secondary} />
            <Text style={styles.viewModeText}>Wireframe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewModeButton}>
            <MaterialCommunityIcons name="texture" size={18} color={THEME_COLORS.text.secondary} />
            <Text style={styles.viewModeText}>Texture</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Section - Zoom & Info */}
      <View style={styles.rightSection}>
        <View style={styles.zoomControl}>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="remove" size={16} color={THEME_COLORS.text.secondary} />
          </TouchableOpacity>
          <View style={styles.zoomIndicator}>
            <MaterialCommunityIcons name="magnify" size={16} color={THEME_COLORS.text.secondary} />
            <Text style={styles.zoomText}>100%</Text>
          </View>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="add" size={16} color={THEME_COLORS.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="triangle-outline" size={14} color={THEME_COLORS.text.tertiary} />
            <Text style={styles.infoText}>12.5K Polygons</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={THEME_COLORS.text.tertiary} />
            <Text style={styles.infoText}>Auto-saved 2m ago</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: THEME_COLORS.background.primary,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.background.tertiary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: THEME_COLORS.background.secondary,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: THEME_COLORS.background.tertiary,
  },
  viewModeText: {
    fontSize: 13,
    color: THEME_COLORS.text.secondary,
  },
  viewModeTextActive: {
    color: THEME_COLORS.accent.blue,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  zoomControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME_COLORS.background.secondary,
    borderRadius: 10,
    padding: 4,
  },
  zoomButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: THEME_COLORS.background.tertiary,
  },
  zoomIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  zoomText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME_COLORS.background.secondary,
    borderRadius: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: THEME_COLORS.text.tertiary,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: THEME_COLORS.background.tertiary,
  },
});

export default BottomBar;

