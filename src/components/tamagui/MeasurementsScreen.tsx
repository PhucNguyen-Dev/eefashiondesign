import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Stack, Text as TamaguiText } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Measurement Input Component
const MeasurementInput = ({ label, value, unit, onChange, icon }: any) => {
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
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Stack
        flexDirection="row"
        alignItems="center"
        backgroundColor="#1A1A2E"
        borderRadius={15}
        padding={15}
        marginBottom={10}
        borderWidth={1}
        borderColor={isFocused ? '#6C63FF' : 'transparent'}
      >
        <Stack
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor="rgba(108, 99, 255, 0.2)"
          justifyContent="center"
          alignItems="center"
          marginRight={15}
        >
          <MaterialCommunityIcons name={icon} size={20} color="#6C63FF" />
        </Stack>
        <Stack flex={1}>
          <TamaguiText fontSize={14} color="#888" marginBottom={5}>
            {label}
          </TamaguiText>
          <Stack flexDirection="row" alignItems="center">
            <TextInput
              style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', minWidth: 60 }}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor="#666"
            />
            <TamaguiText fontSize={14} color="#888" marginLeft={5}>
              {unit}
            </TamaguiText>
          </Stack>
        </Stack>
      </Stack>
    </Animated.View>
  );
};

// Body Visualization Component
const BodyVisualization = ({ measurements, gender }: any) => {
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
    <Stack alignItems="center">
      <Animated.View
        style={{
          transform: [
            { perspective: 1000 },
            { rotateY: viewAngle === '3d' ? rotation : '0deg' },
          ],
        }}
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
      
      <Stack flexDirection="row" marginTop={10}>
        <TouchableOpacity
          style={{ paddingHorizontal: 15, paddingVertical: 8, backgroundColor: viewAngle === 'front' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', borderRadius: 15, marginHorizontal: 5 }}
          onPress={() => setViewAngle('front')}
        >
          <TamaguiText color="#fff" fontSize={12}>Front</TamaguiText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 15, paddingVertical: 8, backgroundColor: viewAngle === 'side' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', borderRadius: 15, marginHorizontal: 5 }}
          onPress={() => setViewAngle('side')}
        >
          <TamaguiText color="#fff" fontSize={12}>Side</TamaguiText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 15, paddingVertical: 8, backgroundColor: viewAngle === '3d' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)', borderRadius: 15, marginHorizontal: 5 }}
          onPress={() => setViewAngle('3d')}
        >
          <TamaguiText color="#fff" fontSize={12}>3D</TamaguiText>
        </TouchableOpacity>
      </Stack>
    </Stack>
  );
};

// Size Recommendation Component
const SizeRecommendation = ({ measurements }: any) => {
  const calculateSize = () => {
    const chest = Number.parseFloat(measurements.chest) || 0;
    if (chest < 86) return 'XS';
    if (chest < 91) return 'S';
    if (chest < 96) return 'M';
    if (chest < 101) return 'L';
    if (chest < 106) return 'XL';
    return 'XXL';
  };

  const size = calculateSize();
  const sizeColors: any = {
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
      style={{ padding: 20, borderRadius: 20, alignItems: 'center' }}
    >
      <TamaguiText fontSize={16} color="rgba(255,255,255,0.9)">Recommended Size</TamaguiText>
      <TamaguiText fontSize={48} fontWeight="bold" color="#fff" marginVertical={10}>
        {size}
      </TamaguiText>
      <TamaguiText fontSize={12} color="rgba(255,255,255,0.7)">Based on your measurements</TamaguiText>
    </LinearGradient>
  );
};

const MeasurementsScreen = ({ navigation }: any) => {
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
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
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

  const handleMeasurementChange = (key: string, value: string) => {
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  return (
    <Stack flex={1} backgroundColor="#0F0F1E">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with Body Visualization */}
        <Animated.View style={{ height: headerHeight, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#6C63FF', '#4ECDC4']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <BodyVisualization measurements={measurements} gender={profile.gender} />
          </LinearGradient>
        </Animated.View>

        {/* Profile Section */}
        <Stack padding={20}>
          <TouchableOpacity onPress={() => setShowProfileModal(true)}>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="#1A1A2E"
              padding={15}
              borderRadius={15}
            >
              <Stack flexDirection="row" alignItems="center">
                <MaterialCommunityIcons name="account" size={40} color="#6C63FF" />
                <Stack marginLeft={15}>
                  <TamaguiText fontSize={18} fontWeight="bold" color="#fff">
                    {profile.name || 'Add Profile'}
                  </TamaguiText>
                  <TamaguiText fontSize={14} color="#888" marginTop={2}>
                    {profile.gender} • {profile.bodyType}
                  </TamaguiText>
                </Stack>
              </Stack>
              <Ionicons name="chevron-forward" size={24} color="#888" />
            </Stack>
          </TouchableOpacity>
        </Stack>

        {/* Size Recommendation */}
        <Stack paddingHorizontal={20} marginBottom={20}>
          <SizeRecommendation measurements={measurements} />
        </Stack>

        {/* Unit Toggle */}
        <Stack flexDirection="row" alignItems="center" paddingHorizontal={20} marginBottom={20}>
          <TamaguiText fontSize={16} color="#fff" marginRight={15}>Units:</TamaguiText>
          <TouchableOpacity
            style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: unit === 'cm' ? '#6C63FF' : '#1A1A2E', borderRadius: 20, marginRight: 10 }}
            onPress={() => setUnit('cm')}
          >
            <TamaguiText color={unit === 'cm' ? '#fff' : '#888'} fontSize={14}>Metric</TamaguiText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: unit === 'in' ? '#6C63FF' : '#1A1A2E', borderRadius: 20 }}
            onPress={() => setUnit('in')}
          >
            <TamaguiText color={unit === 'in' ? '#fff' : '#888'} fontSize={14}>Imperial</TamaguiText>
          </TouchableOpacity>
        </Stack>

        {/* Basic Measurements */}
        <Stack paddingHorizontal={20} marginBottom={20}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={15}>
            <TamaguiText fontSize={20} fontWeight="bold" color="#fff">Basic Measurements</TamaguiText>
            <TouchableOpacity onPress={() => setShowGuideModal(true)}>
              <Ionicons name="help-circle" size={24} color="#6C63FF" />
            </TouchableOpacity>
          </Stack>
          {basicMeasurements.map((item) => (
            <MeasurementInput
              key={item.key}
              label={item.label}
              value={measurements[item.key as keyof typeof measurements]}
              unit={item.unit}
              icon={item.icon}
              onChange={(value: string) => handleMeasurementChange(item.key, value)}
            />
          ))}
        </Stack>

        {/* Detailed Measurements */}
        <Stack paddingHorizontal={20} marginBottom={20}>
          <TamaguiText fontSize={20} fontWeight="bold" color="#fff" marginBottom={15}>
            Detailed Measurements
          </TamaguiText>
          {detailedMeasurements.map((item) => (
            <MeasurementInput
              key={item.key}
              label={item.label}
              value={measurements[item.key as keyof typeof measurements]}
              unit={item.unit}
              icon={item.icon}
              onChange={(value: string) => handleMeasurementChange(item.key, value)}
            />
          ))}
        </Stack>

        {/* Action Buttons */}
        <Stack padding={20}>
          <TouchableOpacity style={{ marginBottom: 15 }} onPress={saveMeasurements}>
            <LinearGradient
              colors={['#6C63FF', '#4ECDC4']}
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 25 }}
            >
              <Feather name="save" size={20} color="#fff" />
              <TamaguiText color="#fff" fontSize={16} fontWeight="bold" marginLeft={10}>
                Save Measurements
              </TamaguiText>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <LinearGradient
              colors={['#FF6B6B', '#FF5757']}
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 25 }}
            >
              <Feather name="share-2" size={20} color="#fff" />
              <TamaguiText color="#fff" fontSize={16} fontWeight="bold" marginLeft={10}>
                Share Profile
              </TamaguiText>
            </LinearGradient>
          </TouchableOpacity>
        </Stack>
      </Animated.ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">
              Profile Settings
            </TamaguiText>
            
            <TextInput
              style={{ backgroundColor: '#2A2A3E', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15 }}
              placeholder="Name"
              placeholderTextColor="#666"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            
            <Stack flexDirection="row" justifyContent="space-between" marginBottom={15}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: profile.gender === 'male' ? '#6C63FF' : '#2A2A3E', padding: 15, borderRadius: 10, marginRight: 5 }}
                onPress={() => setProfile({ ...profile, gender: 'male' })}
              >
                <MaterialCommunityIcons name="gender-male" size={24} color="#fff" />
                <TamaguiText color="#fff" marginLeft={10}>Male</TamaguiText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: profile.gender === 'female' ? '#6C63FF' : '#2A2A3E', padding: 15, borderRadius: 10, marginLeft: 5 }}
                onPress={() => setProfile({ ...profile, gender: 'female' })}
              >
                <MaterialCommunityIcons name="gender-female" size={24} color="#fff" />
                <TamaguiText color="#fff" marginLeft={10}>Female</TamaguiText>
              </TouchableOpacity>
            </Stack>
            
            <TextInput
              style={{ backgroundColor: '#2A2A3E', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 15 }}
              placeholder="Age"
              placeholderTextColor="#666"
              value={profile.age}
              keyboardType="numeric"
              onChangeText={(text) => setProfile({ ...profile, age: text })}
            />
            
            <Stack marginBottom={15}>
              <TamaguiText color="#fff" fontSize={16} marginBottom={10}>Body Type:</TamaguiText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['slim', 'average', 'athletic', 'curvy', 'plus'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: profile.bodyType === type ? '#6C63FF' : '#2A2A3E', borderRadius: 20, marginRight: 10 }}
                    onPress={() => setProfile({ ...profile, bodyType: type })}
                  >
                    <TamaguiText color="#fff" textTransform="capitalize">{type}</TamaguiText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Stack>
            
            <TouchableOpacity
              style={{ backgroundColor: '#6C63FF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 }}
              onPress={() => setShowProfileModal(false)}
            >
              <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Done</TamaguiText>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>

      {/* Measurement Guide Modal */}
      <Modal
        visible={showGuideModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <BlurView intensity={100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView style={{ backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, width: width * 0.9, maxHeight: height * 0.8 }}>
            <TamaguiText fontSize={24} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">
              Measurement Guide
            </TamaguiText>
            
            <Stack flexDirection="row" alignItems="flex-start" marginBottom={20}>
              <MaterialCommunityIcons name="tshirt-crew" size={30} color="#6C63FF" />
              <Stack flex={1} marginLeft={15}>
                <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={5}>Chest</TamaguiText>
                <TamaguiText fontSize={14} color="#aaa" lineHeight={20}>
                  Measure around the fullest part of your chest, keeping the tape horizontal.
                </TamaguiText>
              </Stack>
            </Stack>
            
            <Stack flexDirection="row" alignItems="flex-start" marginBottom={20}>
              <MaterialCommunityIcons name="human" size={30} color="#4ECDC4" />
              <Stack flex={1} marginLeft={15}>
                <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={5}>Waist</TamaguiText>
                <TamaguiText fontSize={14} color="#aaa" lineHeight={20}>
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </TamaguiText>
              </Stack>
            </Stack>
            
            <Stack flexDirection="row" alignItems="flex-start" marginBottom={20}>
              <MaterialCommunityIcons name="human-female" size={30} color="#FF6B6B" />
              <Stack flex={1} marginLeft={15}>
                <TamaguiText fontSize={16} fontWeight="bold" color="#fff" marginBottom={5}>Hips</TamaguiText>
                <TamaguiText fontSize={14} color="#aaa" lineHeight={20}>
                  Measure around the fullest part of your hips, keeping the tape horizontal.
                </TamaguiText>
              </Stack>
            </Stack>
            
            <TouchableOpacity
              style={{ backgroundColor: '#6C63FF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 }}
              onPress={() => setShowGuideModal(false)}
            >
              <TamaguiText color="#fff" fontSize={16} fontWeight="bold">Got it!</TamaguiText>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </Modal>
    </Stack>
  );
};

export default MeasurementsScreen;
