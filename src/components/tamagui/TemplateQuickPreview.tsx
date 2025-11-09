import React, { useState, useRef, useEffect } from 'react';
import { Animated, Dimensions, Modal, Platform, ScrollView as RNScrollView, Image } from 'react-native';
import { Stack, Text, Button, styled, ScrollView, useTheme } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Styled components
const ModalContainer = styled(Stack, {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4',
});

const ContentCard = styled(Stack, {
  width: width * 0.9,
  maxWidth: 600,
  maxHeight: height * 0.85,
  backgroundColor: '$background',
  borderRadius: 20,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 15,
});

const CategoryTab = styled(Stack, {
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  borderRadius: 20,
  marginHorizontal: 4,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    selected: {
      true: {
        backgroundColor: '#007AFF',
      },
      false: {
        backgroundColor: '$gray3',
      },
    },
  } as const,
});

const TemplateCard = styled(Stack, {
  width: (width * 0.9 - 60) / 2,
  marginBottom: '$3',
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '$gray2',
  variants: {
    selected: {
      true: {
        borderWidth: 3,
        borderColor: '#007AFF',
      },
      false: {
        borderWidth: 0,
      },
    },
  } as const,
});

const DifficultyBadge = styled(Stack, {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  variants: {
    difficulty: {
      Easy: {
        backgroundColor: '#A8E6CF',
      },
      Medium: {
        backgroundColor: '#FFD93D',
      },
      Hard: {
        backgroundColor: '#FF6B6B',
      },
    },
  } as const,
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

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TemplateQuickPreviewProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const TemplateQuickPreview: React.FC<TemplateQuickPreviewProps> = ({
  visible,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
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

  const categories: Category[] = [
    { id: 'all', name: 'All', icon: 'view-grid' },
    { id: 'dress', name: 'Dresses', icon: 'tshirt-crew' },
    { id: 'top', name: 'Tops', icon: 'hanger' },
    { id: 'pants', name: 'Pants', icon: 'shoe-formal' },
    { id: 'accessory', name: 'Accessories', icon: 'bag-personal' },
  ];

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

  const handleCategorySelect = (categoryId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ModalContainer>
          <ContentCard>
            {/* Header */}
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                padding="$4"
              >
                <Stack flexDirection="row" alignItems="center" gap="$2">
                  <MaterialCommunityIcons name="folder-multiple" size={28} color="#fff" />
                  <Text fontSize={22} fontWeight="bold" color="#fff">
                    Template Library
                  </Text>
                </Stack>
                
                <Button
                  size="$3"
                  circular
                  onPress={onClose}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  pressStyle={{ opacity: 0.8 }}
                  icon={<Ionicons name="close" size={24} color="#fff" />}
                />
              </Stack>
            </LinearGradient>

            {/* Category tabs */}
            <Stack paddingVertical="$3">
              <RNScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {categories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onPress={() => handleCategorySelect(category.id)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    <Stack flexDirection="row" alignItems="center" gap="$1">
                      <MaterialCommunityIcons
                        name={category.icon as any}
                        size={18}
                        color={selectedCategory === category.id ? '#fff' : '#666'}
                      />
                      <Text
                        fontSize={14}
                        fontWeight={selectedCategory === category.id ? 'bold' : 'normal'}
                        color={selectedCategory === category.id ? '#fff' : '#666'}
                      >
                        {category.name}
                      </Text>
                    </Stack>
                  </CategoryTab>
                ))}
              </RNScrollView>
            </Stack>

            {/* Templates grid */}
            <ScrollView flex={1} padding="$4">
              <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    selected={selectedTemplate?.id === template.id}
                    onPress={() => handleSelectTemplate(template)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    <Image
                      source={{ uri: template.thumbnail }}
                      style={{ width: '100%', height: 180 }}
                      resizeMode="cover"
                    />
                    
                    {selectedTemplate?.id === template.id && (
                      <Stack
                        position="absolute"
                        top={8}
                        right={8}
                        width={32}
                        height={32}
                        borderRadius={16}
                        backgroundColor="#007AFF"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      </Stack>
                    )}

                    <Stack padding="$3">
                      <Text fontSize={16} fontWeight="bold" color="$textPrimary" numberOfLines={1}>
                        {template.name}
                      </Text>
                      
                      <Text fontSize={13} color="$textSecondary" numberOfLines={2} marginTop={4}>
                        {template.description}
                      </Text>

                      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginTop={8}>
                        <DifficultyBadge difficulty={template.difficulty}>
                          <Text fontSize={11} fontWeight="600" color="#fff">
                            {template.difficulty}
                          </Text>
                        </DifficultyBadge>

                        <Stack flexDirection="row" gap={4}>
                          {template.tags.slice(0, 2).map((tag, index) => (
                            <Stack
                              key={index}
                              paddingHorizontal={6}
                              paddingVertical={2}
                              borderRadius={8}
                              backgroundColor="$gray3"
                            >
                              <Text fontSize={10} color="$textSecondary">
                                {tag}
                              </Text>
                            </Stack>
                          ))}
                        </Stack>
                      </Stack>
                    </Stack>
                  </TemplateCard>
                ))}
              </Stack>
            </ScrollView>

            {/* Footer with action buttons */}
            <Stack
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$gray3"
              flexDirection="row"
              gap="$3"
            >
              <Button
                flex={1}
                size="$4"
                onPress={onClose}
                backgroundColor="$gray3"
                color="$textPrimary"
                pressStyle={{ opacity: 0.8 }}
              >
                Cancel
              </Button>
              
              <Button
                flex={1}
                size="$4"
                onPress={handleConfirmSelection}
                disabled={!selectedTemplate}
                opacity={selectedTemplate ? 1 : 0.5}
                pressStyle={{ opacity: 0.9 }}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 }}
                >
                  <Text fontSize={16} fontWeight="bold" color="#fff">
                    Use Template
                  </Text>
                </LinearGradient>
              </Button>
            </Stack>
          </ContentCard>
        </ModalContainer>
      </Animated.View>
    </Modal>
  );
};

export default TemplateQuickPreview;
