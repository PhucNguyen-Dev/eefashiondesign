import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '../../config/constants';
import { useTutorialStore } from '../../store';
import { isMobile, getTutorialPosition } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

/**
 * Tutorial Overlay Component
 * Highlights UI elements and shows helpful tooltips
 */
const TutorialOverlay = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [dimensions, setDimensions] = useState({ width, height });

  const {
    currentStep,
    nextStep,
    previousStep,
    closeTutorial,
    completedSteps,
  } = useTutorialStore();

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const { width: w, height: h } = Dimensions.get('window');
      setDimensions({ width: w, height: h });
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // FIXED: Calculate tutorial steps dynamically based on current dimensions
  const tutorialSteps = React.useMemo(() => {
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
        {/* Spotlight effect */}
        <View
          style={[
            styles.spotlight,
            {
              left: x,
              top: y,
              width: w,
              height: h,
            },
          ]}
        />
        {/* Pulse animation border */}
        <Animated.View
          style={[
            styles.highlightBorder,
            {
              left: x - 4,
              top: y - 4,
              width: w + 8,
              height: h + 8,
              opacity: fadeAnim,
            },
          ]}
        />
      </>
    );
  };

  const renderTooltip = () => {
    const tutorialPos = getTutorialPosition();
    const screenWidth = dimensions.width;
    const screenHeight = dimensions.height;

    // Calculate responsive tooltip dimensions
    const tooltipWidth = Math.min(tutorialPos.tooltipMaxWidth, screenWidth * 0.85);

    // Default centered style - FIXED: Proper centering with alignSelf
    let tooltipStyle = {
      position: 'absolute',
      width: tooltipWidth,
      top: screenHeight / 2 - 175,
      alignSelf: 'center',
      left: (screenWidth - tooltipWidth) / 2,
      borderRadius: 15,
      overflow: 'hidden',
    };
    let arrowStyle = null;

    // For mobile and center position, always center the tooltip
    const shouldCenter = isMobile() || !currentTutorial.targetArea || currentTutorial.position === 'center';

    if (!shouldCenter && currentTutorial.targetArea) {
      const { x, y, width: w, height: h } = currentTutorial.targetArea;
      const tooltipWidth = Math.min(tutorialPos.tooltipMaxWidth, screenWidth * 0.85);
      const tooltipHeight = 220; // Approximate height
      
      switch (currentTutorial.position) {
        case 'top':
          tooltipStyle = {
            position: 'absolute',
            left: Math.max(20, Math.min(x + w / 2 - tooltipWidth / 2, screenWidth - tooltipWidth - 20)),
            top: Math.max(20, y - tooltipHeight - 30),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          arrowStyle = { 
            ...styles.arrow, 
            ...styles.arrowDown,
            left: x + w / 2 - 10,
            top: y - 15,
          };
          break;
        case 'bottom':
          tooltipStyle = {
            position: 'absolute',
            left: Math.max(20, Math.min(x + w / 2 - tooltipWidth / 2, screenWidth - tooltipWidth - 20)),
            top: Math.min(screenHeight - tooltipHeight - 60, y + h + 20),
            width: tooltipWidth,
            borderRadius: 15,
            overflow: 'hidden',
          };
          arrowStyle = { 
            ...styles.arrow, 
            ...styles.arrowUp,
            left: x + w / 2 - 10,
            top: y + h + 5,
          };
          break;
        case 'left':
          tooltipStyle = {
            position: 'absolute',
            left: 20,
            top: Math.max(20, Math.min(y + h / 2 - 100, screenHeight - tooltipHeight - 60)),
            width: Math.min(Math.max(200, x - 60), tooltipWidth),
            borderRadius: 15,
            overflow: 'hidden',
          };
          arrowStyle = { 
            ...styles.arrow, 
            ...styles.arrowRight,
            left: Math.min(Math.max(200, x - 60), tooltipWidth) + 15,
            top: y + h / 2 - 10,
          };
          break;
        case 'right':
          tooltipStyle = {
            position: 'absolute',
            left: Math.max(40, x + w + 20),
            top: Math.max(20, Math.min(y + h / 2 - 100, screenHeight - tooltipHeight - 60)),
            width: Math.min(Math.max(200, screenWidth - x - w - 60), tooltipWidth),
            borderRadius: 15,
            overflow: 'hidden',
          };
          arrowStyle = { 
            ...styles.arrow, 
            ...styles.arrowLeft,
            left: x + w + 5,
            top: y + h / 2 - 10,
          };
          break;
      }
    }

    return (
      <Animated.View
        style={[
          tooltipStyle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        pointerEvents="auto"
      >
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={[styles.tooltipGradient, { padding: tutorialPos.tooltipPadding }]}
        >
          {/* Header with icon and step counter */}
          <View style={styles.tooltipHeader}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={currentTutorial.icon}
                size={tutorialPos.iconSize}
                color="#fff"
              />
            </View>
            <View style={styles.stepIndicator}>
              <Text style={[styles.stepText, { fontSize: tutorialPos.fontSize }]}>
                {currentStep + 1} / {tutorialSteps.length}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            style={[styles.tooltipTitle, { fontSize: tutorialPos.fontSize + 6 }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {currentTutorial.title}
          </Text>

          {/* Description with scroll */}
          <View style={styles.descriptionContainer}>
            <ScrollView
              style={styles.descriptionScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Text style={[styles.tooltipDescription, { fontSize: tutorialPos.fontSize }]}>
                {currentTutorial.description}
              </Text>
            </ScrollView>
          </View>

          {/* Action buttons */}
          <View style={styles.tooltipActions}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[styles.buttonSecondary, { padding: tutorialPos.buttonPadding }]}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonSecondaryText, { fontSize: tutorialPos.fontSize }]}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.buttonSkip, { padding: tutorialPos.buttonPadding }]}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonSkipText, { fontSize: tutorialPos.fontSize }]}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, { padding: tutorialPos.buttonPadding }]}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonPrimaryText, { fontSize: tutorialPos.fontSize }]}>
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {arrowStyle && !isMobile() && <View style={arrowStyle} />}
      </Animated.View>
    );
  };

  // Only show when explicitly set via visible prop
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.container} pointerEvents="box-none">
        {/* Dark overlay with cutout - blocks touches but is non-interactive */}
        <View style={styles.overlay} pointerEvents="none">
          {renderHighlight()}
        </View>

        {/* Tooltip - This should capture touches */}
        {renderTooltip()}

        {/* Progress dots */}
        <View style={styles.progressDots} pointerEvents="none">
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.dotActive,
                completedSteps.includes(index) && styles.dotCompleted,
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    pointerEvents: 'none',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  highlightBorder: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltip: {
    position: 'absolute',
    borderRadius: 15,
    overflow: 'hidden',
  },
  tooltipCenter: {
    position: 'absolute',
    left: width * 0.05,
    right: width * 0.05,
    top: height / 2 - 150,
    maxWidth: Math.min(600, width * 0.9),
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  tooltipGradient: {
    padding: 20,
    minHeight: 280,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  stepText: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  tooltipTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 26,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  tooltipDescription: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  descriptionScroll: {
    maxHeight: 80,
  },
  tooltipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
  },
  buttonSkip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonSkipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FONT_SIZES.sm,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowUp: {
    top: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.primary,
  },
  arrowDown: {
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.secondary,
  },
  arrowLeft: {
    left: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: COLORS.primary,
  },
  arrowRight: {
    right: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: COLORS.secondary,
  },
  progressDots: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotCompleted: {
    backgroundColor: COLORS.success,
  },
});

export default TutorialOverlay;
