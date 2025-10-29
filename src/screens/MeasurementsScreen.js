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
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path, Line, Text as SvgText, G, Polygon } from 'react-native-svg';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Measurement Input Component
const MeasurementInput = ({ label, value, unit, onChange, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.measurementInput,
        isFocused && styles.measurementInputFocused,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.measurementIcon}>
        <MaterialCommunityIcons name={icon} size={20} color="#6C63FF" />
      </View>
      <View style={styles.measurementContent}>
        <Text style={styles.measurementLabel}>{label}</Text>
        <View style={styles.measurementValueContainer}>
          <TextInput
            style={styles.measurementValue}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#666"
          />
          <Text style={styles.measurementUnit}>{unit}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Body Visualization Component
const BodyVisualization = ({ measurements, gender }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [viewAngle, setViewAngle] = useState('front');

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.bodyVisualization}>
      <Animated.View
        style={[
          styles.bodyModel,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: viewAngle === '3d' ? rotation : '0deg' },
            ],
          },
        ]}
      >
        <Svg width={200} height={300} viewBox="0 0 200 300">
          {/* Head */}
          <Circle cx="100" cy="40" r="25" fill="#FFD4A3" stroke="#333" strokeWidth="2" />
          
          {/* Neck */}
          <Line x1="100" y1="65" x2="100" y2="80" stroke="#FFD4A3" strokeWidth="15" />
          
          {/* Shoulders */}
          <Line x1="60" y1="85" x2="140" y2="85" stroke="#6C63FF" strokeWidth="3" />
          
          {/* Chest */}
          <Path
            d="M 60 85 Q 100 100 140 85 L 135 130 Q 100 140 65 130 Z"
            fill="#6C63FF"
            fillOpacity="0.3"
            stroke="#6C63FF"
            strokeWidth="2"
          />
          
          {/* Waist */}
          <Path
            d="M 65 130 Q 100 135 135 130 L 130 160 Q 100 165 70 160 Z"
            fill="#4ECDC4"
            fillOpacity="0.3"
            stroke="#4ECDC4"
            strokeWidth="2"
          />
          
          {/* Hips */}
          <Path
            d="M 70 160 Q 100 165 130 160 L 125 190 Q 100 195 75 190 Z"
            fill="#FF6B6B"
            fillOpacity="0.3"
            stroke="#FF6B6B"
            strokeWidth="2"
          />
          
          {/* Arms */}
          <Line x1="60" y1="85" x2="40" y2="140" stroke="#FFD4A3" strokeWidth="12" />
          <Line x1="140" y1="85" x2="160" y2="140" stroke="#FFD4A3" strokeWidth="12" />
          
          {/* Legs */}
          <Line x1="85" y1="190" x2="80" y2="270" stroke="#FFD4A3" strokeWidth="15" />
          <Line x1="115" y1="190" x2="120" y2="270" stroke="#FFD4A3" strokeWidth="15" />
          
          {/* Measurement Lines */}
          {measurements.chest && (
            <G>
              <Line x1="50" y1="110" x2="150" y2="110" stroke="#6C63FF" strokeWidth="1" strokeDasharray="5,5" />
              <SvgText x="155" y="115" fill="#6C63FF" fontSize="12">
                {measurements.chest}cm
              </SvgText>
            </G>
          )}
          
          {measurements.waist && (
            <G>
              <Line x1="55" y1="145" x2="145" y2="145" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="5,5" />
              <SvgText x="150" y="150" fill="#4ECDC4" fontSize="12">
                {measurements.waist}cm
              </SvgText>
            </G>
          )}
          
          {measurements.hips && (
            <G>
              <Line x1="60" y1="175" x2="140" y2="175" stroke="#FF6B6B" strokeWidth="1" strokeDasharray="5,5" />
              <SvgText x="145" y="180" fill="#FF6B6B" fontSize="12">
                {measurements.hips}cm
              </SvgText>
            </G>
          )}
        </Svg>
      </Animated.View>
      
      <View style={styles.viewControls}>
        <TouchableOpacity
          style={[styles.viewButton, viewAngle === 'front' && styles.activeViewButton]}
          onPress={() => setViewAngle('front')}
        >
          <Text style={styles.viewButtonText}>Front</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewAngle === 'side' && styles.activeViewButton]}
          onPress={() => setViewAngle('side')}
        >
          <Text style={styles.viewButtonText}>Side</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewAngle === '3d' && styles.activeViewButton]}
          onPress={() => setViewAngle('3d')}
        >
          <Text style={styles.viewButtonText}>3D</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Size Recommendation Component
const SizeRecommendation = ({ measurements }) => {
  const calculateSize = () => {
    const chest = parseFloat(measurements.chest) || 0;
    if (chest < 86) return 'XS';
    if (chest < 91) return 'S';
    if (chest < 96) return 'M';
    if (chest < 101) return 'L';
    if (chest < 106) return 'XL';
    return 'XXL';
  };

  const size = calculateSize();
  const sizeColors = {
    'XS': '#FFD93D',
    'S': '#4ECDC4',
    'M': '#6C63FF',
    'L': '#FF6B6B',
    'XL': '#A8E6CF',
    'XXL': '#C7CEEA',
  };

  return (
    <LinearGradient
      colors={[sizeColors[size], sizeColors[size] + '80']}
      style={styles.sizeRecommendation}
    >
      <Text style={styles.sizeTitle}>Recommended Size</Text>
      <Text style={styles.sizeValue}>{size}</Text>
      <Text style={styles.sizeNote}>Based on your measurements</Text>
    </LinearGradient>
  );
};

const MeasurementsScreen = ({ navigation }) => {
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoulders: '',
    armLength: '',
    inseam: '',
    neck: '',
    wrist: '',
    thigh: '',
    calf: '',
  });
  
  const [profile, setProfile] = useState({
    name: '',
    gender: 'male',
    age: '',
    bodyType: 'average',
  });
  
  const [unit, setUnit] = useState('cm');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const basicMeasurements = [
    { key: 'height', label: 'Height', icon: 'human-male-height', unit: 'cm' },
    { key: 'weight', label: 'Weight', icon: 'weight', unit: 'kg' },
    { key: 'chest', label: 'Chest', icon: 'tshirt-crew', unit: 'cm' },
    { key: 'waist', label: 'Waist', icon: 'human', unit: 'cm' },
    { key: 'hips', label: 'Hips', icon: 'human-female', unit: 'cm' },
    { key: 'shoulders', label: 'Shoulders', icon: 'shoulder', unit: 'cm' },
  ];

  const detailedMeasurements = [
    { key: 'armLength', label: 'Arm Length', icon: 'arm-flex', unit: 'cm' },
    { key: 'inseam', label: 'Inseam', icon: 'human-male', unit: 'cm' },
    { key: 'neck', label: 'Neck', icon: 'tie', unit: 'cm' },
    { key: 'wrist', label: 'Wrist', icon: 'watch', unit: 'cm' },
    { key: 'thigh', label: 'Thigh', icon: 'run', unit: 'cm' },
    { key: 'calf', label: 'Calf', icon: 'walk', unit: 'cm' },
  ];

  const handleMeasurementChange = (key, value) => {
    setMeasurements({ ...measurements, [key]: value });
  };

  const saveMeasurements = () => {
    const newProfile = {
      id: Date.now().toString(),
      ...profile,
      measurements,
      createdAt: new Date().toISOString(),
    };
    setSavedProfiles([...savedProfiles, newProfile]);
    Alert.alert('Success', 'Measurements saved successfully!');
  };

  const loadProfile = (profileId) => {
    const profile = savedProfiles.find(p => p.id === profileId);
    if (profile) {
      setMeasurements(profile.measurements);
      setProfile({
        name: profile.name,
        gender: profile.gender,
        age: profile.age,
        bodyType: profile.bodyType,
      });
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with Body Visualization */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <LinearGradient
            colors={['#6C63FF', '#4ECDC4']}
            style={styles.headerGradient}
          >
            <BodyVisualization measurements={measurements} gender={profile.gender} />
          </LinearGradient>
        </Animated.View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => setShowProfileModal(true)}
          >
            <View style={styles.profileInfo}>
              <MaterialCommunityIcons name="account" size={40} color="#6C63FF" />
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                  {profile.name || 'Add Profile'}
                </Text>
                <Text style={styles.profileSubtext}>
                  {profile.gender} • {profile.bodyType}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Size Recommendation */}
        <View style={styles.section}>
          <SizeRecommendation measurements={measurements} />
        </View>

        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <Text style={styles.unitLabel}>Units:</Text>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'cm' && styles.activeUnitButton]}
            onPress={() => setUnit('cm')}
          >
            <Text style={[styles.unitButtonText, unit === 'cm' && styles.activeUnitText]}>
              Metric
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'in' && styles.activeUnitButton]}
            onPress={() => setUnit('in')}
          >
            <Text style={[styles.unitButtonText, unit === 'in' && styles.activeUnitText]}>
              Imperial
            </Text>
          </TouchableOpacity>
        </View>

        {/* Basic Measurements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic Measurements</Text>
            <TouchableOpacity onPress={() => setShowGuideModal(true)}>
              <Ionicons name="help-circle" size={24} color="#6C63FF" />
            </TouchableOpacity>
          </View>
          {basicMeasurements.map((item) => (
            <MeasurementInput
              key={item.key}
              label={item.label}
              value={measurements[item.key]}
              unit={item.unit}
              icon={item.icon}
              onChange={(value) => handleMeasurementChange(item.key, value)}
            />
          ))}
        </View>

        {/* Detailed Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Measurements</Text>
          {detailedMeasurements.map((item) => (
            <MeasurementInput
              key={item.key}
              label={item.label}
              value={measurements[item.key]}
              unit={item.unit}
              icon={item.icon}
              onChange={(value) => handleMeasurementChange(item.key, value)}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={saveMeasurements}>
            <LinearGradient
              colors={['#6C63FF', '#4ECDC4']}
              style={styles.actionButtonGradient}
            >
              <Feather name="save" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Save Measurements</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#FF6B6B', '#FF5757']}
              style={styles.actionButtonGradient}
            >
              <Feather name="share-2" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Share Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Settings</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Name"
              placeholderTextColor="#666"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            
            <View style={styles.genderSelector}>
              <TouchableOpacity
                style={[styles.genderButton, profile.gender === 'male' && styles.activeGenderButton]}
                onPress={() => setProfile({ ...profile, gender: 'male' })}
              >
                <MaterialCommunityIcons name="gender-male" size={24} color="#fff" />
                <Text style={styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, profile.gender === 'female' && styles.activeGenderButton]}
                onPress={() => setProfile({ ...profile, gender: 'female' })}
              >
                <MaterialCommunityIcons name="gender-female" size={24} color="#fff" />
                <Text style={styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Age"
              placeholderTextColor="#666"
              value={profile.age}
              keyboardType="numeric"
              onChangeText={(text) => setProfile({ ...profile, age: text })}
            />
            
            <View style={styles.bodyTypeSelector}>
              <Text style={styles.bodyTypeLabel}>Body Type:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['slim', 'average', 'athletic', 'curvy', 'plus'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.bodyTypeButton,
                      profile.bodyType === type && styles.activeBodyTypeButton,
                    ]}
                    onPress={() => setProfile({ ...profile, bodyType: type })}
                  >
                    <Text style={styles.bodyTypeButtonText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Measurement Guide Modal */}
      <Modal
        visible={showGuideModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Measurement Guide</Text>
            
            <View style={styles.guideItem}>
              <MaterialCommunityIcons name="tshirt-crew" size={30} color="#6C63FF" />
              <View style={styles.guideText}>
                <Text style={styles.guideTitle}>Chest</Text>
                <Text style={styles.guideDescription}>
                  Measure around the fullest part of your chest, keeping the tape horizontal.
                </Text>
              </View>
            </View>
            
            <View style={styles.guideItem}>
              <MaterialCommunityIcons name="human" size={30} color="#4ECDC4" />
              <View style={styles.guideText}>
                <Text style={styles.guideTitle}>Waist</Text>
                <Text style={styles.guideDescription}>
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </Text>
              </View>
            </View>
            
            <View style={styles.guideItem}>
              <MaterialCommunityIcons name="human-female" size={30} color="#FF6B6B" />
              <View style={styles.guideText}>
                <Text style={styles.guideTitle}>Hips</Text>
                <Text style={styles.guideDescription}>
                  Measure around the fullest part of your hips, keeping the tape horizontal.
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowGuideModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </ScrollView>
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
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyVisualization: {
    alignItems: 'center',
  },
  bodyModel: {
    marginBottom: 20,
  },
  viewControls: {
    flexDirection: 'row',
    marginTop: 10,
  },
  viewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeViewButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  profileSection: {
    padding: 20,
  },
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 15,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetails: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  measurementInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  measurementInputFocused: {
    borderColor: '#6C63FF',
  },
  measurementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  measurementContent: {
    flex: 1,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  measurementValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 60,
  },
  measurementUnit: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  unitLabel: {
    fontSize: 16,
    color: '#fff',
    marginRight: 15,
  },
  unitButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    marginRight: 10,
  },
  activeUnitButton: {
    backgroundColor: '#6C63FF',
  },
  unitButtonText: {
    color: '#888',
    fontSize: 14,
  },
  activeUnitText: {
    color: '#fff',
  },
  sizeRecommendation: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  sizeTitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  sizeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  sizeNote: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
  },
  actionButtons: {
    padding: 20,
  },
  actionButton: {
    marginBottom: 15,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#2A2A3E',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A3E',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeGenderButton: {
    backgroundColor: '#6C63FF',
  },
  genderButtonText: {
    color: '#fff',
    marginLeft: 10,
  },
  bodyTypeSelector: {
    marginBottom: 15,
  },
  bodyTypeLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  bodyTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2A2A3E',
    borderRadius: 20,
    marginRight: 10,
  },
  activeBodyTypeButton: {
    backgroundColor: '#6C63FF',
  },
  bodyTypeButtonText: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  guideText: {
    flex: 1,
    marginLeft: 15,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  guideDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
});

export default MeasurementsScreen;
