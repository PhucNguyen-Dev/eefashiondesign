/**
 * Premium Button Component - Tamagui Version
 * Displays premium/upgrade button in header
 */

import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { Ionicons } from '@expo/vector-icons';
import { FEATURES } from '../../core/config/features.config';
import { Text as TamaguiText } from './Text';

// Define XStack and YStack
const XStack = styled(Stack, { flexDirection: 'row' });
const YStack = styled(Stack, { flexDirection: 'column' });

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const PremiumButtonContainer = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#FFD700',
  gap: 6,
});

const PremiumText = styled(TamaguiText, {
  color: '#FFD700',
  fontSize: 14,
  fontWeight: '600',
});

const ModalOverlay = styled(YStack, {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
});

const ModalContent = styled(YStack, {
  width: '90%',
  maxWidth: 600,
  maxHeight: '90%',
  backgroundColor: '$bgSecondary',
  borderRadius: 20,
  overflow: 'hidden',
});

const ModalHeader = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: '$border',
});

const ModalTitle = styled(TamaguiText, {
  fontSize: 24,
  fontWeight: 'bold',
  color: '$textPrimary',
});

const Subtitle = styled(TamaguiText, {
  fontSize: 16,
  color: '$textSecondary',
  marginBottom: 24,
  textAlign: 'center',
});

const FeatureItemContainer = styled(XStack, {
  alignItems: 'center',
  gap: 12,
  padding: 12,
  backgroundColor: '$bgCard',
  borderRadius: 12,
});

const FeatureIcon = styled(YStack, {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(74, 144, 226, 0.1)',
  justifyContent: 'center',
  alignItems: 'center',
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

const PricingCard = styled(YStack, {
  backgroundColor: '$bgCard',
  padding: 20,
  borderRadius: 16,
  marginBottom: 12,
  borderWidth: 2,
  borderColor: 'transparent',
});

const PlanName = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: '600',
  color: '$textPrimary',
  marginBottom: 8,
});

const PlanPrice = styled(TamaguiText, {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#4A90E2',
  marginBottom: 4,
});

const UpgradeButton = styled(TouchableOpacity, {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFD700',
  padding: 16,
  borderRadius: 12,
  gap: 8,
  marginBottom: 16,
});

const UpgradeButtonText = styled(TamaguiText, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1a1d2e',
});

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <FeatureItemContainer>
    <FeatureIcon>
      <Ionicons name={icon} size={24} color="#4A90E2" />
    </FeatureIcon>
    <YStack flex={1}>
      <FeatureTitle>{title}</FeatureTitle>
      <FeatureDescription>{description}</FeatureDescription>
    </YStack>
    <Ionicons name="checkmark-circle" size={24} color="#00D9C0" />
  </FeatureItemContainer>
);

const PremiumButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  if (!FEATURES.PREMIUM.ENABLED) {
    return null;
  }

  return (
    <>
      <PremiumButtonContainer onPress={() => setShowModal(true)}>
        <Ionicons name="diamond" size={18} color="#FFD700" />
        <PremiumText>Premium</PremiumText>
      </PremiumButtonContainer>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            {/* Header */}
            <ModalHeader>
              <XStack alignItems="center" gap="$sm">
                <Ionicons name="diamond" size={32} color="#FFD700" />
                <ModalTitle>Upgrade to Premium</ModalTitle>
              </XStack>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </ModalHeader>

            {/* Content */}
            <ScrollView style={{ padding: 20 }}>
              <Subtitle>
                Unlock all premium features and take your designs to the next level!
              </Subtitle>

              {/* Features List */}
              <YStack gap="$md" marginBottom={32}>
                <FeatureItem
                  icon="cube"
                  title="Advanced 3D Tools"
                  description="Access professional-grade 3D modeling tools"
                />
                <FeatureItem
                  icon="infinite"
                  title="Unlimited Designs"
                  description="Create and save unlimited design projects"
                />
                <FeatureItem
                  icon="image"
                  title="HD Export"
                  description="Export designs in high-definition quality"
                />
                <FeatureItem
                  icon="color-palette"
                  title="Custom Materials"
                  description="Import and create custom fabric materials"
                />
                <FeatureItem
                  icon="sparkles"
                  title="AI Suggestions"
                  description="Get AI-powered design recommendations"
                />
                <FeatureItem
                  icon="cloud-upload"
                  title="Cloud Sync"
                  description="Sync your designs across all devices"
                />
                <FeatureItem
                  icon="people"
                  title="Collaboration"
                  description="Work together with other designers"
                />
                <FeatureItem
                  icon="headset"
                  title="Priority Support"
                  description="Get priority customer support"
                />
              </YStack>

              {/* Pricing */}
              <YStack marginBottom={24}>
                <TamaguiText
                  fontSize={20}
                  fontWeight="bold"
                  color="$textPrimary"
                  marginBottom={16}
                  textAlign="center"
                >
                  Choose Your Plan
                </TamaguiText>
                
                <PricingCard>
                  <PlanName>Monthly</PlanName>
                  <PlanPrice>$9.99/month</PlanPrice>
                  <TamaguiText fontSize={14} color="$textSecondary">
                    Cancel anytime. {FEATURES.PREMIUM.TRIAL_DAYS}-day free trial.
                  </TamaguiText>
                </PricingCard>

                <PricingCard style={{ borderColor: '#FFD700', position: 'relative' }}>
                  <Stack
                    position="absolute"
                    top={-12}
                    right={20}
                    backgroundColor="#FFD700"
                    paddingHorizontal={12}
                    paddingVertical={4}
                    borderRadius={12}
                  >
                    <TamaguiText fontSize={10} fontWeight="bold" color="#1a1d2e">
                      MOST POPULAR
                    </TamaguiText>
                  </Stack>
                  <PlanName>Yearly</PlanName>
                  <PlanPrice>$79.99/year</PlanPrice>
                  <TamaguiText fontSize={14} fontWeight="600" color="#00D9C0" marginBottom={8}>
                    Save 33%
                  </TamaguiText>
                  <TamaguiText fontSize={14} color="$textSecondary">
                    Best value. {FEATURES.PREMIUM.TRIAL_DAYS}-day free trial.
                  </TamaguiText>
                </PricingCard>
              </YStack>

              {/* CTA Button */}
              <UpgradeButton>
                <Ionicons name="diamond" size={20} color="#1a1d2e" />
                <UpgradeButtonText>Start Free Trial</UpgradeButtonText>
              </UpgradeButton>

              <TamaguiText
                fontSize={12}
                color="#666"
                textAlign="center"
                fontStyle="italic"
              >
                * This is a placeholder UI. Payment integration coming soon.
              </TamaguiText>
            </ScrollView>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default PremiumButton;
