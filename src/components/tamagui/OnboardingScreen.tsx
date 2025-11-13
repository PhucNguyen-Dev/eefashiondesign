import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList } from 'react-native';
import { Stack, Text, Button, styled, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@state/appStore';

const { width, height } = Dimensions.get('window');

// Styled components
const Container = styled(Stack, {
  flex: 1,
});

const SkipButton = styled(Button, {
  position: 'absolute',
  top: 50,
  right: 20,
  zIndex: 1,
  backgroundColor: 'transparent',
});

const Slide = styled(Stack, {
  width,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 40,
});

const IconContainer = styled(Stack, {
  marginBottom: 40,
});

const IconGradient = styled(Stack, {
  width: 160,
  height: 160,
  borderRadius: 80,
  justifyContent: 'center',
  alignItems: 'center',
});

const Footer = styled(Stack, {
  height: 200,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 40,
  paddingHorizontal: 40,
});

const Pagination = styled(Stack, {
  flexDirection: 'row',
  height: 40,
  alignItems: 'center',
});

interface OnboardingData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string[];
}

interface OnboardingScreenProps {
  navigation: any;
}

const onboardingData: OnboardingData[] = [
  {
    id: '1',
    title: 'Create Stunning Designs',
    description: 'Design custom fashion pieces with our intuitive studio. From sketches to final products.',
    icon: 'palette-swatch',
    color: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    title: 'Visualize in 3D',
    description: 'See your designs come to life in real-time 3D. Rotate, zoom, and perfect every detail.',
    icon: 'rotate-3d-variant',
    color: ['#f093fb', '#f5576c'],
  },
  {
    id: '3',
    title: 'AI-Powered Assistant',
    description: 'Get design suggestions, trend insights, and personalized recommendations from our AI.',
    icon: 'robot',
    color: ['#4facfe', '#00f2fe'],
  },
  {
    id: '4',
    title: 'Collaborate & Share',
    description: 'Work with others in real-time and share your creations with the fashion community.',
    icon: 'account-group',
    color: ['#43e97b', '#38f9d7'],
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { setOnboardingCompleted } = useAppStore();
  const theme = useTheme();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setOnboardingCompleted(true);
    navigation.replace('Main');
  };

  const handleSkip = () => {
    setOnboardingCompleted(true);
    navigation.replace('Main');
  };

  const renderItem = ({ item }: { item: OnboardingData }) => {
    return (
      <Slide>
        <IconContainer>
          <LinearGradient
            colors={item.color}
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name={item.icon as any} size={80} color="#fff" />
          </LinearGradient>
        </IconContainer>

        <Text
          fontSize={32}
          fontWeight="bold"
          color="$textPrimary"
          textAlign="center"
          marginBottom={20}
        >
          {item.title}
        </Text>
        
        <Text
          fontSize={18}
          color="$textSecondary"
          textAlign="center"
          lineHeight={28}
          paddingHorizontal={20}
        >
          {item.description}
        </Text>
      </Slide>
    );
  };

  const PaginationDots = () => {
    return (
      <Pagination>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#007AFF',
                marginHorizontal: 4,
                width: dotWidth,
                opacity,
              }}
            />
          );
        })}
      </Pagination>
    );
  };

  return (
    <LinearGradient
      colors={['#1A1A2E', '#16213E']}
      style={{ flex: 1 }}
    >
      <Container>
        {/* Skip Button */}
        <SkipButton onPress={handleSkip} pressStyle={{ opacity: 0.7 }}>
          <Text color="$textSecondary" fontSize={16}>
            Skip
          </Text>
        </SkipButton>

        {/* Slides */}
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />

        {/* Footer */}
        <Footer>
          <PaginationDots />

          <Button
            width="100%"
            size="$5"
            onPress={scrollTo}
            pressStyle={{ opacity: 0.9 }}
            borderRadius={15}
            overflow="hidden"
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 32,
              }}
            >
              <Text
                color="#fff"
                fontSize={18}
                fontWeight="bold"
                marginRight={10}
              >
                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <MaterialCommunityIcons
                name={currentIndex === onboardingData.length - 1 ? 'check' : 'arrow-right'}
                size={24}
                color="#fff"
              />
            </LinearGradient>
          </Button>
        </Footer>
      </Container>
    </LinearGradient>
  );
};

export default OnboardingScreen;
