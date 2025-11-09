import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from './tamagui';
import { Text } from './tamagui';

const { width, height } = Dimensions.get('window');

// Styled components using Tamagui
const Overlay = styled(Stack, {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'flex-end',
});

const Backdrop = styled(Stack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const Container = styled(Stack, {
  maxHeight: height * 0.8,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  overflow: 'hidden',
});

const GradientWrapper = styled(Stack, {
  paddingBottom: 20,
});

const Header = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  paddingTop: 25,
});

const HeaderLeft = styled(XStack, {
  alignItems: 'center',
});

const HeaderTitle = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginLeft: 10,
});

const CloseButton = styled(Stack, {
  padding: 5,
});

const Content = styled(Stack, {
  paddingHorizontal: 20,
});

const TipCard = styled(Stack, {
  backgroundColor: '$bgCard',
  borderRadius: 20,
  padding: 25,
  alignItems: 'center',
  marginBottom: 20,
});

const IconContainer = styled(Stack, {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#6C63FF20',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
});

const Category = styled(Text, {
  fontSize: 12,
  color: '$primary',
  fontWeight: '600',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 1,
});

const TipTitle = styled(Text, {
  fontSize: 22,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 12,
  textAlign: 'center',
});

const TipText = styled(Text, {
  fontSize: 16,
  color: '#ccc',
  lineHeight: 24,
  textAlign: 'center',
});

const ProgressContainer = styled(XStack, {
  marginTop: 20,
  justifyContent: 'center',
});

const ProgressDot = styled(Stack, {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#444',
  marginHorizontal: 4,
  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
        width: 24,
      },
    },
  } as const,
});

const Navigation = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
});

const NavButton = styled(XStack, {
  alignItems: 'center',
  padding: 10,
});

const NavButtonText = styled(Text, {
  color: '$textPrimary',
  fontSize: 16,
  marginHorizontal: 5,
});

const Counter = styled(Text, {
  color: '$textSecondary',
  fontSize: 14,
});

const Settings = styled(Stack, {
  borderTopWidth: 1,
  borderTopColor: '#333',
  paddingTop: 20,
});

const SettingRow = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
});

const SettingText = styled(Text, {
  color: '$textPrimary',
  fontSize: 16,
});

const Toggle = styled(Stack, {
  width: 50,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#444',
  justifyContent: 'center',
  padding: 2,
  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
      },
    },
  } as const,
});

const ToggleThumb = styled(Stack, {
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: '$textPrimary',
  variants: {
    active: {
      true: {
        alignSelf: 'flex-end',
      },
    },
  } as const,
});

interface DesignTipsProps {
  visible: boolean;
  onClose: () => void;
  context?: 'general' | 'color' | 'patterns' | 'fabric' | 'export';
}

const DesignTips: React.FC<DesignTipsProps> = ({ visible, onClose, context = 'general' }) => {
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

  const savePreference = async (value: boolean) => {
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

  const handleToggleTips = async (value: boolean) => {
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
        style={{
          flex: 1,
          opacity: fadeAnim,
        }}
      >
        <Overlay>
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            activeOpacity={1}
            onPress={handleClose}
          />
          
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Container>
              <LinearGradient
                colors={['#1A1A2E', '#16213E']}
                style={{ paddingBottom: 20 }}
              >
                {/* Header */}
                <Header>
                  <HeaderLeft>
                    <MaterialCommunityIcons
                      name="lightbulb-on"
                      size={24}
                      color="#FFD93D"
                    />
                    <HeaderTitle>Design Tips</HeaderTitle>
                  </HeaderLeft>
                  <TouchableOpacity onPress={handleClose}>
                    <CloseButton>
                      <Ionicons name="close" size={24} color="#fff" />
                    </CloseButton>
                  </TouchableOpacity>
                </Header>

                {/* Tip Content */}
                <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                  <TipCard>
                    <IconContainer>
                      <MaterialCommunityIcons
                        name={currentTip.icon}
                        size={48}
                        color="#6C63FF"
                      />
                    </IconContainer>
                    
                    <Category>{currentTip.category}</Category>
                    <TipTitle>{currentTip.title}</TipTitle>
                    <TipText>{currentTip.tip}</TipText>

                    {/* Progress Indicator */}
                    <ProgressContainer>
                      {currentTips.map((_, index) => (
                        <ProgressDot key={index} active={index === currentTipIndex} />
                      ))}
                    </ProgressContainer>
                  </TipCard>

                  {/* Navigation */}
                  <Navigation>
                    <TouchableOpacity onPress={handlePrevious}>
                      <NavButton>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                        <NavButtonText>Previous</NavButtonText>
                      </NavButton>
                    </TouchableOpacity>

                    <Counter>
                      {currentTipIndex + 1} / {currentTips.length}
                    </Counter>

                    <TouchableOpacity onPress={handleNext}>
                      <NavButton>
                        <NavButtonText>Next</NavButtonText>
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                      </NavButton>
                    </TouchableOpacity>
                  </Navigation>

                  {/* Settings */}
                  <Settings>
                    <TouchableOpacity onPress={() => handleToggleTips(!showTips)}>
                      <SettingRow>
                        <SettingText>Show tips on startup</SettingText>
                        <Toggle active={showTips}>
                          <ToggleThumb active={showTips} />
                        </Toggle>
                      </SettingRow>
                    </TouchableOpacity>
                  </Settings>
                </ScrollView>
              </LinearGradient>
            </Container>
          </Animated.View>
        </Overlay>
      </Animated.View>
    </Modal>
  );
};

export default DesignTips;
