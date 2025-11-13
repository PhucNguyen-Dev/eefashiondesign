import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { templatesData } from '../../data/templates.js';

const { width } = Dimensions.get('window');

// Template Card Component with 3D flip animation
const TemplateCard = ({ template, index, onPress, onFavorite }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(template);
  };

  const handleFlip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={{ width: (width - 40) / 2, height: 250, margin: 10, transform: [{ scale: scaleAnim }] }}>
        {/* Front of card */}
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ rotateY: frontInterpolate }],
            opacity: frontOpacity,
          }}
        >
          <LinearGradient colors={template.colors || ['#6C63FF', '#4ECDC4']} style={{ flex: 1, borderRadius: 20, padding: 15, justifyContent: 'space-between' }}>
            <Stack alignItems="center" justifyContent="center" height={80}>
              <MaterialCommunityIcons name={template.icon} size={60} color="#fff" />
            </Stack>
            <Stack flex={1} justifyContent="center">
              <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={5}>
                {template.name}
              </TamaguiText>
              <TamaguiText fontSize={12} color="rgba(255,255,255,0.7)" marginBottom={10}>
                {template.category}
              </TamaguiText>
              <Stack flexDirection="row" justifyContent="space-between">
                <Stack flexDirection="row" alignItems="center">
                  <Ionicons name="layers" size={14} color="#fff" />
                  <TamaguiText color="rgba(255,255,255,0.8)" fontSize={11} marginLeft={4}>
                    {template.layers} Layers
                  </TamaguiText>
                </Stack>
                <Stack flexDirection="row" alignItems="center">
                  <Ionicons name="color-palette" size={14} color="#fff" />
                  <TamaguiText color="rgba(255,255,255,0.8)" fontSize={11} marginLeft={4}>
                    {template.colors?.length || 0} Colors
                  </TamaguiText>
                </Stack>
              </Stack>
            </Stack>
            <Stack flexDirection="row" justifyContent="space-between">
              <TouchableOpacity style={{ padding: 5 }} onPress={handleFlip}>
                <Ionicons name="information-circle" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 5 }} onPress={() => onFavorite(template.id)}>
                <Ionicons
                  name={template.isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={template.isFavorite ? '#FF6B6B' : '#fff'}
                />
              </TouchableOpacity>
            </Stack>
          </LinearGradient>
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity,
          }}
        >
          <LinearGradient colors={['#2A2A3E', '#1A1A2E']} style={{ flex: 1, borderRadius: 20, padding: 15, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={handleFlip} style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TamaguiText color="#fff" fontSize={14} marginBottom={15} lineHeight={20}>
              {template.description}
            </TamaguiText>
            <Stack marginBottom={15}>
              <TamaguiText color="#fff" fontSize={14} fontWeight="bold" marginBottom={8}>
                Features:
              </TamaguiText>
              {template.features?.map((feature: string) => (
                <Stack key={feature} flexDirection="row" alignItems="center" marginBottom={5}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <TamaguiText color="rgba(255,255,255,0.8)" fontSize={12} marginLeft={8}>
                    {feature}
                  </TamaguiText>
                </Stack>
              ))}
            </Stack>
            <Stack flexDirection="row" flexWrap="wrap">
              {template.tags?.map((tag: string) => (
                <Stack
                  key={tag}
                  backgroundColor="rgba(255,255,255,0.1)"
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={10}
                  marginRight={5}
                  marginBottom={5}
                >
                  <TamaguiText color="#4ECDC4" fontSize={10}>#{tag}</TamaguiText>
                </Stack>
              ))}
            </Stack>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Category Filter Button
const CategoryButton = ({ category, isActive, onPress }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(category);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isActive ? '#6C63FF' : '#1A1A2E',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 20,
          marginRight: 10,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <MaterialCommunityIcons name={category.icon} size={20} color={isActive ? '#fff' : '#888'} />
        <TamaguiText color={isActive ? '#fff' : '#888'} marginLeft={8} fontSize={14}>
          {category.name}
        </TamaguiText>
      </Animated.View>
    </TouchableOpacity>
  );
};

const TemplateLibraryScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState(templatesData);
  const [filteredTemplates, setFilteredTemplates] = useState(templatesData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: 'all', name: 'All', icon: 'all-inclusive' },
    { id: 'shirts', name: 'Shirts', icon: 'tshirt-crew' },
    { id: 'dresses', name: 'Dresses', icon: 'human-female-dance' },
    { id: 'pants', name: 'Pants', icon: 'human-male' },
    { id: 'jackets', name: 'Jackets', icon: 'coat-rack' },
    { id: 'accessories', name: 'Accessories', icon: 'glasses' },
    { id: 'shoes', name: 'Shoes', icon: 'shoe-heel' },
    { id: 'bags', name: 'Bags', icon: 'bag-personal' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [selectedCategory, searchQuery]);

  const filterTemplates = () => {
    let filtered = [...templates];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((t: any) => t.category === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter((t: any) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplatePress = (template: any) => {
    navigation.navigate('Studio', { template });
  };

  const handleFavorite = (templateId: string) => {
    setTemplates(templates.map((t: any) =>
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const renderHeader = () => (
    <Animated.View style={{ paddingHorizontal: 20, paddingTop: 10, opacity: fadeAnim }}>
      {/* Search Bar */}
      <Stack
        flexDirection="row"
        alignItems="center"
        backgroundColor="#1A1A2E"
        borderRadius={25}
        paddingHorizontal={15}
        paddingVertical={12}
        marginBottom={15}
      >
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
        <TextInput
          style={{ flex: 1, color: '#fff', fontSize: 16 }}
          placeholder="Search templates..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </Stack>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isActive={selectedCategory === category.name}
            onPress={() => setSelectedCategory(category.name)}
          />
        ))}
      </ScrollView>

      {/* Toolbar */}
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={15}>
        <TamaguiText color="#888" fontSize={14}>
          {filteredTemplates.length} Templates
        </TamaguiText>
        <Stack flexDirection="row" alignItems="center">
          <TouchableOpacity
            style={{ padding: 8, marginLeft: 10 }}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons name={viewMode === 'grid' ? 'grid' : 'list'} size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, marginLeft: 10 }}>
            <MaterialCommunityIcons name="sort" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, marginLeft: 10 }}>
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </Stack>
      </Stack>
    </Animated.View>
  );

  return (
    <Stack flex={1} backgroundColor="#0F0F1E">
      <FlatList
        data={filteredTemplates}
        renderItem={({ item, index }) => (
          <TemplateCard
            template={item}
            index={index}
            onPress={handleTemplatePress}
            onFavorite={handleFavorite}
          />
        )}
        keyExtractor={(item: any) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6C63FF', '#4ECDC4']}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create Template Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9}>
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">
              Create New Template
            </TamaguiText>
            <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-between">
              <TouchableOpacity style={{ width: '48%', marginBottom: 15 }}>
                <LinearGradient
                  colors={['#6C63FF', '#5A57E5']}
                  style={{ padding: 20, borderRadius: 15, alignItems: 'center' }}
                >
                  <MaterialCommunityIcons name="draw" size={40} color="#fff" />
                  <TamaguiText color="#fff" fontSize={12} marginTop={8} textAlign="center">
                    From Scratch
                  </TamaguiText>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '48%', marginBottom: 15 }}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF5757']}
                  style={{ padding: 20, borderRadius: 15, alignItems: 'center' }}
                >
                  <MaterialCommunityIcons name="content-copy" size={40} color="#fff" />
                  <TamaguiText color="#fff" fontSize={12} marginTop={8} textAlign="center">
                    Duplicate Existing
                  </TamaguiText>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '48%', marginBottom: 15 }}>
                <LinearGradient
                  colors={['#4ECDC4', '#3EBDB4']}
                  style={{ padding: 20, borderRadius: 15, alignItems: 'center' }}
                >
                  <MaterialCommunityIcons name="robot" size={40} color="#fff" />
                  <TamaguiText color="#fff" fontSize={12} marginTop={8} textAlign="center">
                    AI Generate
                  </TamaguiText>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '48%', marginBottom: 15 }}>
                <LinearGradient
                  colors={['#FFD93D', '#FFC93D']}
                  style={{ padding: 20, borderRadius: 15, alignItems: 'center' }}
                >
                  <MaterialCommunityIcons name="upload" size={40} color="#fff" />
                  <TamaguiText color="#fff" fontSize={12} marginTop={8} textAlign="center">
                    Import Design
                  </TamaguiText>
                </LinearGradient>
              </TouchableOpacity>
            </Stack>
            <TouchableOpacity
              style={{ backgroundColor: '#2A2A3E', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 }}
              onPress={() => setShowCreateModal(false)}
            >
              <TamaguiText color="#fff" fontSize={16}>Cancel</TamaguiText>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>
    </Stack>
  );
};

export default TemplateLibraryScreen;
