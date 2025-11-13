import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Trend Card Component with parallax effect
const TrendCard = ({ trend, index, scrollY }: any) => {
  const inputRange = [
    (index - 1) * 300,
    index * 300,
    (index + 1) * 300,
  ];

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        width: width - 40,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        transform: [{ scale }],
        opacity,
      }}
    >
      <LinearGradient colors={trend.colors} style={{ padding: 20 }}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={15}>
          <TamaguiText fontSize={24} fontWeight="bold" color="#fff">
            #{trend.rank}
          </TamaguiText>
          <Stack flexDirection="row" alignItems="center" backgroundColor="rgba(255,255,255,0.2)" paddingHorizontal={10} paddingVertical={5} borderRadius={15}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#fff" />
            <TamaguiText color="#fff" marginLeft={5} fontSize={12}>
              +{trend.growth}%
            </TamaguiText>
          </Stack>
        </Stack>
        
        <Stack alignItems="center" marginBottom={20}>
          <MaterialCommunityIcons name={trend.icon} size={60} color="#fff" />
          <TamaguiText fontSize={22} fontWeight="bold" color="#fff" marginTop={10}>
            {trend.title}
          </TamaguiText>
          <TamaguiText fontSize={14} color="rgba(255,255,255,0.8)" marginTop={5}>
            {trend.category}
          </TamaguiText>
          <TamaguiText fontSize={14} color="rgba(255,255,255,0.7)" textAlign="center" marginTop={10}>
            {trend.description}
          </TamaguiText>
        </Stack>
        
        <Stack flexDirection="row" justifyContent="space-around">
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="eye" size={16} color="#fff" />
            <TamaguiText color="#fff" marginLeft={5} fontSize={14}>
              {trend.views}
            </TamaguiText>
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="heart" size={16} color="#fff" />
            <TamaguiText color="#fff" marginLeft={5} fontSize={14}>
              {trend.likes}
            </TamaguiText>
          </Stack>
          <Stack flexDirection="row" alignItems="center">
            <Ionicons name="share-social" size={16} color="#fff" />
            <TamaguiText color="#fff" marginLeft={5} fontSize={14}>
              {trend.shares}
            </TamaguiText>
          </Stack>
        </Stack>
      </LinearGradient>
    </Animated.View>
  );
};

// Season Selector Component
const SeasonSelector = ({ seasons, selectedSeason, onSelect }: any) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 20, marginBottom: 20 }}
    >
      {seasons.map((season: any) => (
        <TouchableOpacity
          key={season.id}
          onPress={() => onSelect(season.id)}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            backgroundColor={selectedSeason === season.id ? '#6C63FF' : '#1A1A2E'}
            paddingHorizontal={20}
            paddingVertical={12}
            borderRadius={20}
            marginRight={10}
          >
            <MaterialCommunityIcons
              name={season.icon}
              size={24}
              color={selectedSeason === season.id ? '#fff' : '#888'}
            />
            <TamaguiText
              color={selectedSeason === season.id ? '#fff' : '#888'}
              marginLeft={8}
              fontSize={14}
            >
              {season.name}
            </TamaguiText>
          </Stack>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Trend Insight Card
const TrendInsight = ({ insight }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        backgroundColor: '#1A1A2E',
        padding: 15,
        borderRadius: 15,
        marginHorizontal: 10,
        minWidth: 150,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Stack
        width={50}
        height={50}
        borderRadius={25}
        backgroundColor="rgba(108, 99, 255, 0.2)"
        justifyContent="center"
        alignItems="center"
        marginRight={15}
      >
        <MaterialCommunityIcons name={insight.icon} size={30} color="#6C63FF" />
      </Stack>
      <Stack justifyContent="center">
        <TamaguiText fontSize={12} color="#888">{insight.title}</TamaguiText>
        <TamaguiText fontSize={20} fontWeight="bold" color="#fff">{insight.value}</TamaguiText>
        <TamaguiText fontSize={11} color="#4ECDC4">{insight.change}</TamaguiText>
      </Stack>
    </Animated.View>
  );
};

const TrendExplorerScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('spring2024');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'all', name: 'All Trends', icon: 'trending-up' },
    { id: 'colors', name: 'Colors', icon: 'palette' },
    { id: 'patterns', name: 'Patterns', icon: 'dots-grid' },
    { id: 'styles', name: 'Styles', icon: 'hanger' },
    { id: 'materials', name: 'Materials', icon: 'texture' },
    { id: 'accessories', name: 'Accessories', icon: 'glasses' },
  ];

  const seasons = [
    { id: 'spring2024', name: 'Spring 2024', icon: 'flower' },
    { id: 'summer2024', name: 'Summer 2024', icon: 'weather-sunny' },
    { id: 'fall2024', name: 'Fall 2024', icon: 'leaf' },
    { id: 'winter2024', name: 'Winter 2024', icon: 'snowflake' },
  ];

  const trends = [
    {
      id: '1',
      rank: 1,
      title: 'Oversized Blazers',
      category: 'Outerwear',
      description: 'Bold shoulders and relaxed fit dominating runways',
      icon: 'tshirt-crew',
      colors: ['#6C63FF', '#5A57E5'],
      growth: 85,
      views: '2.5M',
      likes: '450K',
      shares: '120K',
    },
    {
      id: '2',
      rank: 2,
      title: 'Neon Accents',
      category: 'Colors',
      description: 'Bright neon colors making a comeback',
      icon: 'palette',
      colors: ['#FF6B6B', '#FF5757'],
      growth: 72,
      views: '1.8M',
      likes: '380K',
      shares: '95K',
    },
    {
      id: '3',
      rank: 3,
      title: 'Sustainable Fabrics',
      category: 'Materials',
      description: 'Eco-friendly materials gaining popularity',
      icon: 'leaf',
      colors: ['#4ECDC4', '#3EBDB4'],
      growth: 68,
      views: '1.5M',
      likes: '320K',
      shares: '88K',
    },
    {
      id: '4',
      rank: 4,
      title: 'Y2K Revival',
      category: 'Styles',
      description: 'Early 2000s fashion making a strong return',
      icon: 'star',
      colors: ['#FFD93D', '#FFC93D'],
      growth: 65,
      views: '1.3M',
      likes: '290K',
      shares: '76K',
    },
    {
      id: '5',
      rank: 5,
      title: 'Minimalist Chic',
      category: 'Styles',
      description: 'Clean lines and neutral palettes',
      icon: 'minus',
      colors: ['#A8E6CF', '#98D6BF'],
      growth: 58,
      views: '1.1M',
      likes: '250K',
      shares: '65K',
    },
  ];

  const insights = [
    {
      icon: 'chart-line',
      title: 'Trending Up',
      value: '23',
      change: '+15% this week',
    },
    {
      icon: 'fire',
      title: 'Hot Topics',
      value: '8',
      change: 'New this season',
    },
    {
      icon: 'earth',
      title: 'Global Reach',
      value: '45',
      change: 'Countries',
    },
    {
      icon: 'account-group',
      title: 'Influencers',
      value: '1.2K',
      change: 'Active creators',
    },
  ];

  const colorPalettes = [
    {
      id: '1',
      name: 'Spring Bloom',
      colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD'],
    },
    {
      id: '2',
      name: 'Urban Night',
      colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6'],
    },
    {
      id: '3',
      name: 'Sunset Vibes',
      colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'],
    },
  ];

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: '#0F0F1E' }}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#4ECDC4']}
        style={{ padding: 20, paddingTop: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <TamaguiText fontSize={28} fontWeight="bold" color="#fff" marginBottom={5}>
          Trend Explorer
        </TamaguiText>
        <TamaguiText fontSize={14} color="rgba(255,255,255,0.8)" marginBottom={20}>
          Discover what's trending in fashion
        </TamaguiText>
        
        {/* Region Selector */}
        <Stack alignItems="center">
          <TouchableOpacity>
            <Stack
              flexDirection="row"
              alignItems="center"
              backgroundColor="rgba(255,255,255,0.2)"
              paddingHorizontal={20}
              paddingVertical={10}
              borderRadius={20}
            >
              <Ionicons name="globe" size={20} color="#fff" />
              <TamaguiText color="#fff" marginHorizontal={10} fontSize={14}>
                Global
              </TamaguiText>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </Stack>
          </TouchableOpacity>
        </Stack>
      </LinearGradient>

      {/* Insights */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 20 }}
      >
        {insights.map((insight, index) => (
          <TrendInsight key={index} insight={insight} />
        ))}
      </ScrollView>

      {/* Season Selector */}
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSelect={setSelectedSeason}
      />

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginBottom: 20 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              backgroundColor={selectedCategory === category.id ? '#6C63FF' : '#1A1A2E'}
              paddingHorizontal={15}
              paddingVertical={10}
              borderRadius={20}
              marginRight={10}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#fff' : '#888'}
              />
              <TamaguiText
                color={selectedCategory === category.id ? '#fff' : '#888'}
                marginLeft={8}
                fontSize={14}
              >
                {category.name}
              </TamaguiText>
            </Stack>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Now */}
      <Stack paddingHorizontal={20} marginBottom={30}>
        <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginBottom={15}>
          Trending Now
        </TamaguiText>
        {trends.map((trend, index) => (
          <TrendCard
            key={trend.id}
            trend={trend}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </Stack>

      {/* Color Palettes */}
      <Stack paddingHorizontal={20} marginBottom={30}>
        <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginBottom={15}>
          Trending Color Palettes
        </TamaguiText>
        {colorPalettes.map((palette) => (
          <Stack key={palette.id} backgroundColor="#1A1A2E" padding={15} borderRadius={15} marginBottom={15}>
            <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={10}>
              {palette.name}
            </TamaguiText>
            <Stack flexDirection="row" justifyContent="space-between">
              {palette.colors.map((color, index) => (
                <Stack
                  key={index}
                  flex={1}
                  height={40}
                  marginHorizontal={2}
                  borderRadius={8}
                  backgroundColor={color}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* Forecast */}
      <Stack paddingHorizontal={20} marginBottom={30}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E']}
          style={{ padding: 30, borderRadius: 20, alignItems: 'center' }}
        >
          <MaterialCommunityIcons name="crystal-ball" size={40} color="#6C63FF" />
          <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginTop={15} marginBottom={10}>
            2024 Fashion Forecast
          </TamaguiText>
          <TamaguiText fontSize={14} color="rgba(255,255,255,0.8)" textAlign="center" lineHeight={20} marginBottom={20}>
            AI predicts a 40% increase in sustainable fashion adoption and
            a return to bold, expressive styles inspired by digital art.
          </TamaguiText>
          <TouchableOpacity>
            <Stack backgroundColor="#6C63FF" paddingHorizontal={30} paddingVertical={12} borderRadius={20}>
              <TamaguiText color="#fff" fontSize={14} fontWeight="bold">
                View Full Report
              </TamaguiText>
            </Stack>
          </TouchableOpacity>
        </LinearGradient>
      </Stack>
    </Animated.ScrollView>
  );
};

export default TrendExplorerScreen;
