import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Image,
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

const { width, height } = Dimensions.get('window');

// Trend Card Component with parallax effect
const TrendCard = ({ trend, index, scrollY }) => {
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
      style={[
        styles.trendCard,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <LinearGradient
        colors={trend.colors}
        style={styles.trendGradient}
      >
        <View style={styles.trendHeader}>
          <Text style={styles.trendRank}>#{trend.rank}</Text>
          <View style={styles.trendBadge}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#fff" />
            <Text style={styles.trendPercentage}>+{trend.growth}%</Text>
          </View>
        </View>
        
        <View style={styles.trendContent}>
          <MaterialCommunityIcons name={trend.icon} size={60} color="#fff" />
          <Text style={styles.trendTitle}>{trend.title}</Text>
          <Text style={styles.trendCategory}>{trend.category}</Text>
          <Text style={styles.trendDescription}>{trend.description}</Text>
        </View>
        
        <View style={styles.trendStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#fff" />
            <Text style={styles.statText}>{trend.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.statText}>{trend.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="share-social" size={16} color="#fff" />
            <Text style={styles.statText}>{trend.shares}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Season Selector Component
const SeasonSelector = ({ seasons, selectedSeason, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.seasonSelector}
    >
      {seasons.map((season) => (
        <TouchableOpacity
          key={season.id}
          style={[
            styles.seasonButton,
            selectedSeason === season.id && styles.selectedSeasonButton,
          ]}
          onPress={() => onSelect(season.id)}
        >
          <MaterialCommunityIcons
            name={season.icon}
            size={24}
            color={selectedSeason === season.id ? '#fff' : '#888'}
          />
          <Text
            style={[
              styles.seasonText,
              selectedSeason === season.id && styles.selectedSeasonText,
            ]}
          >
            {season.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Trend Insight Card
const TrendInsight = ({ insight }) => {
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
      style={[
        styles.insightCard,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.insightIcon}>
        <MaterialCommunityIcons name={insight.icon} size={30} color="#6C63FF" />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightValue}>{insight.value}</Text>
        <Text style={styles.insightChange}>{insight.change}</Text>
      </View>
    </Animated.View>
  );
};

const TrendExplorerScreen = ({ navigation }) => {
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
    <ScrollView
      style={styles.container}
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
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Trend Explorer</Text>
        <Text style={styles.headerSubtitle}>Discover what's trending in fashion</Text>
        
        {/* Region Selector */}
        <View style={styles.regionSelector}>
          <TouchableOpacity style={styles.regionButton}>
            <Ionicons name="globe" size={20} color="#fff" />
            <Text style={styles.regionText}>Global</Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Insights */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.insightsContainer}
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
        style={styles.categoryTabs}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.activeCategoryTab,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialCommunityIcons
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? '#fff' : '#888'}
            />
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category.id && styles.activeCategoryTabText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Now */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        {trends.map((trend, index) => (
          <TrendCard
            key={trend.id}
            trend={trend}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </View>

      {/* Color Palettes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Color Palettes</Text>
        {colorPalettes.map((palette) => (
          <View key={palette.id} style={styles.paletteCard}>
            <Text style={styles.paletteName}>{palette.name}</Text>
            <View style={styles.paletteColors}>
              {palette.colors.map((color, index) => (
                <View
                  key={index}
                  style={[styles.paletteColor, { backgroundColor: color }]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Forecast */}
      <View style={styles.forecastSection}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E']}
          style={styles.forecastCard}
        >
          <MaterialCommunityIcons name="crystal-ball" size={40} color="#6C63FF" />
          <Text style={styles.forecastTitle}>2024 Fashion Forecast</Text>
          <Text style={styles.forecastText}>
            AI predicts a 40% increase in sustainable fashion adoption and
            a return to bold, expressive styles inspired by digital art.
          </Text>
          <TouchableOpacity style={styles.forecastButton}>
            <Text style={styles.forecastButtonText}>View Full Report</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  regionSelector: {
    alignItems: 'center',
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  regionText: {
    color: '#fff',
    marginHorizontal: 10,
    fontSize: 14,
  },
  insightsContainer: {
    paddingVertical: 20,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    minWidth: 150,
  },
  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  insightContent: {
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: 12,
    color: '#888',
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  insightChange: {
    fontSize: 11,
    color: '#4ECDC4',
  },
  seasonSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  seasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedSeasonButton: {
    backgroundColor: '#6C63FF',
  },
  seasonText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 14,
  },
  selectedSeasonText: {
    color: '#fff',
  },
  categoryTabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryTab: {
    backgroundColor: '#6C63FF',
  },
  categoryTabText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 14,
  },
  activeCategoryTabText: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  trendCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  trendGradient: {
    padding: 20,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trendRank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  trendPercentage: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  trendContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trendTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  trendCategory: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  trendDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 10,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  paletteCard: {
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  paletteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  paletteColors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paletteColor: {
    flex: 1,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  forecastSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  forecastCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
  },
  forecastText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  forecastButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  forecastButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TrendExplorerScreen;
