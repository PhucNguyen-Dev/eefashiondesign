import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

/**
 * Design Tips and Suggestions Component
 * Provides contextual tips and suggestions to enhance user creativity
 */
const DesignTips = ({ visible, onClose, context = 'general' }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  // Contextual tips based on user activity
  const tips = {
    general: [
      {
        icon: 'palette',
        title: 'Color Harmony',
        tip: 'Use the color wheel to find complementary colors. Colors opposite each other create vibrant contrast!',
        category: 'Color',
      },
      {
        icon: 'lightbulb-on',
        title: 'Save Your Work',
        tip: 'Auto-save is enabled, but you can manually save anytime with Ctrl+S (Cmd+S on Mac).',
        category: 'Workflow',
      },
      {
        icon: 'undo',
        title: 'Quick Undo/Redo',
        tip: 'Made a mistake? Use Ctrl+Z to undo and Ctrl+Y to redo. Your last 50 actions are saved!',
        category: 'Workflow',
      },
      {
        icon: 'layers',
        title: 'Layer Organization',
        tip: 'Keep your design organized by using layers. Name them descriptively for easier navigation.',
        category: 'Organization',
      },
      {
        icon: 'star',
        title: 'Inspiration from Nature',
        tip: 'Nature provides the best color palettes! Try colors inspired by sunsets, oceans, or forests.',
        category: 'Inspiration',
      },
    ],
    color: [
      {
        icon: 'palette',
        title: '60-30-10 Rule',
        tip: 'Use 60% dominant color, 30% secondary color, and 10% accent color for balanced designs.',
        category: 'Color Theory',
      },
      {
        icon: 'eyedropper',
        title: 'Color Psychology',
        tip: 'Red = passion, Blue = trust, Green = nature, Yellow = happiness. Choose colors that match your mood!',
        category: 'Color Theory',
      },
      {
        icon: 'gradient',
        title: 'Gradient Magic',
        tip: 'Gradients add depth and dimension. Try gradients with similar hues for elegant effects.',
        category: 'Color',
      },
    ],
    patterns: [
      {
        icon: 'texture-box',
        title: 'Pattern Scale',
        tip: 'Large patterns make bold statements, while small patterns add subtle texture.',
        category: 'Patterns',
      },
      {
        icon: 'grid',
        title: 'Mix Patterns',
        tip: 'Mix different pattern scales for visual interest, but keep color palettes consistent.',
        category: 'Patterns',
      },
    ],
    fabric: [
      {
        icon: 'tshirt-crew',
        title: 'Fabric Properties',
        tip: 'Consider fabric weight and drape. Silk flows, denim structures, leather accents.',
        category: 'Materials',
      },
      {
        icon: 'texture',
        title: 'Texture Contrast',
        tip: 'Combine smooth and textured fabrics for visual and tactile interest.',
        category: 'Materials',
      },
    ],
    export: [
      {
        icon: 'share',
        title: 'Social Media Ready',
        tip: 'Export your designs optimized for Instagram, Pinterest, or any platform!',
        category: 'Export',
      },
      {
        icon: 'file-image',
        title: 'High Resolution',
        tip: 'For prints, export at 300 DPI. For web, 72 DPI is sufficient.',
        category: 'Export',
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Load show tips preference
  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const preference = await AsyncStorage.getItem('@show_tips');
      if (preference !== null) {
        setShowTips(JSON.parse(preference));
      }
    } catch (error) {
      // Ignore error
    }
  };

  const savePreference = async (value) => {
    try {
      await AsyncStorage.setItem('@show_tips', JSON.stringify(value));
    } catch (error) {
      // Ignore error
    }
  };

  const currentTips = tips[context] || tips.general;

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentTipIndex((prev) => (prev + 1) % currentTips.length);
  };

  const handlePrevious = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentTipIndex((prev) => (prev - 1 + currentTips.length) % currentTips.length);
  };

  const handleToggleTips = async (value) => {
    setShowTips(value);
    await savePreference(value);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onClose();
  };

  const currentTip = currentTips[currentTipIndex];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#1A1A2E', '#16213E']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={24}
                  color="#FFD93D"
                />
                <Text style={styles.headerTitle}>Design Tips</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tip Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.tipCard}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={currentTip.icon}
                    size={48}
                    color="#6C63FF"
                  />
                </View>
                
                <Text style={styles.category}>{currentTip.category}</Text>
                <Text style={styles.tipTitle}>{currentTip.title}</Text>
                <Text style={styles.tipText}>{currentTip.tip}</Text>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                  {currentTips.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        index === currentTipIndex && styles.progressDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Navigation */}
              <View style={styles.navigation}>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handlePrevious}
                >
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>

                <Text style={styles.counter}>
                  {currentTipIndex + 1} / {currentTips.length}
                </Text>

                <TouchableOpacity
                  style={styles.navButton}
                  onPress={handleNext}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Settings */}
              <View style={styles.settings}>
                <TouchableOpacity
                  style={styles.settingRow}
                  onPress={() => handleToggleTips(!showTips)}
                >
                  <Text style={styles.settingText}>Show tips on startup</Text>
                  <View
                    style={[
                      styles.toggle,
                      showTips && styles.toggleActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        showTips && styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    maxHeight: height * 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 25,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 20,
  },
  tipCard: {
    backgroundColor: '#2A2A3E',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  category: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#6C63FF',
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 5,
  },
  counter: {
    color: '#888',
    fontSize: 14,
  },
  settings: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#444',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#6C63FF',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});

export default DesignTips;
