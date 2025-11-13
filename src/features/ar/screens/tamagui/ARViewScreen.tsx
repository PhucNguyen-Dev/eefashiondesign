/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  View as RNView,
} from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// Import types
import type {
  ARMode,
  CameraType,
  Garment,
  ARFeature,
  CapturedImage,
  MediaAsset,
  ARViewScreenProps,
  CameraPermissionResponse,
  ImagePickerResult,
} from './types.js';

// Camera component - native or web
let Camera: any = null;
if (Platform.OS !== 'web') {
  try {
    Camera = require('expo-camera').Camera;
  } catch (error) {
    console.warn('Camera module not available:', error);
  }
}

const { width, height } = Dimensions.get('window');

const ARViewScreen: React.FC<ARViewScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(
    Platform.OS !== 'web' ? 'back' : 'user'
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [arMode, setArMode] = useState<ARMode>('preview');
  const [showGarmentSelector, setShowGarmentSelector] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [webStream, setWebStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedImages, setSavedImages] = useState<MediaAsset[]>([]);
  const [showGallery, setShowGallery] = useState<boolean>(false);

  const cameraRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const garments: Garment[] = [
    { id: '1', name: 'T-Shirt', icon: 'tshirt-crew', color: '#6C63FF' },
    { id: '2', name: 'Dress', icon: 'human-female-dance', color: '#FF6B6B' },
    { id: '3', name: 'Jacket', icon: 'coat-rack', color: '#4ECDC4' },
    { id: '4', name: 'Pants', icon: 'human-male', color: '#FFD93D' },
    { id: '5', name: 'Accessories', icon: 'glasses', color: '#A8E6CF' },
  ];

  const arFeatures: ARFeature[] = [
    { id: 'preview', name: 'Preview', icon: 'eye' },
    { id: 'measure', name: 'Measure', icon: 'ruler' },
    { id: 'tryon', name: 'Try On', icon: 'human' },
    { id: 'color', name: 'Colors', icon: 'palette' },
    { id: 'fabric', name: 'Fabric', icon: 'texture' },
  ];

  useEffect(() => {
    void (async () => {
      try {
        if (Platform.OS !== 'web' && Camera) {
          // Mobile: Use Expo Camera
          const { status }: CameraPermissionResponse = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');

          // Request MediaLibrary permissions for saving images
          const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
          setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
        } else if (Platform.OS === 'web') {
          // Web: Request browser camera permission and start stream
          try {
            const stream = await (globalThis as any).navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: cameraType === 'user' ? 'user' : 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            });
            setHasPermission(true);
            setWebStream(stream);

            // Attach stream to video element
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Camera permission denied:', error);
            Alert.alert(
              'Camera Permission Required',
              'Please allow camera access in your browser to use AR features.',
              [{ text: 'OK' }]
            );
            setHasPermission(false);
          }
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert(
          'Permission Error',
          'Failed to request camera permissions. Please try again.',
          [{ text: 'OK' }]
        );
        setHasPermission(false);
      }
    })();

    // Pulse animation for recording indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();

    // Cleanup web stream on unmount
    return () => {
      if (Platform.OS === 'web' && webStream) {
        webStream.getTracks().forEach(track => { track.stop(); });
      }
    };
  }, []);

  // Update web camera when type changes
  useEffect(() => {
    if (Platform.OS === 'web' && hasPermission) {
      void (async () => {
        // Stop existing stream
        if (webStream) {
          webStream.getTracks().forEach(track => { track.stop(); });
        }

        // Start new stream with updated facing mode
        try {
          const stream = await (globalThis as any).navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: cameraType === 'user' ? 'user' : 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          setWebStream(stream);

          // Attach stream to video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.log('Failed to switch camera:', error);
        }
      })();
    }
  }, [cameraType, hasPermission]);

  const toggleCameraType = (): void => {
    if (Platform.OS !== 'web' && Camera) {
      setCameraType(
        cameraType === 'back' ? 'front' : 'back'
      );
    } else if (Platform.OS === 'web') {
      // Toggle between user (front) and environment (back) camera
      setCameraType(cameraType === 'user' ? 'environment' : 'user');
    }
  };

  const takePicture = async (): Promise<void> => {
    try {
      setIsLoading(true);

      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Flash animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      let imageUri: string | null = null;

      if (Platform.OS !== 'web' && cameraRef.current) {
        // Native: Use Expo Camera
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: false,
          skipProcessing: false,
        });
        imageUri = photo.uri;

        // Save to MediaLibrary if permission granted
        if (hasMediaLibraryPermission) {
          try {
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            console.log('Image saved to gallery:', asset.uri);

            // Add to saved images list
            setSavedImages(prev => [asset as any, ...prev]);

            Alert.alert(
              'Photo Saved!',
              'Your photo has been saved to the gallery.',
              [
                { text: 'View Gallery', onPress: () => { setShowGallery(true); } },
                { text: 'Use in Design', onPress: () => { sendToDesignStudio(asset.uri); } },
                { text: 'OK' }
              ]
            );
          } catch (saveError) {
            console.error('Failed to save to gallery:', saveError);
            Alert.alert(
              'Save Failed',
              'Could not save photo to gallery, but you can still use it in the design studio.',
              [{ text: 'OK' }]
            );
          }
        }

        setCapturedImage(imageUri);
      } else if (Platform.OS === 'web' && videoRef.current) {
        // Web: Capture from video element
        const canvas = (globalThis as any).document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        // Convert to blob for better quality
        canvas.toBlob((blob: Blob) => {
          const imageDataUrl = URL.createObjectURL(blob);
          setCapturedImage(imageDataUrl);

          Alert.alert(
            'Photo Captured!',
            'Your photo is ready to use.',
            [
              { text: 'Use in Design', onPress: () => { sendToDesignStudio(imageDataUrl); } },
              { text: 'OK' }
            ]
          );
        }, 'image/jpeg', 0.95);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert(
        'Camera Error',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendToDesignStudio = (imageUri: string): void => {
    try {
      // Navigate to Design Studio with the captured image
      navigation.navigate('Design Studio', {
        importedImage: imageUri,
        source: 'ar-camera'
      });
    } catch (error) {
      console.error('Error navigating to Design Studio:', error);
      Alert.alert(
        'Navigation Error',
        'Could not open Design Studio. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const openGallery = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Request permission to access gallery
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      }) as ImagePickerResult;

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setCapturedImage(selectedImage);

        Alert.alert(
          'Image Selected',
          'Would you like to use this image in the design studio?',
          [
            { text: 'Use in Design', onPress: () => { sendToDesignStudio(selectedImage); } },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert(
        'Gallery Error',
        'Failed to open gallery. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async (): Promise<void> => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      // Process video
    }
  };

  const stopRecording = (): void => {
    if (cameraRef.current && isRecording) {
      void cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const selectGarment = (garment: Garment): void => {
    setSelectedGarment(garment);
    setShowGarmentSelector(false);
    // Apply AR garment overlay
  };

  const renderAROverlay = (): JSX.Element | null => {
    if (!selectedGarment) return null;

    return (
      <RNView style={styles.arOverlay}>
        {/* AR Garment Visualization */}
        <Stack justifyContent="center" alignItems="center">
          <MaterialCommunityIcons
            name={selectedGarment.icon as any}
            size={150}
            color={selectedGarment.color}
            style={{ opacity: 0.7 }}
          />
        </Stack>
        
        {/* AR Measurement Grid */}
        {arMode === 'measure' && (
          <Stack style={styles.measurementGrid}>
            <RNView style={styles.measurementLine} />
            <RNView style={[styles.measurementLine, { transform: [{ rotate: '90deg' }] }]} />
            <Text style={styles.measurementText}>Height: 175cm</Text>
            <Text style={[styles.measurementText, { top: 100 }]}>Width: 45cm</Text>
          </Stack>
        )}
      </RNView>
    );
  };

  if (hasPermission === null) {
    return (
      <Stack flex={1} backgroundColor="#0F0F1E" justifyContent="center" alignItems="center">
        <Text color="#fff" fontSize={16}>Requesting camera permission...</Text>
      </Stack>
    );
  }

  if (hasPermission === false) {
    return (
      <Stack flex={1} backgroundColor="#0F0F1E" justifyContent="center" alignItems="center">
        <Text color="#FF6B6B" fontSize={16}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            if (Platform.OS !== 'web' && Camera) {
              void Camera.requestCameraPermissionsAsync();
            }
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </Stack>
    );
  }

  return (
    <Stack flex={1} backgroundColor="#0F0F1E">
      <Animated.View style={[styles.cameraContainer, { opacity: fadeAnim }]}>
        {/* Camera - Native or Web */}
        {Platform.OS !== 'web' ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType as any}
            ratio="16:9"
          >
            {/* AR Overlay */}
            {renderAROverlay()}

            {/* Top Controls */}
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop={50} paddingHorizontal={20}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => { navigation.goBack(); }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Stack flexDirection="row" backgroundColor="rgba(0,0,0,0.5)" borderRadius={25} padding={5}>
                {arFeatures.slice(0, 3).map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={[
                      styles.arModeButton,
                      arMode === feature.id && styles.activeArMode,
                    ]}
                    onPress={() => { setArMode(feature.id as ARMode); }}
                  >
                    <MaterialCommunityIcons
                      name={feature.icon as any}
                      size={20}
                      color={arMode === feature.id ? '#fff' : '#aaa'}
                    />
                    <Text
                      color={arMode === feature.id ? '#fff' : '#aaa'}
                      fontSize={12}
                      marginLeft={5}
                    >
                      {feature.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Stack>

              <TouchableOpacity
                style={styles.topButton}
                onPress={toggleCameraType}
              >
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            </Stack>

            {/* Center Focus */}
            <RNView style={styles.focusContainer}>
              <RNView style={styles.focusCorner} />
              <RNView style={[styles.focusCorner, styles.focusCornerTR]} />
              <RNView style={[styles.focusCorner, styles.focusCornerBL]} />
              <RNView style={[styles.focusCorner, styles.focusCornerBR]} />
              {arMode === 'measure' && (
                <Text style={styles.focusText}>Align with body</Text>
              )}
            </RNView>

            {/* Bottom Controls */}
            <Stack position="absolute" bottom={50} left={0} right={0} flexDirection="row" justifyContent="space-around" alignItems="center" paddingHorizontal={50}>
              {/* Garment Selector */}
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => { setShowGarmentSelector(true); }}
              >
                <MaterialCommunityIcons name="hanger" size={24} color="#fff" />
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => { void takePicture(); }}
                onLongPress={() => { void startRecording(); }}
                onPressOut={stopRecording}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#6C63FF', '#4ECDC4']}
                  style={styles.captureButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : isRecording ? (
                    <Animated.View
                      style={[
                        styles.recordingIndicator,
                        { transform: [{ scale: pulseAnim }] },
                      ]}
                    />
                  ) : (
                    <RNView style={styles.captureButtonInner} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Gallery Button */}
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => { void openGallery(); }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="images" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </Stack>

            {/* AR Info Panel */}
            {selectedGarment && (
              <Stack position="absolute" top={120} left={20} backgroundColor="rgba(0,0,0,0.7)" padding={15} borderRadius={15}>
                <Text color="#fff" fontSize={16} fontWeight="bold" marginBottom={10}>{selectedGarment.name}</Text>
                <Stack flexDirection="row">
                  <Stack marginRight={20}>
                    <Text color="#aaa" fontSize={10}>Size</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">M</Text>
                  </Stack>
                  <Stack marginRight={20}>
                    <Text color="#aaa" fontSize={10}>Fit</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">95%</Text>
                  </Stack>
                  <Stack>
                    <Text color="#aaa" fontSize={10}>Style</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">Casual</Text>
                  </Stack>
                </Stack>
              </Stack>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <Stack position="absolute" top={60} alignSelf="center" flexDirection="row" alignItems="center" backgroundColor="rgba(255, 107, 107, 0.9)" paddingHorizontal={15} paddingVertical={8} borderRadius={20}>
                <RNView style={styles.recordingDot} />
                <Text color="#fff" fontSize={14} fontWeight="bold">Recording</Text>
              </Stack>
            )}
          </Camera>
        ) : (
          // Web Camera using HTML5 video
          <RNView style={styles.camera}>
            <video
              ref={videoRef as any}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* AR Overlay */}
            {renderAROverlay()}

            {/* Top Controls */}
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" paddingTop={50} paddingHorizontal={20}>
              <TouchableOpacity
                style={styles.topButton}
                onPress={() => { navigation.goBack(); }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <Stack flexDirection="row" backgroundColor="rgba(0,0,0,0.5)" borderRadius={25} padding={5}>
                {arFeatures.slice(0, 3).map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={[
                      styles.arModeButton,
                      arMode === feature.id && styles.activeArMode,
                    ]}
                    onPress={() => { setArMode(feature.id as ARMode); }}
                  >
                    <MaterialCommunityIcons
                      name={feature.icon as any}
                      size={20}
                      color={arMode === feature.id ? '#fff' : '#aaa'}
                    />
                    <Text
                      color={arMode === feature.id ? '#fff' : '#aaa'}
                      fontSize={12}
                      marginLeft={5}
                    >
                      {feature.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Stack>

              <TouchableOpacity
                style={styles.topButton}
                onPress={toggleCameraType}
              >
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            </Stack>

            {/* Center Focus */}
            <RNView style={styles.focusContainer}>
              <RNView style={styles.focusCorner} />
              <RNView style={[styles.focusCorner, styles.focusCornerTR]} />
              <RNView style={[styles.focusCorner, styles.focusCornerBL]} />
              <RNView style={[styles.focusCorner, styles.focusCornerBR]} />
              {arMode === 'measure' && (
                <Text style={styles.focusText}>Align with body</Text>
              )}
            </RNView>

            {/* Bottom Controls */}
            <Stack position="absolute" bottom={50} left={0} right={0} flexDirection="row" justifyContent="space-around" alignItems="center" paddingHorizontal={50}>
              {/* Garment Selector */}
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => { setShowGarmentSelector(true); }}
              >
                <MaterialCommunityIcons name="hanger" size={24} color="#fff" />
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => { void takePicture(); }}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#6C63FF', '#4ECDC4']}
                  style={styles.captureButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : (
                    <RNView style={styles.captureButtonInner} />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Gallery Button */}
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => { void openGallery(); }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="images" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </Stack>

            {/* AR Info Panel */}
            {selectedGarment && (
              <Stack position="absolute" top={120} left={20} backgroundColor="rgba(0,0,0,0.7)" padding={15} borderRadius={15}>
                <Text color="#fff" fontSize={16} fontWeight="bold" marginBottom={10}>{selectedGarment.name}</Text>
                <Stack flexDirection="row">
                  <Stack marginRight={20}>
                    <Text color="#aaa" fontSize={10}>Size</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">M</Text>
                  </Stack>
                  <Stack marginRight={20}>
                    <Text color="#aaa" fontSize={10}>Fit</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">95%</Text>
                  </Stack>
                  <Stack>
                    <Text color="#aaa" fontSize={10}>Style</Text>
                    <Text color="#fff" fontSize={14} fontWeight="bold">Casual</Text>
                  </Stack>
                </Stack>
              </Stack>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <Stack position="absolute" top={60} alignSelf="center" flexDirection="row" alignItems="center" backgroundColor="rgba(255, 107, 107, 0.9)" paddingHorizontal={15} paddingVertical={8} borderRadius={20}>
                <RNView style={styles.recordingDot} />
                <Text color="#fff" fontSize={14} fontWeight="bold">Recording</Text>
              </Stack>
            )}
          </RNView>
        )}
      </Animated.View>

      {/* Garment Selector Modal */}
      <Modal
        visible={showGarmentSelector}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowGarmentSelector(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9}>
            <Text fontSize={24} fontWeight="bold" color="#fff" marginBottom={20} textAlign="center">Select Garment</Text>
            <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-between">
              {garments.map((garment) => (
                <TouchableOpacity
                  key={garment.id}
                  style={styles.garmentOption}
                  onPress={() => { selectGarment(garment); }}
                >
                  <LinearGradient
                    colors={[garment.color, garment.color + 'DD']}
                    style={styles.garmentGradient}
                  >
                    <MaterialCommunityIcons
                      name={garment.icon as any}
                      size={40}
                      color="#fff"
                    />
                    <Text color="#fff" fontSize={12} marginTop={8}>{garment.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </Stack>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => { setShowGarmentSelector(false); }}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>
    </Stack>
  );
};

const styles = StyleSheet.create({
  permissionButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  webVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeArMode: {
    backgroundColor: '#6C63FF',
  },
  focusContainer: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: '40%',
  },
  focusCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#6C63FF',
  },
  focusCornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  focusCornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  focusCornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  focusText: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  recordingIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementGrid: {
    position: 'absolute',
    width: 200,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#4ECDC4',
    opacity: 0.5,
  },
  measurementText: {
    position: 'absolute',
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  garmentOption: {
    width: '30%',
    marginBottom: 15,
  },
  garmentGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#2A2A3E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ARViewScreen;
