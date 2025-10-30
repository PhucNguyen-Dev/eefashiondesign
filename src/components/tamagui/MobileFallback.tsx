import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface MobileFallbackProps {
  navigation: any;
}

interface Feature {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}

interface Alternative {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

const Container = styled(YStack, {
  flex: 1,
  backgroundColor: '$bg',
});

const ScrollContent = styled(YStack, {
  padding: 24,
  alignItems: 'center',
});

const Header = styled(YStack, {
  alignItems: 'center',
  marginBottom: 32,
});

const IconContainer = styled(YStack, {
  marginBottom: 24,
});

const IconGradient = styled(YStack, {
  width: 120,
  height: 120,
  borderRadius: 60,
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled(TamaguiText, {
  fontSize: 32,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 8,
  textAlign: 'center',
});

const Subtitle = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
  textAlign: 'center',
});

const MessageCard = styled(XStack, {
  backgroundColor: 'rgba(74, 144, 226, 0.1)',
  padding: 16,
  borderRadius: 12,
  marginBottom: 32,
  gap: 12,
  alignItems: 'flex-start',
  maxWidth: 600,
});

const MessageText = styled(TamaguiText, {
  flex: 1,
  fontSize: 14,
  color: '$textPrimary',
  lineHeight: 20,
});

const FeaturesSection = styled(YStack, {
  width: '100%',
  maxWidth: 600,
  marginBottom: 32,
});

const SectionTitle = styled(TamaguiText, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '$textPrimary',
  marginBottom: 16,
});

const FeaturesList = styled(YStack, {
  gap: 12,
});

const FeatureItem = styled(XStack, {
  backgroundColor: '$bgCard',
  padding: 16,
  borderRadius: 12,
  gap: 16,
  alignItems: 'center',
});

const FeatureIcon = styled(YStack, {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(74, 144, 226, 0.1)',
  alignItems: 'center',
  justifyContent: 'center',
});

const FeatureContent = styled(YStack, {
  flex: 1,
});

const FeatureTitle = styled(TamaguiText, {
  fontSize: 16,
  fontWeight: '600',
  color: '$textPrimary',
  marginBottom: 4,
});

const FeatureDescription = styled(TamaguiText, {
  fontSize: 14,
  color: '$textSecondary',
});

const AlternativesSection = styled(YStack, {
  width: '100%',
  maxWidth: 600,
  marginBottom: 32,
});

const AlternativesList = styled(YStack, {
  gap: 16,
});

const AlternativeCard = styled(TouchableOpacity, {
  borderRadius: 16,
  overflow: 'hidden',
});

const AlternativeGradient = styled(YStack, {
  padding: 20,
  alignItems: 'center',
  gap: 12,
});

const AlternativeIcon = styled(YStack, {
  width: 56,
  height: 56,
  borderRadius: 28,
  alignItems: 'center',
  justifyContent: 'center',
});

const AlternativeTitle = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '$textPrimary',
  textAlign: 'center',
});

const AlternativeDescription = styled(TamaguiText, {
  fontSize: 14,
  color: '$textSecondary',
  textAlign: 'center',
  marginBottom: 8,
});

const BackButton = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingHorizontal: 24,
  paddingVertical: 12,
  backgroundColor: '$bgCard',
  borderRadius: 12,
});

const BackButtonText = styled(TamaguiText, {
  fontSize: 16,
  fontWeight: '600',
  color: '$textPrimary',
});

const MobileFallback: React.FC<MobileFallbackProps> = ({ navigation }) => {
  const features: Feature[] = [
    {
      icon: 'laptop',
      title: 'Desktop Experience',
      description: 'Full 3D editing with advanced tools',
    },
    {
      icon: 'cube-outline',
      title: 'Real-time 3D',
      description: 'Interactive 3D viewport with WebGL',
    },
    {
      icon: 'palette',
      title: 'Material Editor',
      description: 'Advanced material and texture editing',
    },
    {
      icon: 'play',
      title: 'Physics Simulation',
      description: 'Real-time fabric physics simulation',
    },
  ];

  const alternatives: Alternative[] = [
    {
      id: '2d-design',
      icon: 'brush',
      title: '2D Design Studio',
      description: 'Create designs on mobile',
      color: '#6C5CE7',
      onPress: () => navigation.navigate('DesignStudio'),
    },
    {
      id: 'ar-view',
      icon: 'camera',
      title: 'AR Try-On',
      description: 'View designs in AR',
      color: '#00D9C0',
      onPress: () => navigation.navigate('ARView'),
    },
    {
      id: 'home',
      icon: 'home',
      title: 'Home',
      description: 'Explore all features',
      color: '#4A90E2',
      onPress: () => navigation.navigate('Home'),
    },
  ];

  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollContent>
          {/* Header */}
          <Header>
            <IconContainer>
              <LinearGradient
                colors={['#4A90E2', '#6C5CE7']}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="cube-outline" size={60} color="#FFFFFF" />
              </LinearGradient>
            </IconContainer>

            <Title>3D Atelier</Title>
            <Subtitle>Desktop & Web Only</Subtitle>
          </Header>

          {/* Message */}
          <MessageCard>
            <MaterialCommunityIcons name="information" size={24} color="#4A90E2" />
            <MessageText>
              The 3D Atelier requires a desktop or web browser for the full experience.
              Mobile devices can view saved projects but cannot edit in 3D.
            </MessageText>
          </MessageCard>

          {/* Features List */}
          <FeaturesSection>
            <SectionTitle>Desktop Features</SectionTitle>
            <FeaturesList>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <FeatureIcon>
                    <MaterialCommunityIcons
                      name={feature.icon}
                      size={24}
                      color="#4A90E2"
                    />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDescription>{feature.description}</FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              ))}
            </FeaturesList>
          </FeaturesSection>

          {/* Alternatives */}
          <AlternativesSection>
            <SectionTitle>Try These Instead</SectionTitle>
            <AlternativesList>
              {alternatives.map((alt) => (
                <AlternativeCard
                  key={alt.id}
                  onPress={alt.onPress}
                >
                  <LinearGradient
                    colors={[alt.color + '20', alt.color + '10']}
                    style={{ padding: 20, alignItems: 'center', gap: 12 }}
                  >
                    <AlternativeIcon style={{ backgroundColor: alt.color }}>
                      <MaterialCommunityIcons name={alt.icon} size={28} color="#FFFFFF" />
                    </AlternativeIcon>
                    <AlternativeTitle>{alt.title}</AlternativeTitle>
                    <AlternativeDescription>{alt.description}</AlternativeDescription>
                    <Ionicons name="arrow-forward" size={20} color={alt.color} />
                  </LinearGradient>
                </AlternativeCard>
              ))}
            </AlternativesList>
          </AlternativesSection>

          {/* Back Button */}
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <BackButtonText>Go Back</BackButtonText>
          </BackButton>
        </ScrollContent>
      </ScrollView>
    </Container>
  );
};

export default MobileFallback;
