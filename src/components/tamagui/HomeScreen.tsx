import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Alert,
  Share,
  Platform,
  Linking,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useTutorialStore } from '@state/appStore';

const { width } = Dimensions.get('window');

// Feature Card Component with 3D effect
const FeatureCard = ({ icon, title, description, color, onPress, delay }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    ]).start();
  }, []);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
    onPress?.();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { perspective: 1000 }, { rotateY: spin }],
        }}
      >
        <Stack width={(width - 50) / 2} marginBottom={15} borderRadius={20} overflow="hidden">
          <LinearGradient colors={[color + '20', color + '10']} style={{ flex: 1 }}>
            <Stack
              padding={20}
              minHeight={160}
              justifyContent="center"
              alignItems="center"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.1)"
              borderRadius={20}
            >
              <Stack
                width={60}
                height={60}
                borderRadius={30}
                justifyContent="center"
                alignItems="center"
                marginBottom={10}
                backgroundColor={color + '30'}
              >
                {icon}
              </Stack>
              <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={5} textAlign="center">
                {title}
              </TamaguiText>
              <TamaguiText fontSize={12} color="#ccc" textAlign="center">
                {description}
              </TamaguiText>
            </Stack>
          </LinearGradient>
        </Stack>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Trending Design Card
const TrendingCard = ({ item, index }: any) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <Stack width={200} height={150} marginRight={15} borderRadius={20} overflow="hidden">
        <LinearGradient colors={item.colors} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          <Stack alignItems="center">
            <MaterialCommunityIcons name={item.icon} size={40} color="#fff" />
            <TamaguiText fontSize={18} fontWeight="bold" color="#fff" marginTop={10}>
              {item.title}
            </TamaguiText>
            <TamaguiText fontSize={14} color="rgba(255,255,255,0.8)">
              {item.subtitle}
            </TamaguiText>
          </Stack>
        </LinearGradient>
      </Stack>
    </Animated.View>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, onPress, color }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginRight: 15 }}>
        <LinearGradient colors={[color, color + 'DD']} style={{ borderRadius: 20 }}>
          <Stack width={70} height={70} borderRadius={20} justifyContent="center" alignItems="center">
            {icon}
            <TamaguiText color="#fff" fontSize={12} marginTop={5}>
              {label}
            </TamaguiText>
          </Stack>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }: any) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showWelcome, setShowWelcome] = useState(true);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const { startTutorial } = useTutorialStore();

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    setTimeout(() => setShowWelcome(false), 5000);
  }, []);

  // Social Media Share Handler
  const handleShare = async () => {
    const shareOptions = {
      title: 'Check out FashionCraft Studio!',
      message: 'Design stunning fashion pieces with FashionCraft Studio - The ultimate design app! 🎨👗✨',
      url: 'https://fashioncraft-studio.app',
    };

    Alert.alert(
      'Share FashionCraft Studio',
      'Choose how to share',
      [
        {
          text: 'Social Media',
          onPress: () => {
            void (async () => {
              try {
                if (Platform.OS === 'web') {
                  const nav: any = navigator;
                  if (nav.share) {
                    await nav.share({
                      title: shareOptions.title,
                      text: shareOptions.message,
                      url: shareOptions.url,
                    });
                  } else {
                    const shareText = `${shareOptions.message}\n${shareOptions.url}`;
                    await nav.clipboard.writeText(shareText);
                    Alert.alert('Success', 'Link copied to clipboard! Share it on your favorite social media.');
                  }
                } else {
                  const result = await Share.share({
                    message: shareOptions.message,
                    url: shareOptions.url,
                    title: shareOptions.title,
                  });
                  
                  if (result.action === Share.sharedAction) {
                    Alert.alert('Success', 'Thanks for sharing! 🎉');
                  }
                }
              } catch (error) {
                console.error('Share error:', error);
                Alert.alert('Error', 'Could not share at this time');
              }
            })();
          },
        },
        {
          text: 'WhatsApp',
          onPress: () => {
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareOptions.message + ' ' + shareOptions.url)}`;
            if (Platform.OS === 'web') {
              (globalThis as any).open(`https://wa.me/?text=${encodeURIComponent(shareOptions.message + ' ' + shareOptions.url)}`, '_blank');
            } else {
              Linking.openURL(whatsappUrl).catch(() => {
                Alert.alert('Error', 'WhatsApp is not installed');
              });
            }
          },
        },
        {
          text: 'Twitter/X',
          onPress: () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareOptions.message)}&url=${encodeURIComponent(shareOptions.url)}`;
            if (Platform.OS === 'web') {
              (globalThis as any).open(twitterUrl, '_blank');
            } else {
              Linking.openURL(twitterUrl);
            }
          },
        },
        {
          text: 'Facebook',
          onPress: () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareOptions.url)}`;
            if (Platform.OS === 'web') {
              (globalThis as any).open(facebookUrl, '_blank');
            } else {
              Linking.openURL(facebookUrl);
            }
          },
        },
        {
          text: 'Copy Link',
          onPress: () => {
            void (async () => {
              if (Platform.OS === 'web') {
                await (navigator as any).clipboard.writeText(shareOptions.url);
              } else {
                Alert.alert('Success', 'Link copied to clipboard!');
              }
            })();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const features = [
    {
      icon: <MaterialCommunityIcons name="palette" size={32} color="#6C63FF" />,
      title: 'Design Studio',
      description: 'Create stunning fashion designs with advanced tools',
      color: '#6C63FF',
      screen: 'Studio',
    },
    {
      icon: <MaterialCommunityIcons name="cube-outline" size={32} color="#FF6B6B" />,
      title: '3D Visualization',
      description: 'View your designs in immersive 3D',
      color: '#FF6B6B',
      screen: '3D View',
    },
    {
      icon: <MaterialCommunityIcons name="robot" size={32} color="#4ECDC4" />,
      title: 'AI Assistant',
      description: 'Get AI-powered design suggestions',
      color: '#4ECDC4',
      screen: 'AI Assistant',
    },
    {
      icon: <Ionicons name="layers" size={32} color="#FFD93D" />,
      title: 'Templates',
      description: 'Browse and customize templates',
      color: '#FFD93D',
      screen: 'Templates',
    },
    {
      icon: <MaterialCommunityIcons name="ruler" size={32} color="#A8E6CF" />,
      title: 'Measurements',
      description: 'Precise measurement tools',
      color: '#A8E6CF',
      screen: 'Measurements',
    },
    {
      icon: <MaterialCommunityIcons name="account-group" size={32} color="#C7CEEA" />,
      title: 'Collaborate',
      description: 'Share and collaborate on designs',
      color: '#C7CEEA',
      screen: 'Collaboration',
    },
  ];

  const trendingDesigns = [
    {
      id: '1',
      title: 'Summer Collection',
      subtitle: 'Vibrant & Fresh',
      icon: 'weather-sunny',
      colors: ['#FFD93D', '#FF6B6B'],
    },
    {
      id: '2',
      title: 'Urban Street',
      subtitle: 'Modern & Bold',
      icon: 'city',
      colors: ['#6C63FF', '#4ECDC4'],
    },
    {
      id: '3',
      title: 'Elegant Evening',
      subtitle: 'Sophisticated',
      icon: 'star',
      colors: ['#C7CEEA', '#FFD4E5'],
    },
  ];

  const quickActions = [
    {
      icon: <Feather name="camera" size={24} color="#fff" />,
      label: 'Scan',
      color: '#FF6B6B',
      action: () => navigation.navigate('ARView'),
    },
    {
      icon: <Feather name="trending-up" size={24} color="#fff" />,
      label: 'Trends',
      color: '#4ECDC4',
      action: () => navigation.navigate('TrendExplorer'),
    },
    {
      icon: <Feather name="save" size={24} color="#fff" />,
      label: 'Save',
      color: '#6C63FF',
      action: () => {},
    },
    {
      icon: <Feather name="share-2" size={24} color="#fff" />,
      label: 'Share',
      color: '#FFD93D',
      action: handleShare,
    },
    {
      icon: <MaterialCommunityIcons name="school" size={24} color="#fff" />,
      label: 'Tutorial',
      color: '#A8E6CF',
      action: () => startTutorial(),
    },
  ];

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <Stack flex={1} backgroundColor="#1A1A2E">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        {/* Welcome Header */}
        <Animated.View style={{ opacity: headerOpacity, transform: [{ scale: headerScale }] }}>
          <Stack height={250} marginBottom={20}>
            <LinearGradient
              colors={['#6C63FF', '#4ECDC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' }}
            >
              <Stack flex={1} justifyContent="center" alignItems="center" paddingTop={20}>
                <TamaguiText fontSize={18} color="rgba(255,255,255,0.9)">Welcome to</TamaguiText>
                <TamaguiText fontSize={32} fontWeight="bold" color="#fff" marginVertical={10}>
                  FashionCraft Studio
                </TamaguiText>
                <TamaguiText fontSize={16} color="rgba(255,255,255,0.8)">Design • Create • Inspire</TamaguiText>
              </Stack>
              
              {/* Animated Pattern Background */}
              <Stack position="absolute" width="100%" height="100%">
                {Array.from({ length: 6 }, (_, i) => (
                  <Animated.View
                    key={`pattern-bg-${i}`}
                    style={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: '#fff',
                      left: `${(i * 20) + 10}%`,
                      opacity: 0.1,
                      transform: [
                        {
                          translateY: scrollY.interpolate({
                            inputRange: [0, 200],
                            outputRange: [0, -50 * (i % 2 === 0 ? 1 : -1)],
                          }),
                        },
                      ],
                    }}
                  />
                ))}
              </Stack>
            </LinearGradient>
          </Stack>
        </Animated.View>

        {/* Quick Actions */}
        <Stack paddingHorizontal={20} marginBottom={20}>
          <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={15}>
            Quick Actions
          </TamaguiText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.label}
                icon={action.icon}
                label={action.label}
                color={action.color}
                onPress={action.action}
              />
            ))}
          </ScrollView>
        </Stack>

        {/* Features Grid */}
        <Stack paddingHorizontal={20} marginBottom={20}>
          <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={15}>
            Explore Features
          </TamaguiText>
          <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 100}
                onPress={() => navigation.navigate(feature.screen)}
              />
            ))}
          </Stack>
        </Stack>

        {/* Trending Designs */}
        <Stack marginBottom={20}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal={20} marginBottom={15}>
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff">Trending Now</TamaguiText>
            <TouchableOpacity onPress={() => navigation.navigate('TrendExplorer')}>
              <TamaguiText color="#6C63FF" fontSize={14}>See All</TamaguiText>
            </TouchableOpacity>
          </Stack>
          <FlatList
            horizontal
            data={trendingDesigns}
            renderItem={({ item, index }) => <TrendingCard item={item} index={index} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </Stack>

        {/* Stats Section */}
        <Stack marginHorizontal={20} marginBottom={30} borderRadius={20} overflow="hidden">
          <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ borderRadius: 20 }}>
            <Stack padding={20}>
              <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">
                Your Progress
              </TamaguiText>
              <Stack flexDirection="row" justifyContent="space-around">
                <Stack alignItems="center">
                  <TamaguiText fontSize={32} fontWeight="bold" color="#6C63FF">12</TamaguiText>
                  <TamaguiText fontSize={14} color="#888" marginTop={5}>Designs</TamaguiText>
                </Stack>
                <Stack alignItems="center">
                  <TamaguiText fontSize={32} fontWeight="bold" color="#6C63FF">48</TamaguiText>
                  <TamaguiText fontSize={14} color="#888" marginTop={5}>Templates</TamaguiText>
                </Stack>
                <Stack alignItems="center">
                  <TamaguiText fontSize={32} fontWeight="bold" color="#6C63FF">5</TamaguiText>
                  <TamaguiText fontSize={14} color="#888" marginTop={5}>Collections</TamaguiText>
                </Stack>
              </Stack>
            </Stack>
          </LinearGradient>
        </Stack>
      </Animated.ScrollView>

      {/* Welcome Modal */}
      <Modal visible={showWelcome} transparent animationType="fade" onRequestClose={() => setShowWelcome(false)}>
        <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stack backgroundColor="rgba(26, 26, 46, 0.95)" padding={30} borderRadius={30} alignItems="center" width={width * 0.85}>
            <MaterialCommunityIcons name="hanger" size={80} color="#6C63FF" />
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginTop={20} marginBottom={10}>
              Welcome Designer!
            </TamaguiText>
            <TamaguiText fontSize={16} color="#888" textAlign="center" marginBottom={30}>
              Start creating amazing fashion designs with our powerful tools
            </TamaguiText>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => setShowWelcome(false)}>
              <LinearGradient colors={['#6C63FF', '#4ECDC4']} style={{ borderRadius: 25 }}>
                <Stack paddingVertical={15} borderRadius={25} alignItems="center">
                  <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Get Started</TamaguiText>
                </Stack>
              </LinearGradient>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>
    </Stack>
  );
};

export default HomeScreen;
