import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../../../core/utils/constants';

const MobileFallback = ({ navigation }) => {
  const features = [
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

  const alternatives = [
    {
      id: '2d-design',
      icon: 'brush',
      title: '2D Design Studio',
      description: 'Create designs on mobile',
      color: THEME_COLORS.accent.purple,
      onPress: () => navigation.navigate('DesignStudio'),
    },
    {
      id: 'ar-view',
      icon: 'camera',
      title: 'AR Try-On',
      description: 'View designs in AR',
      color: THEME_COLORS.accent.teal,
      onPress: () => navigation.navigate('ARView'),
    },
    {
      id: 'home',
      icon: 'home',
      title: 'Home',
      description: 'Explore all features',
      color: THEME_COLORS.accent.blue,
      onPress: () => navigation.navigate('Home'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={[THEME_COLORS.accent.blue, THEME_COLORS.accent.purple]}
              style={styles.iconGradient}
            >
              <MaterialCommunityIcons name="cube-outline" size={60} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>3D Atelier</Text>
          <Text style={styles.subtitle}>Desktop & Web Only</Text>
        </View>

        {/* Message */}
        <View style={styles.messageCard}>
          <MaterialCommunityIcons name="information" size={24} color={THEME_COLORS.accent.blue} />
          <Text style={styles.messageText}>
            The 3D Atelier requires a desktop or web browser for the full experience.
            Mobile devices can view saved projects but cannot edit in 3D.
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Desktop Features</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MaterialCommunityIcons
                    name={feature.icon}
                    size={24}
                    color={THEME_COLORS.accent.blue}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Alternatives */}
        <View style={styles.alternativesSection}>
          <Text style={styles.sectionTitle}>Try These Instead</Text>
          <View style={styles.alternativesList}>
            {alternatives.map((alt) => (
              <TouchableOpacity
                key={alt.id}
                style={styles.alternativeCard}
                onPress={alt.onPress}
              >
                <LinearGradient
                  colors={[alt.color + '20', alt.color + '10']}
                  style={styles.alternativeGradient}
                >
                  <View style={[styles.alternativeIcon, { backgroundColor: alt.color }]}>
                    <MaterialCommunityIcons name={alt.icon} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.alternativeTitle}>{alt.title}</Text>
                  <Text style={styles.alternativeDescription}>{alt.description}</Text>
                  <Ionicons name="arrow-forward" size={20} color={alt.color} />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={THEME_COLORS.text.primary} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
  },
  messageCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.accent.blue + '15',
    borderWidth: 1,
    borderColor: THEME_COLORS.accent.blue + '30',
    marginBottom: 30,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: THEME_COLORS.text.primary,
  },
  featuresSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.accent.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  featureDescription: {
    fontSize: 13,
    color: THEME_COLORS.text.secondary,
  },
  alternativesSection: {
    width: '100%',
    marginBottom: 30,
  },
  alternativesList: {
    gap: 12,
  },
  alternativeCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  alternativeGradient: {
    padding: 20,
    gap: 12,
  },
  alternativeIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
  },
  alternativeDescription: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: THEME_COLORS.background.secondary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
});

export default MobileFallback;

