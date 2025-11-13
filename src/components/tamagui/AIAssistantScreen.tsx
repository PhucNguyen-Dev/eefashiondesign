import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Message Bubble Component
const MessageBubble = ({ message, isUser, index }: any) => {
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
      style={{
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {!isUser && (
        <Stack
          width={30}
          height={30}
          borderRadius={15}
          backgroundColor="rgba(108, 99, 255, 0.2)"
          justifyContent="center"
          alignItems="center"
          marginRight={10}
        >
          <MaterialCommunityIcons name="robot" size={20} color="#6C63FF" />
        </Stack>
      )}
      <Stack
        maxWidth="75%"
        backgroundColor={isUser ? '#6C63FF' : '#2A2A3E'}
        borderRadius={20}
        padding={15}
      >
        <TamaguiText color="#fff" fontSize={14} lineHeight={20}>
          {message.text}
        </TamaguiText>
        {message.suggestions && (
          <Stack flexDirection="row" flexWrap="wrap" marginTop={10}>
            {message.suggestions.map((suggestion: string, idx: number) => (
              <TouchableOpacity key={`sug-${idx}`}>
                <Stack
                  backgroundColor="rgba(108, 99, 255, 0.2)"
                  paddingHorizontal={12}
                  paddingVertical={6}
                  borderRadius={15}
                  marginRight={8}
                  marginTop={8}
                >
                  <TamaguiText color="#6C63FF" fontSize={12}>{suggestion}</TamaguiText>
                </Stack>
              </TouchableOpacity>
            ))}
          </Stack>
        )}
        {message.image && (
          <Stack marginTop={10} alignItems="center">
            <MaterialCommunityIcons name="image" size={100} color="#6C63FF" />
          </Stack>
        )}
      </Stack>
    </Animated.View>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon, title, description, color, onPress }: any) => {
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
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={{ width: 150, marginHorizontal: 10, transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={[color, color + 'DD']}
          style={{ padding: 20, borderRadius: 20, alignItems: 'center' }}
        >
          <Stack
            width={50}
            height={50}
            borderRadius={25}
            backgroundColor="rgba(255,255,255,0.2)"
            justifyContent="center"
            alignItems="center"
            marginBottom={10}
          >
            {icon}
          </Stack>
          <TamaguiText fontSize={14} fontWeight="bold" color="#fff" marginBottom={5}>
            {title}
          </TamaguiText>
          <TamaguiText fontSize={11} color="rgba(255,255,255,0.7)" textAlign="center">
            {description}
          </TamaguiText>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// AI Feature Card
const AIFeatureCard = ({ feature, onSelect }: any) => {
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
    <Animated.View style={{ height: cardHeight, marginBottom: 15, borderRadius: 20, overflow: 'hidden' }}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
        <LinearGradient colors={feature.colors} style={{ padding: 20 }}>
          <Stack flexDirection="row" alignItems="center">
            <Stack
              width={50}
              height={50}
              borderRadius={25}
              backgroundColor="rgba(255,255,255,0.2)"
              justifyContent="center"
              alignItems="center"
              marginRight={15}
            >
              <MaterialCommunityIcons name={feature.icon} size={30} color="#fff" />
            </Stack>
            <Stack flex={1}>
              <TamaguiText fontSize={18} fontWeight="bold" color="#fff">
                {feature.title}
              </TamaguiText>
              <TamaguiText fontSize={14} color="rgba(255,255,255,0.7)">
                {feature.subtitle}
              </TamaguiText>
            </Stack>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#fff"
            />
          </Stack>
          {isExpanded && (
            <Stack marginTop={15}>
              <TamaguiText fontSize={14} color="rgba(255,255,255,0.9)" lineHeight={20} marginBottom={15}>
                {feature.description}
              </TamaguiText>
              <TouchableOpacity onPress={() => onSelect(feature)}>
                <Stack
                  backgroundColor="rgba(255,255,255,0.2)"
                  paddingVertical={10}
                  borderRadius={20}
                  alignItems="center"
                >
                  <TamaguiText color="#fff" fontWeight="bold">Try Now</TamaguiText>
                </Stack>
              </TouchableOpacity>
            </Stack>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AIAssistantScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState<any[]>([
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
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const quickActions = [
    { icon: <MaterialCommunityIcons name="magic-staff" size={24} color="#fff" />, title: 'Generate Design', description: 'Create from description', color: '#6C63FF', action: 'generate' },
    { icon: <MaterialCommunityIcons name="palette" size={24} color="#fff" />, title: 'Color Palette', description: 'Get color suggestions', color: '#FF6B6B', action: 'colors' },
    { icon: <MaterialCommunityIcons name="trending-up" size={24} color="#fff" />, title: 'Trend Analysis', description: 'Latest fashion trends', color: '#4ECDC4', action: 'trends' },
    { icon: <MaterialCommunityIcons name="lightbulb" size={24} color="#fff" />, title: 'Style Ideas', description: 'Get inspiration', color: '#FFD93D', action: 'ideas' },
  ];

  const aiFeatures = [
    { id: '1', title: 'Design Generator', subtitle: 'Text to Design', description: 'Describe your vision and watch it come to life with AI-powered design generation.', icon: 'creation', colors: ['#6C63FF', '#5A57E5'] },
    { id: '2', title: 'Style Analyzer', subtitle: 'Upload & Analyze', description: 'Upload any fashion image and get detailed analysis of style, colors, and patterns.', icon: 'image-search', colors: ['#FF6B6B', '#FF5757'] },
    { id: '3', title: 'Trend Predictor', subtitle: 'Future Fashion', description: 'AI predicts upcoming fashion trends based on current data and historical patterns.', icon: 'chart-line', colors: ['#4ECDC4', '#3EBDB4'] },
    { id: '4', title: 'Virtual Stylist', subtitle: 'Personal Assistant', description: 'Get personalized styling advice based on your body type, preferences, and occasions.', icon: 'human-female-dance', colors: ['#FFD93D', '#FFC93D'] },
    { id: '5', title: 'Material Suggester', subtitle: 'Fabric & Texture', description: 'AI recommends the best materials and textures for your design concepts.', icon: 'texture', colors: ['#A8E6CF', '#98D6BF'] },
    { id: '6', title: 'Pattern Mixer', subtitle: 'Creative Combinations', description: 'Intelligently mix and match patterns to create unique design combinations.', icon: 'dots-grid', colors: ['#C7CEEA', '#B7BEDA'] },
  ];

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
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

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
      };
      setMessages((prev: any) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input: string) => {
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

  const handleQuickAction = (action: string) => {
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

  const handleFeatureSelect = (feature: any) => {
    navigation.navigate('Studio', { aiFeature: feature });
  };

  const renderChatMode = () => (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
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
          <Stack flexDirection="row" alignItems="center" paddingLeft={40}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={`dot-${i}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#6C63FF',
                  marginHorizontal: 2,
                  opacity: typingAnim,
                }}
              />
            ))}
          </Stack>
        )}
      </ScrollView>

      {showFeatures && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 20 }}>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={`action-${index}`}
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
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <TamaguiText fontSize={28} fontWeight="bold" color="#fff" marginBottom={5}>
        AI-Powered Features
      </TamaguiText>
      <TamaguiText fontSize={14} color="#888" marginBottom={20}>
        Unlock the power of AI for your fashion designs
      </TamaguiText>
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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack flex={1} backgroundColor="#1A1A2E">
        {/* Mode Selector */}
        <Stack
          flexDirection="row"
          paddingHorizontal={20}
          paddingVertical={10}
          backgroundColor="#16213E"
          borderBottomWidth={1}
          borderBottomColor="#2A2A3E"
        >
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: selectedMode === 'chat' ? '#6C63FF' : 'transparent' }}
            onPress={() => setSelectedMode('chat')}
          >
            <Ionicons name="chatbubbles" size={20} color={selectedMode === 'chat' ? '#fff' : '#888'} />
            <TamaguiText color={selectedMode === 'chat' ? '#fff' : '#888'} marginLeft={8} fontSize={14}>
              Chat
            </TamaguiText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: selectedMode === 'features' ? '#6C63FF' : 'transparent' }}
            onPress={() => setSelectedMode('features')}
          >
            <Ionicons name="apps" size={20} color={selectedMode === 'features' ? '#fff' : '#888'} />
            <TamaguiText color={selectedMode === 'features' ? '#fff' : '#888'} marginLeft={8} fontSize={14}>
              Features
            </TamaguiText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}
            onPress={() => setShowApiKeyModal(true)}
          >
            <Ionicons name="settings" size={20} color="#888" />
          </TouchableOpacity>
        </Stack>

        {/* Content */}
        {selectedMode === 'chat' ? renderChatMode() : renderFeaturesMode()}

        {/* Input Bar (only for chat mode) */}
        {selectedMode === 'chat' && (
          <Stack
            flexDirection="row"
            padding={15}
            backgroundColor="#16213E"
            borderTopWidth={1}
            borderTopColor="#2A2A3E"
          >
            <Stack
              flex={1}
              flexDirection="row"
              alignItems="flex-end"
              backgroundColor="#2A2A3E"
              borderRadius={25}
              paddingHorizontal={15}
              paddingVertical={10}
              marginRight={10}
            >
              <TextInput
                style={{ flex: 1, color: '#fff', fontSize: 14, maxHeight: 100 }}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything about fashion..."
                placeholderTextColor="#666"
                multiline
              />
              <TouchableOpacity style={{ marginLeft: 10 }}>
                <Ionicons name="attach" size={24} color="#888" />
              </TouchableOpacity>
            </Stack>
            <TouchableOpacity
              style={{ width: 45, height: 45, opacity: !inputText.trim() ? 0.5 : 1 }}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={inputText.trim() ? ['#6C63FF', '#4ECDC4'] : ['#333', '#333']}
                style={{ flex: 1, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Stack>
        )}

        {/* API Key Modal */}
        <Modal
          visible={showApiKeyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowApiKeyModal(false)}
        >
          <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Stack backgroundColor="#16213E" borderRadius={20} padding={20} width={width * 0.9}>
              <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={10}>
                AI Settings
              </TamaguiText>
              <TamaguiText fontSize={14} color="#888" marginBottom={20}>
                Enter your API key to enable advanced AI features
              </TamaguiText>
              <TextInput
                style={{ backgroundColor: '#2A2A3E', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 20 }}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-..."
                placeholderTextColor="#666"
                secureTextEntry
              />
              <Stack flexDirection="row" justifyContent="space-between">
                <TouchableOpacity
                  style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: '#2A2A3E', marginRight: 10 }}
                  onPress={() => setShowApiKeyModal(false)}
                >
                  <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Cancel</TamaguiText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}
                  onPress={() => setShowApiKeyModal(false)}
                >
                  <LinearGradient colors={['#6C63FF', '#4ECDC4']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                    <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Save</TamaguiText>
                  </LinearGradient>
                </TouchableOpacity>
              </Stack>
            </Stack>
          </BlurView>
        </Modal>
      </Stack>
    </KeyboardAvoidingView>
  );
};

export default AIAssistantScreen;
