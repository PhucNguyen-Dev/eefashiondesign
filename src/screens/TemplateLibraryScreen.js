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
  Modal,
  TextInput,
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
import { templatesData } from '../data/templates';

const { width, height } = Dimensions.get('window');

// Template Card Component with 3D flip animation
const TemplateCard = ({ template, index, onPress, onFavorite }) => {
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      <Animated.View
        style={[
          styles.templateCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Front of card */}
        <Animated.View
          style={[
            styles.cardFace,
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={template.colors || ['#6C63FF', '#4ECDC4']}
            style={styles.templateGradient}
          >
            <View style={styles.templateImageContainer}>
              <MaterialCommunityIcons
                name={template.icon}
                size={60}
                color="#fff"
              />
            </View>
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              <Text style={styles.templateCategory}>{template.category}</Text>
              <View style={styles.templateStats}>
                <View style={styles.statItem}>
                  <Ionicons name="layers" size={14} color="#fff" />
                  <Text style={styles.statText}>{template.layers} Layers</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="color-palette" size={14} color="#fff" />
                  <Text style={styles.statText}>{template.colors.length} Colors</Text>
                </View>
              </View>
            </View>
            <View style={styles.templateActions}>
              <TouchableOpacity onPress={handleFlip} style={styles.actionButton}>
                <Ionicons name="information-circle" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onFavorite(template.id)} 
                style={styles.actionButton}
              >
                <Ionicons
                  name={template.isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={template.isFavorite ? '#FF6B6B' : '#fff'}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Back of card */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['#2A2A3E', '#1A1A2E']}
            style={styles.templateGradient}
          >
            <TouchableOpacity onPress={handleFlip} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.templateDescription}>{template.description}</Text>
            <View style={styles.templateFeatures}>
              <Text style={styles.featuresTitle}>Features:</Text>
              {template.features?.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <View style={styles.templateTags}>
              {template.tags?.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Category Filter Button
const CategoryButton = ({ category, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        style={[
          styles.categoryButton,
          isActive && styles.activeCategoryButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <MaterialCommunityIcons
          name={category.icon}
          size={20}
          color={isActive ? '#fff' : '#888'}
        />
        <Text style={[styles.categoryButtonText, isActive && styles.activeCategoryText]}>
          {category.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const TemplateLibraryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState(templatesData);
  const [filteredTemplates, setFilteredTemplates] = useState(templatesData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const searchInputRef = useRef(null);
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
  }, [selectedCategory, searchQuery, sortBy]);

  const filterTemplates = () => {
    let filtered = [...templates];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => t.category === selectedCategory.toLowerCase());
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplatePress = (template) => {
    navigation.navigate('Studio', { template });
  };

  const handleFavorite = (templateId) => {
    setTemplates(templates.map(t =>
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
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
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
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
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <Text style={styles.resultCount}>
            {filteredTemplates.length} Templates
          </Text>
        </View>
        <View style={styles.toolbarRight}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'grid' : 'list'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialCommunityIcons name="sort" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
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
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateNew}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6C63FF', '#4ECDC4']}
          style={styles.fabGradient}
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
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Template</Text>
            <View style={styles.createOptions}>
              <TouchableOpacity style={styles.createOption}>
                <LinearGradient
                  colors={['#6C63FF', '#5A57E5']}
                  style={styles.createOptionGradient}
                >
                  <MaterialCommunityIcons name="draw" size={40} color="#fff" />
                  <Text style={styles.createOptionText}>From Scratch</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createOption}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF5757']}
                  style={styles.createOptionGradient}
                >
                  <MaterialCommunityIcons name="content-copy" size={40} color="#fff" />
                  <Text style={styles.createOptionText}>Duplicate Existing</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createOption}>
                <LinearGradient
                  colors={['#4ECDC4', '#3EBDB4']}
                  style={styles.createOptionGradient}
                >
                  <MaterialCommunityIcons name="robot" size={40} color="#fff" />
                  <Text style={styles.createOptionText}>AI Generate</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createOption}>
                <LinearGradient
                  colors={['#FFD93D', '#FFC93D']}
                  style={styles.createOptionGradient}
                >
                  <MaterialCommunityIcons name="upload" size={40} color="#fff" />
                  <Text style={styles.createOptionText}>Import Design</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#6C63FF',
  },
  categoryButtonText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCount: {
    color: '#888',
    fontSize: 14,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButton: {
    padding: 8,
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  templateCard: {
    width: (width - 40) / 2,
    height: 250,
    margin: 10,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
  },
  templateGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
  },
  templateImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  templateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  templateCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginLeft: 4,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  templateDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  templateFeatures: {
    marginBottom: 15,
  },
  featuresTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 8,
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#4ECDC4',
    fontSize: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fabGradient: {
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  createOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  createOption: {
    width: '48%',
    marginBottom: 15,
  },
  createOptionGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  createOptionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#2A2A3E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TemplateLibraryScreen;
