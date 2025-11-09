import React, { useState } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { styled } from '@tamagui/core';
import { Stack, XStack, YStack } from './tamagui';
import { Text } from './tamagui';

const { width, height } = Dimensions.get('window');

// Styled components using Tamagui
const Overlay = styled(Stack, {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
});

const BlurContainer = styled(Stack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Container = styled(Stack, {
  width: width * 0.9,
  maxWidth: 600,
  height: height * 0.85,
  borderRadius: 30,
  overflow: 'hidden',
});

const GradientWrapper = styled(Stack, {
  flex: 1,
});

const Header = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: 25,
  paddingBottom: 15,
});

const HeaderContent = styled(YStack, {});

const HeaderTitle = styled(Text, {
  fontSize: 28,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 5,
});

const HeaderSubtitle = styled(Text, {
  fontSize: 14,
  color: '$textSecondary',
});

const CloseButton = styled(Stack, {
  padding: 5,
});

const CategoriesContainer = styled(Stack, {
  maxHeight: 60,
});

const CategoriesContent = styled(XStack, {
  paddingHorizontal: 20,
  paddingVertical: 10,
});

const CategoryChip = styled(XStack, {
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '$bgCard',
  marginRight: 10,
  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
      },
    },
  } as const,
});

const CategoryChipText = styled(Text, {
  color: '$textSecondary',
  fontSize: 14,
  marginLeft: 8,
  variants: {
    active: {
      true: {
        color: '$textPrimary',
        fontWeight: '600',
      },
    },
  } as const,
});

const TemplatesContainer = styled(Stack, {
  flex: 1,
});

const TemplatesContent = styled(YStack, {
  padding: 20,
});

const TemplatesGrid = styled(XStack, {
  flexWrap: 'wrap',
  justifyContent: 'space-between',
});

const TemplateCard = styled(Stack, {
  width: '48%',
  backgroundColor: '$bgCard',
  borderRadius: 15,
  marginBottom: 15,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
      },
    },
  } as const,
});

const TemplateThumbnail = styled(Stack, {
  height: 150,
  width: '100%',
});

const ThumbnailGradient = styled(Stack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const TemplateInfo = styled(YStack, {
  padding: 12,
});

const TemplateName = styled(Text, {
  fontSize: 14,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 5,
});

const TemplateDescription = styled(Text, {
  fontSize: 11,
  color: '$textSecondary',
  marginBottom: 8,
});

const TemplateMeta = styled(XStack, {
  alignItems: 'center',
});

const DifficultyBadge = styled(Stack, {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
});

const DifficultyText = styled(Text, {
  fontSize: 10,
  fontWeight: '600',
});

const SelectedIndicator = styled(Stack, {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '$textPrimary',
  borderRadius: 12,
});

const EmptyState = styled(YStack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 60,
});

const EmptyStateText = styled(Text, {
  color: '$textTertiary',
  fontSize: 16,
  marginTop: 15,
});

const ActionBar = styled(Stack, {
  padding: 20,
  paddingTop: 10,
});

const ActionButton = styled(Stack, {
  borderRadius: 15,
  overflow: 'hidden',
});

const ActionButtonGradient = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
});

const ActionButtonText = styled(Text, {
  color: '$textPrimary',
  fontSize: 16,
  fontWeight: 'bold',
  marginRight: 10,
});

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

interface TemplateQuickPreviewProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplateQuickPreview: React.FC<TemplateQuickPreviewProps> = ({ visible, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
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
  const templates: Template[] = [
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

  const handleSelectTemplate = (template: Template) => {
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

  const getDifficultyColor = (difficulty: string) => {
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
        style={{
          flex: 1,
          opacity: fadeAnim,
        }}
      >
        <Overlay>
          <BlurView intensity={80} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Container>
              <LinearGradient
                colors={['#1A1A2E', '#16213E']}
                style={{ flex: 1 }}
              >
                {/* Header */}
                <Header>
                  <HeaderContent>
                    <HeaderTitle>Choose Template</HeaderTitle>
                    <HeaderSubtitle>
                      Start with a professional design
                    </HeaderSubtitle>
                  </HeaderContent>
                  <TouchableOpacity onPress={onClose}>
                    <CloseButton>
                      <Ionicons name="close" size={28} color="#fff" />
                    </CloseButton>
                  </TouchableOpacity>
                </Header>

                {/* Categories */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ maxHeight: 60 }}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        setSelectedCategory(category.id);
                      }}
                    >
                      <CategoryChip active={selectedCategory === category.id}>
                        <MaterialCommunityIcons
                          name={category.icon}
                          size={20}
                          color={selectedCategory === category.id ? '#fff' : '#888'}
                        />
                        <CategoryChipText active={selectedCategory === category.id}>
                          {category.name}
                        </CategoryChipText>
                      </CategoryChip>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Templates Grid */}
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 20 }}
                >
                  <TemplatesGrid>
                    {filteredTemplates.map((template) => (
                      <TouchableOpacity
                        key={template.id}
                        onPress={() => handleSelectTemplate(template)}
                      >
                        <TemplateCard selected={selectedTemplate?.id === template.id}>
                          {/* Thumbnail placeholder */}
                          <TemplateThumbnail>
                            <LinearGradient
                              colors={['#6C63FF30', '#4ECDC430']}
                              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            >
                              <MaterialCommunityIcons
                                name="hanger"
                                size={40}
                                color="#6C63FF"
                              />
                            </LinearGradient>
                          </TemplateThumbnail>

                          {/* Template Info */}
                          <TemplateInfo>
                            <TemplateName numberOfLines={2}>
                              {template.name}
                            </TemplateName>
                            <TemplateDescription numberOfLines={2}>
                              {template.description}
                            </TemplateDescription>
                            
                            <TemplateMeta>
                              <DifficultyBadge
                                style={{ backgroundColor: getDifficultyColor(template.difficulty) + '30' }}
                              >
                                <DifficultyText
                                  style={{ color: getDifficultyColor(template.difficulty) }}
                                >
                                  {template.difficulty}
                                </DifficultyText>
                              </DifficultyBadge>
                            </TemplateMeta>
                          </TemplateInfo>

                          {/* Selected Indicator */}
                          {selectedTemplate?.id === template.id && (
                            <SelectedIndicator>
                              <Ionicons name="checkmark-circle" size={24} color="#6C63FF" />
                            </SelectedIndicator>
                          )}
                        </TemplateCard>
                      </TouchableOpacity>
                    ))}
                  </TemplatesGrid>

                  {filteredTemplates.length === 0 && (
                    <EmptyState>
                      <MaterialCommunityIcons
                        name="tshirt-crew-outline"
                        size={60}
                        color="#666"
                      />
                      <EmptyStateText>
                        No templates in this category yet
                      </EmptyStateText>
                    </EmptyState>
                  )}
                </ScrollView>

                {/* Action Buttons */}
                {selectedTemplate && (
                  <ActionBar>
                    <TouchableOpacity onPress={handleConfirmSelection}>
                      <ActionButton>
                        <LinearGradient
                          colors={['#6C63FF', '#4ECDC4']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}
                        >
                          <ActionButtonText>
                            Use Template
                          </ActionButtonText>
                          <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                      </ActionButton>
                    </TouchableOpacity>
                  </ActionBar>
                )}
              </LinearGradient>
            </Container>
          </BlurView>
        </Overlay>
      </Animated.View>
    </Modal>
  );
};

export default TemplateQuickPreview;
