import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, Dimensions, Modal, ScrollView, Platform } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text as TamaguiText } from './Text';

const { width, height } = Dimensions.get('window');

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface Tip {
  icon: string;
  title: string;
  tip: string;
  category: string;
}

interface DesignTipsProps {
  visible: boolean;
  onClose: () => void;
  context?: 'general' | 'color' | 'patterns' | 'fabric' | '3d';
}

const Overlay = styled(Animated.View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  justifyContent: 'flex-end',
});

const Backdrop = styled(TouchableOpacity, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

const Container = styled(Animated.View, {
  width: '100%',
  maxHeight: height * 0.8,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  overflow: 'hidden',
});

const Header = styled(XStack, {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 16,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const HeaderLeft = styled(YStack, {
  flex: 1,
});

const HeaderTitle = styled(TamaguiText, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 4,
});

const HeaderSubtitle = styled(TamaguiText, {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.7)',
});

const CloseButton = styled(TouchableOpacity, {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  alignItems: 'center',
  justifyContent: 'center',
});

const ContentContainer = styled(YStack, {
  paddingHorizontal: 20,
  paddingBottom: 20,
});

const TipCard = styled(YStack, {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 16,
  padding: 24,
  marginBottom: 20,
});

const TipHeader = styled(XStack, {
  alignItems: 'center',
  marginBottom: 16,
  gap: 12,
});

const IconContainer = styled(YStack, {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#6C63FF',
  alignItems: 'center',
  justifyContent: 'center',
});

const TipHeaderText = styled(YStack, {
  flex: 1,
});

const TipTitle = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: '600',
  color: '#fff',
  marginBottom: 4,
});

const TipCategory = styled(TamaguiText, {
  fontSize: 12,
  color: '#6C63FF',
  textTransform: 'uppercase',
  fontWeight: '600',
});

const TipText = styled(TamaguiText, {
  fontSize: 15,
  color: 'rgba(255, 255, 255, 0.9)',
  lineHeight: 22,
});

const NavigationRow = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
});

const NavButton = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 12,
  gap: 8,
});

const NavButtonText = styled(TamaguiText, {
  fontSize: 14,
  fontWeight: '600',
  color: '#fff',
});

const ProgressIndicator = styled(XStack, {
  justifyContent: 'center',
  gap: 6,
});

const ProgressDot = styled(YStack, {
  width: 8,
  height: 8,
  borderRadius: 4,
  variants: {
    active: {
      true: {
        backgroundColor: '#6C63FF',
      },
      false: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
  } as any,
});

const ToggleRow = styled(XStack, {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
  padding: 16,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ToggleText = styled(TamaguiText, {
  fontSize: 14,
  color: '#fff',
});

const ToggleButton = styled(TouchableOpacity, {
  width: 50,
  height: 28,
  borderRadius: 14,
  padding: 2,
  justifyContent: 'center',
  variants: {
    active: {
      true: {
        backgroundColor: '#6C63FF',
        alignItems: 'flex-end',
      },
      false: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'flex-start',
      },
    },
  } as any,
});

const ToggleThumb = styled(YStack, {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#fff',
});

const DesignTips: React.FC<DesignTipsProps> = ({ visible, onClose, context = 'general' }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const tips: Record<string, Tip[]> = {
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
        title: 'Fabric Choice',
        tip: 'Consider the occasion and climate when selecting fabrics. Cotton for casual, silk for formal.',
        category: 'Materials',
      },
    ],
    '3d': [
      {
        icon: 'cube-outline',
        title: '3D Modeling Tips',
        tip: 'Start with basic shapes and build complexity gradually. Always preview in different angles.',
        category: '3D Design',
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
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
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <Overlay style={{ opacity: fadeAnim }}>
        <Backdrop activeOpacity={1} onPress={handleClose} />

        <Container style={{ transform: [{ translateY: slideAnim }] }}>
          <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ flex: 1 }}>
            {/* Header */}
            <Header>
              <HeaderLeft>
                <HeaderTitle>💡 Design Tips</HeaderTitle>
                <HeaderSubtitle>Inspiration & best practices</HeaderSubtitle>
              </HeaderLeft>
              <CloseButton onPress={handleClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </CloseButton>
            </Header>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ContentContainer>
                {/* Tip Card */}
                <TipCard>
                  <TipHeader>
                    <IconContainer>
                      <MaterialCommunityIcons name={currentTip.icon as any} size={28} color="#fff" />
                    </IconContainer>
                    <TipHeaderText>
                      <TipTitle>{currentTip.title}</TipTitle>
                      <TipCategory>{currentTip.category}</TipCategory>
                    </TipHeaderText>
                  </TipHeader>
                  <TipText>{currentTip.tip}</TipText>
                </TipCard>

                {/* Navigation */}
                <NavigationRow>
                  <NavButton onPress={handlePrevious} disabled={currentTips.length <= 1}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                    <NavButtonText>Previous</NavButtonText>
                  </NavButton>

                  <ProgressIndicator>
                    {currentTips.map((_, index) => (
                      <ProgressDot key={index} active={index === currentTipIndex} />
                    ))}
                  </ProgressIndicator>

                  <NavButton onPress={handleNext} disabled={currentTips.length <= 1}>
                    <NavButtonText>Next</NavButtonText>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                  </NavButton>
                </NavigationRow>

                {/* Toggle Tips */}
                <ToggleRow>
                  <ToggleText>Show tips at startup</ToggleText>
                  <ToggleButton active={showTips} onPress={() => handleToggleTips(!showTips)}>
                    <ToggleThumb />
                  </ToggleButton>
                </ToggleRow>
              </ContentContainer>
            </ScrollView>
          </LinearGradient>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default DesignTips;
