import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
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

// Message Bubble Component
const MessageBubble = ({ message, isUser, index }) => {
  const slideAnim = useRef(new Animated.Value(isUser ? 50 : -50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {!isUser && (
        <View style={styles.aiAvatar}>
          <MaterialCommunityIcons name="robot" size={20} color="#6C63FF" />
        </View>
      )}
      <View style={[styles.bubbleContent, isUser && styles.userBubbleContent]}>
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>
          {message.text}
        </Text>
        {message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, idx) => (
              <TouchableOpacity key={idx} style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {message.image && (
          <View style={styles.messageImage}>
            <MaterialCommunityIcons name="image" size={100} color="#6C63FF" />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon, title, description, color, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
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
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.quickActionCard,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <LinearGradient
          colors={[color, color + 'DD']}
          style={styles.quickActionGradient}
        >
          <View style={styles.quickActionIcon}>
            {icon}
          </View>
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionDescription}>{description}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// AI Feature Card
const AIFeatureCard = ({ feature, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const cardHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 200],
  });

  return (
    <Animated.View style={[styles.featureCard, { height: cardHeight }]}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
        <LinearGradient
          colors={feature.colors}
          style={styles.featureCardGradient}
        >
          <View style={styles.featureCardHeader}>
            <View style={styles.featureCardIcon}>
              <MaterialCommunityIcons name={feature.icon} size={30} color="#fff" />
            </View>
            <View style={styles.featureCardInfo}>
              <Text style={styles.featureCardTitle}>{feature.title}</Text>
              <Text style={styles.featureCardSubtitle}>{feature.subtitle}</Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#fff"
            />
          </View>
          {isExpanded && (
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardDescription}>{feature.description}</Text>
              <TouchableOpacity
                style={styles.featureCardButton}
                onPress={() => onSelect(feature)}
              >
                <Text style={styles.featureCardButtonText}>Try Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AIAssistantScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your AI Fashion Assistant. How can I help you design amazing clothes today?',
      isUser: false,
      suggestions: ['Generate Design', 'Style Advice', 'Trend Analysis', 'Color Matching'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);
  const [selectedMode, setSelectedMode] = useState('chat');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const scrollViewRef = useRef(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const quickActions = [
    {
      icon: <MaterialCommunityIcons name="magic-staff" size={24} color="#fff" />,
      title: 'Generate Design',
      description: 'Create from description',
      color: '#6C63FF',
      action: 'generate',
    },
    {
      icon: <MaterialCommunityIcons name="palette" size={24} color="#fff" />,
      title: 'Color Palette',
      description: 'Get color suggestions',
      color: '#FF6B6B',
      action: 'colors',
    },
    {
      icon: <MaterialCommunityIcons name="trending-up" size={24} color="#fff" />,
      title: 'Trend Analysis',
      description: 'Latest fashion trends',
      color: '#4ECDC4',
      action: 'trends',
    },
    {
      icon: <MaterialCommunityIcons name="lightbulb" size={24} color="#fff" />,
      title: 'Style Ideas',
      description: 'Get inspiration',
      color: '#FFD93D',
      action: 'ideas',
    },
  ];

  const aiFeatures = [
    {
      id: '1',
      title: 'Design Generator',
      subtitle: 'Text to Design',
      description: 'Describe your vision and watch it come to life with AI-powered design generation.',
      icon: 'creation',
      colors: ['#6C63FF', '#5A57E5'],
    },
    {
      id: '2',
      title: 'Style Analyzer',
      subtitle: 'Upload & Analyze',
      description: 'Upload any fashion image and get detailed analysis of style, colors, and patterns.',
      icon: 'image-search',
      colors: ['#FF6B6B', '#FF5757'],
    },
    {
      id: '3',
      title: 'Trend Predictor',
      subtitle: 'Future Fashion',
      description: 'AI predicts upcoming fashion trends based on current data and historical patterns.',
      icon: 'chart-line',
      colors: ['#4ECDC4', '#3EBDB4'],
    },
    {
      id: '4',
      title: 'Virtual Stylist',
      subtitle: 'Personal Assistant',
      description: 'Get personalized styling advice based on your body type, preferences, and occasions.',
      icon: 'human-female-dance',
      colors: ['#FFD93D', '#FFC93D'],
    },
    {
      id: '5',
      title: 'Material Suggester',
      subtitle: 'Fabric & Texture',
      description: 'AI recommends the best materials and textures for your design concepts.',
      icon: 'texture',
      colors: ['#A8E6CF', '#98D6BF'],
    },
    {
      id: '6',
      title: 'Pattern Mixer',
      subtitle: 'Creative Combinations',
      description: 'Intelligently mix and match patterns to create unique design combinations.',
      icon: 'dots-grid',
      colors: ['#C7CEEA', '#B7BEDA'],
    },
  ];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowFeatures(false);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('dress')) {
      return 'For a stunning dress design, I suggest:\n\n• A-line silhouette for universal flattery\n• Flowing fabric like chiffon or silk\n• Consider adding subtle embellishments at the neckline\n• Current trend: Asymmetrical hemlines are very popular\n\nWould you like me to generate a specific design based on these suggestions?';
    } else if (lowerInput.includes('color')) {
      return 'Based on current trends, here are some amazing color combinations:\n\n• Sage Green + Dusty Pink\n• Navy Blue + Gold Accents\n• Terracotta + Cream\n• Lavender + Silver Grey\n\nThese palettes work beautifully for both casual and formal designs. Which style are you working on?';
    } else if (lowerInput.includes('trend')) {
      return 'Top Fashion Trends for 2024:\n\n📈 Oversized Blazers\n🌟 Metallic Fabrics\n🎨 Bold Color Blocking\n♻️ Sustainable Materials\n✨ Statement Sleeves\n\nWould you like detailed information about any of these trends?';
    } else {
      return 'That\'s an interesting concept! Let me help you develop it further. Could you tell me more about:\n\n• The occasion or purpose?\n• Your target audience?\n• Any specific style preferences?\n• Color preferences?\n\nThis will help me provide more tailored suggestions.';
    }
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action) {
      case 'generate':
        message = 'I want to generate a new design';
        break;
      case 'colors':
        message = 'Suggest a color palette for my design';
        break;
      case 'trends':
        message = 'What are the latest fashion trends?';
        break;
      case 'ideas':
        message = 'Give me some style inspiration';
        break;
    }
    setInputText(message);
    sendMessage();
  };

  const handleFeatureSelect = (feature) => {
    navigation.navigate('Studio', { aiFeature: feature });
  };

  const renderChatMode = () => (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.isUser}
            index={index}
          />
        ))}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.typingDot,
                {
                  opacity: typingAnim,
                },
              ]}
            />
          </View>
        )}
      </ScrollView>

      {showFeatures && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsContainer}
        >
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              color={action.color}
              onPress={() => handleQuickAction(action.action)}
            />
          ))}
        </ScrollView>
      )}
    </>
  );

  const renderFeaturesMode = () => (
    <ScrollView style={styles.featuresContainer}>
      <Text style={styles.featuresTitle}>AI-Powered Features</Text>
      <Text style={styles.featuresSubtitle}>
        Unlock the power of AI for your fashion designs
      </Text>
      {aiFeatures.map((feature) => (
        <AIFeatureCard
          key={feature.id}
          feature={feature}
          onSelect={handleFeatureSelect}
        />
      ))}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, selectedMode === 'chat' && styles.activeModeButton]}
          onPress={() => setSelectedMode('chat')}
        >
          <Ionicons name="chatbubbles" size={20} color={selectedMode === 'chat' ? '#fff' : '#888'} />
          <Text style={[styles.modeButtonText, selectedMode === 'chat' && styles.activeModeText]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, selectedMode === 'features' && styles.activeModeButton]}
          onPress={() => setSelectedMode('features')}
        >
          <Ionicons name="apps" size={20} color={selectedMode === 'features' ? '#fff' : '#888'} />
          <Text style={[styles.modeButtonText, selectedMode === 'features' && styles.activeModeText]}>
            Features
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowApiKeyModal(true)}
        >
          <Ionicons name="settings" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {selectedMode === 'chat' ? renderChatMode() : renderFeaturesMode()}

      {/* Input Bar (only for chat mode) */}
      {selectedMode === 'chat' && (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about fashion..."
              placeholderTextColor="#666"
              multiline
              maxHeight={100}
            />
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#6C63FF', '#4ECDC4'] : ['#333', '#333']}
              style={styles.sendButtonGradient}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* API Key Modal */}
      <Modal
        visible={showApiKeyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI Settings</Text>
            <Text style={styles.modalDescription}>
              Enter your API key to enable advanced AI features
            </Text>
            <TextInput
              style={styles.modalInput}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="sk-..."
              placeholderTextColor="#666"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowApiKeyModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // Save API key logic
                  setShowApiKeyModal(false);
                }}
              >
                <LinearGradient
                  colors={['#6C63FF', '#4ECDC4']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  modeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1A1A2E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeModeButton: {
    backgroundColor: '#6C63FF',
  },
  modeButtonText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 14,
  },
  activeModeText: {
    color: '#fff',
  },
  settingsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageBubble: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bubbleContent: {
    maxWidth: '75%',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 15,
  },
  userBubbleContent: {
    backgroundColor: '#6C63FF',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginTop: 8,
  },
  suggestionText: {
    color: '#6C63FF',
    fontSize: 12,
  },
  messageImage: {
    marginTop: 10,
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
    marginHorizontal: 2,
  },
  quickActionsContainer: {
    paddingVertical: 20,
  },
  quickActionCard: {
    width: 150,
    marginHorizontal: 10,
  },
  quickActionGradient: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  quickActionDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  featuresContainer: {
    flex: 1,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featuresSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureCardGradient: {
    padding: 20,
  },
  featureCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureCardInfo: {
    flex: 1,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  featureCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  featureCardContent: {
    marginTop: 15,
  },
  featureCardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    marginBottom: 15,
  },
  featureCardButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  featureCardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2A2A3E',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
  },
  attachButton: {
    marginLeft: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    flex: 1,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#2A2A3E',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A3E',
    marginRight: 10,
  },
  saveButton: {
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AIAssistantScreen;
