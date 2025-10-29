import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

/**
 * Quick Template Preview Component
 * Provides quick preview and selection of design templates
 */
const TemplateQuickPreview = ({ visible, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Sample template categories
  const categories = [
    { id: 'all', name: 'All', icon: 'view-grid' },
    { id: 'dress', name: 'Dresses', icon: 'tshirt-crew' },
    { id: 'top', name: 'Tops', icon: 'hanger' },
    { id: 'pants', name: 'Pants', icon: 'shoe-formal' },
    { id: 'accessory', name: 'Accessories', icon: 'bag-personal' },
  ];

  // Sample templates (in production, these would come from a service/API)
  const templates = [
    {
      id: '1',
      name: 'Classic A-Line Dress',
      category: 'dress',
      thumbnail: 'https://via.placeholder.com/200x300/FF6B6B/ffffff?text=A-Line',
      description: 'Elegant A-line dress with fitted bodice',
      difficulty: 'Easy',
      tags: ['formal', 'elegant', 'timeless'],
    },
    {
      id: '2',
      name: 'Casual T-Shirt',
      category: 'top',
      thumbnail: 'https://via.placeholder.com/200x300/4ECDC4/ffffff?text=T-Shirt',
      description: 'Basic crew neck t-shirt',
      difficulty: 'Easy',
      tags: ['casual', 'everyday', 'basic'],
    },
    {
      id: '3',
      name: 'Maxi Dress',
      category: 'dress',
      thumbnail: 'https://via.placeholder.com/200x300/6C63FF/ffffff?text=Maxi',
      description: 'Floor-length maxi dress',
      difficulty: 'Medium',
      tags: ['bohemian', 'summer', 'flowing'],
    },
    {
      id: '4',
      name: 'Wide Leg Pants',
      category: 'pants',
      thumbnail: 'https://via.placeholder.com/200x300/FFD93D/ffffff?text=Pants',
      description: 'High-waisted wide leg pants',
      difficulty: 'Medium',
      tags: ['modern', 'chic', 'versatile'],
    },
    {
      id: '5',
      name: 'Tote Bag',
      category: 'accessory',
      thumbnail: 'https://via.placeholder.com/200x300/A8E6CF/ffffff?text=Tote',
      description: 'Spacious canvas tote bag',
      difficulty: 'Easy',
      tags: ['practical', 'eco-friendly', 'simple'],
    },
    {
      id: '6',
      name: 'Blazer',
      category: 'top',
      thumbnail: 'https://via.placeholder.com/200x300/FF8B94/ffffff?text=Blazer',
      description: 'Tailored blazer jacket',
      difficulty: 'Hard',
      tags: ['professional', 'structured', 'classic'],
    },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return '#A8E6CF';
      case 'Medium':
        return '#FFD93D';
      case 'Hard':
        return '#FF6B6B';
      default:
        return '#888';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <BlurView intensity={80} style={styles.blurContainer}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#1A1A2E', '#16213E']}
              style={styles.gradient}
            >
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>Choose Template</Text>
                  <Text style={styles.headerSubtitle}>
                    Start with a professional design
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Categories */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.id && styles.categoryChipActive,
                    ]}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setSelectedCategory(category.id);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={20}
                      color={selectedCategory === category.id ? '#fff' : '#888'}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === category.id && styles.categoryChipTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Templates Grid */}
              <ScrollView
                style={styles.templatesContainer}
                contentContainerStyle={styles.templatesContent}
              >
                <View style={styles.templatesGrid}>
                  {filteredTemplates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateCard,
                        selectedTemplate?.id === template.id && styles.templateCardSelected,
                      ]}
                      onPress={() => handleSelectTemplate(template)}
                    >
                      {/* Thumbnail placeholder */}
                      <View style={styles.templateThumbnail}>
                        <LinearGradient
                          colors={['#6C63FF30', '#4ECDC430']}
                          style={styles.thumbnailGradient}
                        >
                          <MaterialCommunityIcons
                            name="hanger"
                            size={40}
                            color="#6C63FF"
                          />
                        </LinearGradient>
                      </View>

                      {/* Template Info */}
                      <View style={styles.templateInfo}>
                        <Text style={styles.templateName} numberOfLines={2}>
                          {template.name}
                        </Text>
                        <Text style={styles.templateDescription} numberOfLines={2}>
                          {template.description}
                        </Text>
                        
                        <View style={styles.templateMeta}>
                          <View
                            style={[
                              styles.difficultyBadge,
                              { backgroundColor: getDifficultyColor(template.difficulty) + '30' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.difficultyText,
                                { color: getDifficultyColor(template.difficulty) },
                              ]}
                            >
                              {template.difficulty}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Selected Indicator */}
                      {selectedTemplate?.id === template.id && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={24} color="#6C63FF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {filteredTemplates.length === 0 && (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons
                      name="tshirt-crew-outline"
                      size={60}
                      color="#666"
                    />
                    <Text style={styles.emptyStateText}>
                      No templates in this category yet
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Action Buttons */}
              {selectedTemplate && (
                <View style={styles.actionBar}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleConfirmSelection}
                  >
                    <LinearGradient
                      colors={['#6C63FF', '#4ECDC4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.actionButtonGradient}
                    >
                      <Text style={styles.actionButtonText}>
                        Use Template
                      </Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    maxWidth: 600,
    height: height * 0.85,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 25,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  closeButton: {
    padding: 5,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A3E',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#6C63FF',
  },
  categoryChipText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  templatesContainer: {
    flex: 1,
  },
  templatesContent: {
    padding: 20,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: '48%',
    backgroundColor: '#2A2A3E',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: '#6C63FF',
  },
  templateThumbnail: {
    height: 150,
    width: '100%',
  },
  thumbnailGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    padding: 12,
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  templateDescription: {
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
  },
  actionBar: {
    padding: 20,
    paddingTop: 10,
  },
  actionButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default TemplateQuickPreview;
