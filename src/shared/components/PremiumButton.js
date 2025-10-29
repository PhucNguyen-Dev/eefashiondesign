/**
 * Premium Button Component
 * Displays premium/upgrade button in header
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FEATURES } from '../../core/config/features.config';

const PremiumButton = () => {
  const [showModal, setShowModal] = React.useState(false);

  if (!FEATURES.PREMIUM.ENABLED) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.premiumButton}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="diamond" size={18} color="#FFD700" />
        <Text style={styles.premiumText}>Premium</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="diamond" size={32} color="#FFD700" />
                <Text style={styles.modalTitle}>Upgrade to Premium</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.modalBody}>
              <Text style={styles.subtitle}>
                Unlock all premium features and take your designs to the next level!
              </Text>

              {/* Features List */}
              <View style={styles.featuresList}>
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
              </View>

              {/* Pricing */}
              <View style={styles.pricingSection}>
                <Text style={styles.pricingTitle}>Choose Your Plan</Text>
                
                <View style={styles.pricingCard}>
                  <Text style={styles.planName}>Monthly</Text>
                  <Text style={styles.planPrice}>$9.99/month</Text>
                  <Text style={styles.planDescription}>
                    Cancel anytime. {FEATURES.PREMIUM.TRIAL_DAYS}-day free trial.
                  </Text>
                </View>

                <View style={[styles.pricingCard, styles.popularCard]}>
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                  <Text style={styles.planName}>Yearly</Text>
                  <Text style={styles.planPrice}>$79.99/year</Text>
                  <Text style={styles.planSavings}>Save 33%</Text>
                  <Text style={styles.planDescription}>
                    Best value. {FEATURES.PREMIUM.TRIAL_DAYS}-day free trial.
                  </Text>
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity style={styles.upgradeButton}>
                <Ionicons name="diamond" size={20} color="#1a1d2e" />
                <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                * This is a placeholder UI. Payment integration coming soon.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#4A90E2" />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <Ionicons name="checkmark-circle" size={24} color="#00D9C0" />
  </View>
);

const styles = StyleSheet.create({
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 6,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    backgroundColor: '#1a1d2e',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3142',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#252837',
    borderRadius: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  pricingSection: {
    marginBottom: 24,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  pricingCard: {
    backgroundColor: '#252837',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularCard: {
    borderColor: '#FFD700',
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1d2e',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D9C0',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1d2e',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PremiumButton;

