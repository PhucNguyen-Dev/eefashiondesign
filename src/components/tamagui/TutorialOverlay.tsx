import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Animated, Dimensions, Modal, Platform } from 'react-native';
import { Stack, Text, Button, styled } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTutorialStore } from '@state/appStore';
import { isMobile, getTutorialPosition } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

// Styled components
const Overlay = styled(Stack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
});

const Spotlight = styled(Stack, {
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
});

const TooltipCard = styled(Stack, {
  backgroundColor: '$background',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 10,
});

const IconCircle = styled(Stack, {
  width: 60,
  height: 60,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '$3',
});

const ProgressDot = styled(Stack, {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginHorizontal: 4,
  variants: {
    active: {
      true: {
        backgroundColor: '#007AFF',
      },
      false: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
  } as const,
});

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  targetArea: { x: number; y: number; width: number; height: number } | null;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: string;
}

interface TutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [dimensions, setDimensions] = useState({ width, height });

  const {
    currentStep,
    nextStep,
    previousStep,
    closeTutorial,
  } = useTutorialStore();

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const { width: w, height: h } = Dimensions.get('window');
      setDimensions({ width: w, height: h });
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => {
      subscription?.remove?.();
    };
  }, []);

  // Calculate tutorial steps dynamically
  const tutorialSteps: TutorialStep[] = useMemo(() => {
    const { width: w, height: h } = dimensions;
    
    return [
      {
        id: 0,
        title: 'Welcome to FashionCraft Studio! 👋',
        description: 'Let\'s take a quick tour of the app and show you how to create your first design.',
        targetArea: null,
        position: 'center',
        icon: 'party-popper',
      },
      {
        id: 1,
        title: 'Design Studio',
        description: 'This is where the magic happens! Use the toolbar to add shapes, text, and customize your designs.',
        targetArea: { x: 20, y: h - 200, width: w - 40, height: 100 },
        position: 'top',
        icon: 'palette',
      },
      {
        id: 2,
        title: 'Drawing Tools',
        description: 'Choose from various drawing tools like pen, shapes, and text to bring your ideas to life.',
        targetArea: { x: 20, y: 100, width: w - 40, height: 80 },
        position: 'bottom',
        icon: 'pencil',
      },
      {
        id: 3,
        title: 'Layers Panel',
        description: 'Manage your design layers here. Organize, show/hide, and reorder elements easily.',
        targetArea: { x: w - 100, y: 200, width: 80, height: 150 },
        position: 'left',
        icon: 'layers',
      },
      {
        id: 4,
        title: 'Template Library',
        description: 'Browse pre-made templates to kickstart your designs. Choose from hundreds of options!',
        targetArea: { x: 20, y: h - 100, width: 80, height: 80 },
        position: 'top',
        icon: 'folder-multiple',
      },
      {
        id: 5,
        title: 'Export Options',
        description: 'Save and share your designs in multiple formats: PNG, JPG, SVG, and PDF.',
        targetArea: { x: w - 100, y: 50, width: 80, height: 80 },
        position: 'bottom',
        icon: 'export',
      },
      {
        id: 6,
        title: 'You\'re All Set! 🎉',
        description: 'You\'re ready to start creating amazing fashion designs. Have fun!',
        targetArea: null,
        position: 'center',
        icon: 'check-circle',
      },
    ];
  }, [dimensions]);

  const currentTutorial = tutorialSteps[currentStep] || tutorialSteps[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
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
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      nextStep();
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      previousStep();
    }
  };

  const handleClose = () => {
    closeTutorial();
    if (onClose) onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  const renderHighlight = () => {
    if (!currentTutorial.targetArea) return null;

    const { x, y, width: w, height: h } = currentTutorial.targetArea;

    return (
      <>
        <Spotlight
          left={x}
          top={y}
          width={w}
          height={h}
        />
        <Animated.View
          style={{
            position: 'absolute',
            left: x - 4,
            top: y - 4,
            width: w + 8,
            height: h + 8,
            borderWidth: 2,
            borderColor: '#007AFF',
            borderRadius: 10,
            opacity: fadeAnim,
          }}
        />
      </>
    );
  };

  const renderTooltip = () => {
    const tutorialPos = getTutorialPosition();
    const screenWidth = dimensions.width;
    const screenHeight = dimensions.height;

    const tooltipWidth = Math.min(tutorialPos.tooltipMaxWidth, screenWidth * 0.85);
    
    let tooltipStyle: any = {
      position: 'absolute' as const,
      width: tooltipWidth,
      top: screenHeight / 2 - 175,
      left: (screenWidth - tooltipWidth) / 2,
      borderRadius: 15,
      overflow: 'hidden',
    };

    const shouldCenter = isMobile() || !currentTutorial.targetArea || currentTutorial.position === 'center';

    if (!shouldCenter && currentTutorial.targetArea) {
      const { x, y, width: w, height: h } = currentTutorial.targetArea;
      const tooltipHeight = 220;
      
      switch (currentTutorial.position) {
        case 'top':
          tooltipStyle = {
            position: 'absolute' as const,
            left: Math.max(20, Math.min(x + w / 2 - tooltipWidth / 2, screenWidth - tooltipWidth - 20)),
            top: Math.max(20, y - tooltipHeight - 30),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          break;
        case 'bottom':
          tooltipStyle = {
            position: 'absolute' as const,
            left: Math.max(20, Math.min(x + w / 2 - tooltipWidth / 2, screenWidth - tooltipWidth - 20)),
            top: Math.min(y + h + 30, screenHeight - tooltipHeight - 20),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          break;
        case 'left':
          tooltipStyle = {
            position: 'absolute' as const,
            left: Math.max(20, x - tooltipWidth - 30),
            top: Math.max(20, y + h / 2 - tooltipHeight / 2),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          break;
        case 'right':
          tooltipStyle = {
            position: 'absolute' as const,
            left: Math.min(x + w + 30, screenWidth - tooltipWidth - 20),
            top: Math.max(20, y + h / 2 - tooltipHeight / 2),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          break;
      }
    }

    return (
      <Animated.View
        style={{
          ...tooltipStyle,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TooltipCard padding="$4">
            <Stack alignItems="center" marginBottom="$3">
              <IconCircle backgroundColor="rgba(255, 255, 255, 0.2)">
                <MaterialCommunityIcons
                  name={currentTutorial.icon as any}
                  size={30}
                  color="#fff"
                />
              </IconCircle>
              
              <Text
                fontSize={22}
                fontWeight="bold"
                color="#fff"
                textAlign="center"
              >
                {currentTutorial.title}
              </Text>
            </Stack>

            <Text
              fontSize={15}
              color="rgba(255, 255, 255, 0.9)"
              textAlign="center"
              marginBottom="$4"
              lineHeight={22}
            >
              {currentTutorial.description}
            </Text>

            {/* Progress dots */}
            <Stack flexDirection="row" justifyContent="center" marginBottom="$4">
              {tutorialSteps.map((_, index) => (
                <ProgressDot key={index} active={index === currentStep} />
              ))}
            </Stack>

            {/* Navigation buttons */}
            <Stack flexDirection="row" justifyContent="space-between" gap="$2">
              {currentStep === 0 ? (
                <Button
                  flex={1}
                  size="$4"
                  onPress={handleSkip}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  color="#fff"
                  pressStyle={{ opacity: 0.8 }}
                >
                  Skip
                </Button>
              ) : (
                <Button
                  flex={1}
                  size="$4"
                  onPress={handlePrevious}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  color="#fff"
                  icon={<MaterialCommunityIcons name="chevron-left" size={20} color="#fff" />}
                  pressStyle={{ opacity: 0.8 }}
                >
                  Previous
                </Button>
              )}

              <Button
                flex={1}
                size="$4"
                onPress={handleNext}
                backgroundColor="#fff"
                color="#667eea"
                iconAfter={currentStep === tutorialSteps.length - 1 ? 
                  <MaterialCommunityIcons name="check" size={20} color="#667eea" /> : 
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#667eea" />
                }
                pressStyle={{ opacity: 0.9 }}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </TooltipCard>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Overlay>
          {renderHighlight()}
          {renderTooltip()}
        </Overlay>
      </Animated.View>
    </Modal>
  );
};

export default TutorialOverlay;
