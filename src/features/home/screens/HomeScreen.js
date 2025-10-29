import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  FlatList,
  Modal,
  Alert,
  Share,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useTutorialStore } from '../../../store';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

// Feature Card Component with 3D effect
const FeatureCard = ({ icon, title, description, color, onPress, delay }) => {
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
    onPress && onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.featureCard,
          {
            transform: [
              { scale: scaleAnim },
              { perspective: 1000 },
              { rotateY: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[color + '20', color + '10']}
          style={styles.featureCardGradient}
        >
          <View style={[styles.featureIconContainer, { backgroundColor: color + '30' }]}>
            {icon}
          </View>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureDescription}>{description}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Trending Design Card
const TrendingCard = ({ item, index }) => {
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
    <Animated.View
      style={[
        styles.trendingCard,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <LinearGradient
        colors={item.colors}
        style={styles.trendingCardGradient}
      >
        <View style={styles.trendingCardContent}>
          <MaterialCommunityIcons name={item.icon} size={40} color="#fff" />
          <Text style={styles.trendingCardTitle}>{item.title}</Text>
          <Text style={styles.trendingCardSubtitle}>{item.subtitle}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, onPress, color }) => {
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
    onPress && onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.quickActionButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={[color, color + 'DD']}
          style={styles.quickActionGradient}
        >
          {icon}
          <Text style={styles.quickActionLabel}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
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
      url: 'https://fashioncraft-studio.app', // Replace with your actual app URL
    };

    // Show share options
    Alert.alert(
      'Share FashionCraft Studio',
      'Choose how to share',
      [
        {
          text: 'Social Media',
          onPress: async () => {
            try {
              if (Platform.OS === 'web') {
                // Web: Use Web Share API if available
                if (navigator.share) {
                  await navigator.share({
                    title: shareOptions.title,
                    text: shareOptions.message,
                    url: shareOptions.url,
                  });
                } else {
                  // Fallback: Copy to clipboard
                  const shareText = `${shareOptions.message}\n${shareOptions.url}`;
                  await navigator.clipboard.writeText(shareText);
                  Alert.alert('Success', 'Link copied to clipboard! Share it on your favorite social media.');
                }
              } else {
                // Mobile: Use React Native Share
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
          },
        },
        {
          text: 'WhatsApp',
          onPress: () => {
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareOptions.message + ' ' + shareOptions.url)}`;
            if (Platform.OS === 'web') {
              window.open(`https://wa.me/?text=${encodeURIComponent(shareOptions.message + ' ' + shareOptions.url)}`, '_blank');
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
              window.open(twitterUrl, '_blank');
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
              window.open(facebookUrl, '_blank');
            } else {
              Linking.openURL(facebookUrl);
            }
          },
        },
        {
          text: 'Copy Link',
          onPress: async () => {
            if (Platform.OS === 'web') {
              await navigator.clipboard.writeText(shareOptions.url);
            } else {
              // For mobile, we'll use Clipboard from expo
              Alert.alert('Success', 'Link copied to clipboard!');
            }
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
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        {/* Welcome Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#6C63FF', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.headerTitle}>FashionCraft Studio</Text>
              <Text style={styles.headerSubtitle}>
                Design • Create • Inspire
              </Text>
            </View>
            
            {/* Animated Pattern Background */}
            <View style={styles.patternContainer}>
              {[...Array(6)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.patternDot,
                    {
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
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                icon={action.icon}
                label={action.label}
                color={action.color}
                onPress={action.action}
              />
            ))}
          </ScrollView>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 100}
                onPress={() => navigation.navigate(feature.screen)}
              />
            ))}
          </View>
        </View>

        {/* Trending Designs */}
        <View style={styles.trendingContainer}>
          <View style={styles.trendingHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TrendExplorer')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={trendingDesigns}
            renderItem={({ item, index }) => (
              <TrendingCard item={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#1A1A2E', '#16213E']}
            style={styles.statsGradient}
          >
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Designs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Templates</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Collections</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.ScrollView>

      {/* Welcome Modal */}
      <Modal
        visible={showWelcome}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWelcome(false)}
      >
        <BlurView intensity={100} style={styles.welcomeModal}>
          <Animated.View style={styles.welcomeModalContent}>
            <MaterialCommunityIcons name="hanger" size={80} color="#6C63FF" />
            <Text style={styles.welcomeModalTitle}>Welcome Designer!</Text>
            <Text style={styles.welcomeModalText}>
              Start creating amazing fashion designs with our powerful tools
            </Text>
            <TouchableOpacity
              style={styles.welcomeModalButton}
              onPress={() => setShowWelcome(false)}
            >
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={styles.welcomeModalButtonGradient}
              >
                <Text style={styles.welcomeModalButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    height: 250,
    marginBottom: 20,
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  patternContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsScroll: {
    paddingVertical: 10,
  },
  quickActionButton: {
    marginRight: 15,
  },
  quickActionGradient: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureCardGradient: {
    padding: 20,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  trendingContainer: {
    marginBottom: 20,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    color: '#6C63FF',
    fontSize: 14,
  },
  trendingList: {
    paddingHorizontal: 20,
  },
  trendingCard: {
    width: 200,
    height: 150,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  trendingCardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  trendingCardContent: {
    alignItems: 'center',
  },
  trendingCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  trendingCardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  welcomeModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeModalContent: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: width * 0.85,
  },
  welcomeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeModalText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  welcomeModalButton: {
    width: '100%',
  },
  welcomeModalButtonGradient: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  welcomeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
