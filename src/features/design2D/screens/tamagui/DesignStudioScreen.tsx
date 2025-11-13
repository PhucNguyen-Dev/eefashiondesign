import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Modal,
  TextInput,
  FlatList,
  Alert,
  View as RNView,
} from 'react-native';
import { Stack, Text } from '@tamagui/core';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Polygon, Line } from 'react-native-svg';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from '@expo/vector-icons';
import ColorPicker from '../../../../components/ColorPicker.js';
import FabricSelector from '../../../../components/FabricSelector.js';
import PatternSelector from '../../../../components/PatternSelector.js';
import DesignTips from '../../../../components/DesignTips.js';

// Import new features
import { useDesignStore } from '@state/appStore';
import exportService from '../../../../services/exportService.js';
import autoSaveService from '../../../../services/autoSaveService.js';
import useKeyboardShortcuts, { COMMON_SHORTCUTS } from '../../../../hooks/useKeyboardShortcuts';

// Import types
import type {
  ToolName,
  ShapeName,
  Tool,
  Shape,
  DrawingPoint,
  DrawingPath,
  Layer,
  DesignElement,
  DesignData,
  CanvasMode,
  DrawingToolProps,
  LayerItemProps,
  DesignElementProps,
  DesignStudioScreenProps,
} from './types';

const { width, height } = Dimensions.get('window');
const CANVAS_WIDTH = width - 40;
const CANVAS_HEIGHT = height * 0.5;

// Drawing Tool Component
const DrawingTool: React.FC<DrawingToolProps> = ({ icon, name, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, scaleAnim, rotateAnim]);

  const handlePress = (): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(name);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.tool,
          isActive && styles.activeTool,
          {
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        {icon}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Layer Component
const LayerItem: React.FC<LayerItemProps> = ({ layer, index, isActive, onSelect, onToggleVisibility, onDelete }) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, slideAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.layerItem,
        isActive && styles.activeLayer,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity onPress={() => { onSelect(layer.id); }} style={styles.layerContent}>
        <Stack flexDirection="row" alignItems="center">
          <Stack width={20} height={20} borderRadius={10} marginRight={10} backgroundColor={layer.color} />
          <Text color="#fff" fontSize={14}>{layer.name}</Text>
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => { onToggleVisibility(layer.id); }}>
            <Ionicons
              name={layer.visible ? 'eye' : 'eye-off'}
              size={20}
              color={layer.visible ? '#6C63FF' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onDelete(layer.id); }} style={{ marginLeft: 15 }}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </Stack>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Design Element Component (for shapes, patterns, etc.)
const DesignElementComponent: React.FC<DesignElementProps> = ({ element, onUpdate, onDelete }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scale, {
          toValue: 1.1,
          friction: 4,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: false,
        }).start();
        
        // Update element position
        pan.flattenOffset();
        onUpdate(element.id, {
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
    })
  ).current;

  const renderElement = (): JSX.Element | null => {
    switch (element.type) {
      case 'circle':
        return (
          <Svg width={element.size || 100} height={element.size || 100}>
            <Circle
              cx={(element.size || 100) / 2}
              cy={(element.size || 100) / 2}
              r={(element.size || 100) / 2}
              fill={element.color}
              stroke={element.strokeColor || '#000'}
              strokeWidth={element.strokeWidth || 2}
            />
          </Svg>
        );
      case 'rect':
        return (
          <Svg width={element.width || 100} height={element.height || 100}>
            <Rect
              x={0}
              y={0}
              width={element.width || 100}
              height={element.height || 100}
              fill={element.color}
              stroke={element.strokeColor || '#000'}
              strokeWidth={element.strokeWidth || 2}
            />
          </Svg>
        );
      case 'triangle':
        return (
          <Svg width={element.size || 100} height={element.size || 100}>
            <Polygon
              points={`${(element.size || 100) / 2},0 ${element.size || 100},${element.size || 100} 0,${element.size || 100}`}
              fill={element.color}
              stroke={element.strokeColor || '#000'}
              strokeWidth={element.strokeWidth || 2}
            />
          </Svg>
        );
      case 'text':
        return (
          <Text style={[styles.designText, { color: element.color, fontSize: element.fontSize || 24 }]}>
            {element.text || ''}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.designElement,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale },
            { rotate: rotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            })},
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {renderElement()}
      <TouchableOpacity
        style={styles.elementDelete}
        onPress={() => { onDelete(element.id); }}
      >
        <Ionicons name="close-circle" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const DesignStudioScreen: React.FC<DesignStudioScreenProps> = ({ navigation }) => {
  const [activeTool, setActiveTool] = useState<ToolName>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#6C63FF');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showFabricSelector, setShowFabricSelector] = useState<boolean>(false);
  const [showPatternSelector, setShowPatternSelector] = useState<boolean>(false);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [showDesignTips, setShowDesignTips] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Base Layer', color: '#fff', visible: true },
  ]);
  const [activeLayer, setActiveLayer] = useState<string>('1');
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('2D');
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const canvasRef = useRef<RNView>(null);
  const viewRef = useRef<RNView>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Undo/Redo functionality
  const designStore = useDesignStore();
  const { undo, redo, canUndo, canRedo, saveToHistory } = designStore;

  const handleUndo = (): void => {
    if (canUndo()) {
      undo();
      const currentState = designStore.currentDesign;
      if (currentState) {
        setDesignElements((currentState as unknown as DesignData).designElements || []);
        setPaths((currentState as unknown as DesignData).paths || []);
        setLayers((currentState as unknown as DesignData).layers || []);
      }
    }
  };

  const handleRedo = (): void => {
    if (canRedo()) {
      redo();
      const currentState = designStore.currentDesign;
      if (currentState) {
        setDesignElements((currentState as unknown as DesignData).designElements || []);
        setPaths((currentState as unknown as DesignData).paths || []);
        setLayers((currentState as unknown as DesignData).layers || []);
      }
    }
  };

  const handleManualSave = async (): Promise<void> => {
    try {
      const designId = 'current-design';
      await autoSaveService.saveVersion(designId, designStateRef.current, designStore);
      Alert.alert('Success', 'Design saved successfully!');
    } catch (error) {
      console.error('Failed to save design:', error);
      Alert.alert('Error', 'Failed to save design');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [COMMON_SHORTCUTS.UNDO]: handleUndo,
    [COMMON_SHORTCUTS.REDO_WINDOWS]: handleRedo,
    [COMMON_SHORTCUTS.REDO_MAC]: handleRedo,
    [COMMON_SHORTCUTS.SAVE]: handleManualSave,
    [COMMON_SHORTCUTS.TOGGLE_GRID]: () => { setGridVisible(!gridVisible); },
    [COMMON_SHORTCUTS.ESCAPE]: () => {
      setShowColorPicker(false);
      setShowFabricSelector(false);
      setShowPatternSelector(false);
      setShowLayerPanel(false);
      setShowTextInput(false);
      setShowDesignTips(false);
    },
  });

  // Auto-save setup - Use ref to avoid stale closures
  const designStateRef = useRef<DesignData>({
    designElements,
    paths,
    layers,
    activeLayer,
    selectedFabric,
    selectedPattern,
  } as DesignData & { currentColor: string; strokeWidth: number });

  // Update ref when state changes
  useEffect(() => {
    designStateRef.current = {
      designElements,
      paths,
      layers,
      activeLayer,
      selectedFabric,
      selectedPattern,
    } as DesignData & { currentColor: string; strokeWidth: number };
  }, [designElements, paths, layers, activeLayer, selectedFabric, selectedPattern]);

  // Auto-save setup - only run once
  useEffect(() => {
    const designId = 'current-design';
    const getCurrentDesign = (): DesignData => designStateRef.current;

    autoSaveService.start(designId, getCurrentDesign, designStore);

    return () => {
      autoSaveService.stop();
    };
  }, []); // Empty deps - only run once

  // Mark design as dirty when changes occur - use ref to prevent infinite loop
  const prevDesignRef = useRef<string>();
  useEffect(() => {
    const currentDesign = JSON.stringify({ designElements, paths, layers });
    if (prevDesignRef.current !== currentDesign) {
      autoSaveService.markDirty();
      // Only save to history if there's an actual change
      if (prevDesignRef.current !== undefined) {
        saveToHistory({
          designElements,
          paths,
          layers,
        });
      }
      prevDesignRef.current = currentDesign;
    }
  }, [designElements, paths, layers, saveToHistory]);

  const tools: Tool[] = [
    { name: 'pen', icon: <MaterialCommunityIcons name="pen" size={24} color="#fff" /> },
    { name: 'brush', icon: <MaterialCommunityIcons name="brush" size={24} color="#fff" /> },
    { name: 'eraser', icon: <MaterialCommunityIcons name="eraser" size={24} color="#fff" /> },
    { name: 'shape', icon: <MaterialCommunityIcons name="shape" size={24} color="#fff" /> },
    { name: 'text', icon: <MaterialCommunityIcons name="format-text" size={24} color="#fff" /> },
    { name: 'ruler', icon: <MaterialCommunityIcons name="ruler" size={24} color="#fff" /> },
    { name: 'move', icon: <MaterialCommunityIcons name="cursor-move" size={24} color="#fff" /> },
    { name: 'zoom', icon: <MaterialCommunityIcons name="magnify" size={24} color="#fff" /> },
  ];

  const shapes: Shape[] = [
    { name: 'circle', icon: <MaterialCommunityIcons name="circle-outline" size={30} color="#fff" /> },
    { name: 'rect', icon: <MaterialCommunityIcons name="square-outline" size={30} color="#fff" /> },
    { name: 'triangle', icon: <MaterialCommunityIcons name="triangle-outline" size={30} color="#fff" /> },
    { name: 'line', icon: <MaterialCommunityIcons name="minus" size={30} color="#fff" /> },
  ];

  const handleToolSelect = (toolName: ToolName): void => {
    setActiveTool(toolName);
    if (toolName === 'text') {
      setShowTextInput(true);
    }
    if (toolName === 'shape') {
      // Show shape selector
    }
  };

  const handleCanvasTouch = (event: { nativeEvent: { locationX: number; locationY: number } }): void => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (activeTool === 'pen' || activeTool === 'brush') {
      if (isDrawing) {
        setCurrentPath([...currentPath, { x: locationX, y: locationY }]);
      } else {
        setIsDrawing(true);
        setCurrentPath([{ x: locationX, y: locationY }]);
      }
    }
  };

  const handleCanvasTouchEnd = (): void => {
    if (isDrawing && currentPath.length > 0) {
      setPaths([...paths, { points: currentPath, color: currentColor, width: strokeWidth }]);
      setCurrentPath([]);
      setIsDrawing(false);
    }
  };

  const addShape = (shapeType: ShapeName): void => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: shapeType === 'line' ? 'rect' : shapeType,
      x: CANVAS_WIDTH / 2 - 50,
      y: CANVAS_HEIGHT / 2 - 50,
      size: 100,
      width: 100,
      height: 100,
      color: currentColor,
      strokeColor: '#000',
      strokeWidth: 2,
      rotation: 0,
    };
    setDesignElements([...designElements, newElement]);
  };

  const addText = (): void => {
    if (textInput.trim()) {
      const newElement: DesignElement = {
        id: Date.now().toString(),
        type: 'text',
        text: textInput,
        x: CANVAS_WIDTH / 2 - 50,
        y: CANVAS_HEIGHT / 2,
        color: currentColor,
        fontSize: 24,
      };
      setDesignElements([...designElements, newElement]);
      setTextInput('');
      setShowTextInput(false);
    }
  };

  const updateElement = (id: string, updates: Partial<DesignElement>): void => {
    setDesignElements(designElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string): void => {
    setDesignElements(designElements.filter(el => el.id !== id));
  };

  const addLayer = (): void => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length + 1}`,
      color: currentColor,
      visible: true,
    };
    setLayers([...layers, newLayer]);
  };

  const toggleLayerVisibility = (layerId: string): void => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const deleteLayer = (layerId: string): void => {
    if (layers.length > 1) {
      setLayers(layers.filter(layer => layer.id !== layerId));
      if (activeLayer === layerId) {
        setActiveLayer(layers[0].id);
      }
    } else {
      Alert.alert('Cannot Delete', 'You must have at least one layer');
    }
  };

  const saveDesign = (): void => {
    // Trigger auto-save immediately
    void autoSaveService.save();
    Alert.alert('Success', 'Design saved successfully!');
  };

  const exportDesign = (): void => {
    Alert.alert('Export Design', 'Choose export format', [
      {
        text: 'PNG',
        onPress: () => {
          void (async () => {
            try {
              const fileUri = await exportService.exportAsPNG(viewRef, `design_${Date.now()}.png`);
              if (fileUri) {
                Alert.alert('Success', 'Exported as PNG!');
              }
            } catch (error) {
              Alert.alert('Error', (error as Error).message || 'Failed to export PNG');
            }
          })();
        }
      },
      {
        text: 'SVG',
        onPress: () => {
          void (async () => {
            try {
              const designData = { designElements, paths };
              const fileUri = await exportService.exportAsSVG(designData as any, `design_${Date.now()}.svg`);
              if (fileUri) {
                Alert.alert('Success', 'Exported as SVG!');
              }
            } catch (error) {
              Alert.alert('Error', (error as Error).message || 'Failed to export SVG');
            }
          })();
        }
      },
      {
        text: 'PDF',
        onPress: () => {
          void (async () => {
            try {
              const fileUri = await exportService.exportAsPDF(viewRef, `design_${Date.now()}.pdf`);
              if (fileUri) {
                Alert.alert('Success', 'Exported as PDF!');
              }
            } catch (error) {
              Alert.alert('Error', (error as Error).message || 'Failed to export PDF');
            }
          })();
        }
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const toggle3DView = (): void => {
    setCanvasMode(canvasMode === '2D' ? '3D' : '2D');
    if (canvasMode === '2D') {
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderCanvas = (): JSX.Element => {
    const canvasRotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '15deg'],
    });

    return (
      <Animated.View
        style={[
          styles.canvas,
          {
            transform: [
              { scale: scaleAnim },
              { perspective: 1000 },
              { rotateY: canvasRotation },
            ],
          },
        ]}
        ref={canvasRef}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={handleCanvasTouch}
        onResponderRelease={handleCanvasTouchEnd}
      >
        <LinearGradient
          colors={['#ffffff', '#f8f8f8']}
          style={styles.canvasBackground}
        >
          {/* Grid */}
          {gridVisible && (
            <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={StyleSheet.absoluteFill}>
              {Array.from({ length: Math.floor(CANVAS_WIDTH / 20) }).map((_, i) => (
                <Line
                  key={`vertical-line-${i * 20}`}
                  x1={i * 20}
                  y1={0}
                  x2={i * 20}
                  y2={CANVAS_HEIGHT}
                  stroke="#e0e0e0"
                  strokeWidth={0.5}
                />
              ))}
              {Array.from({ length: Math.floor(CANVAS_HEIGHT / 20) }).map((_, i) => (
                <Line
                  key={`horizontal-line-${i * 20}`}
                  x1={0}
                  y1={i * 20}
                  x2={CANVAS_WIDTH}
                  y2={i * 20}
                  stroke="#e0e0e0"
                  strokeWidth={0.5}
                />
              ))}
            </Svg>
          )}

          {/* Fabric/Pattern Background */}
          {selectedFabric && (
            <Stack position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.3}>
              {/* Render fabric texture */}
            </Stack>
          )}

          {/* Drawing Paths */}
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={StyleSheet.absoluteFill}>
            {paths.map((path, index) => {
              const pathString = 'M' + path.points.map(p => p.x + ',' + p.y).join(' L');
              const pathKey = `drawing-path-${index}-${path.points.length}`;
              return (
                <Path
                  key={pathKey}
                  d={pathString}
                  stroke={path.color}
                  strokeWidth={path.width}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            {currentPath.length > 0 && (() => {
              const pathString = 'M' + currentPath.map(p => p.x + ',' + p.y).join(' L');
              return (
                <Path
                  d={pathString}
                  stroke={currentColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })()}
          </Svg>

          {/* Design Elements */}
          {designElements.map(element => (
            <DesignElementComponent
              key={element.id}
              element={element}
              onUpdate={updateElement}
              onDelete={deleteElement}
            />
          ))}
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <Stack flex={1} backgroundColor="#0F0F1E">
      {/* Top Toolbar */}
      <Stack backgroundColor="#1A1A2E" paddingVertical={10} paddingHorizontal={10} borderBottomWidth={1} borderBottomColor="#2A2A3E">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.toolbarButton, !canUndo() && styles.toolbarButtonDisabled]} 
            onPress={handleUndo}
            disabled={!canUndo()}
          >
            <Ionicons name="arrow-undo" size={20} color={canUndo() ? "#fff" : "#666"} />
            <Text style={[styles.toolbarButtonText, !canUndo() && styles.toolbarButtonTextDisabled]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, !canRedo() && styles.toolbarButtonDisabled]} 
            onPress={handleRedo}
            disabled={!canRedo()}
          >
            <Ionicons name="arrow-redo" size={20} color={canRedo() ? "#fff" : "#666"} />
            <Text style={[styles.toolbarButtonText, !canRedo() && styles.toolbarButtonTextDisabled]}>Redo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={saveDesign}>
            <Feather name="save" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton} 
            onPress={() => { setShowDesignTips(true); }}
          >
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FFD93D" />
            <Text style={styles.toolbarButtonText}>Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={exportDesign}>
            <Feather name="download" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => { setShowLayerPanel(true); }}>
            <MaterialCommunityIcons name="layers" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Layers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={toggle3DView}>
            <MaterialCommunityIcons name="cube-outline" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>{canvasMode}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => { setGridVisible(!gridVisible); }}>
            <MaterialCommunityIcons name="grid" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Grid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => { setShowFabricSelector(true); }}>
            <MaterialCommunityIcons name="texture" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Fabric</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => { setShowPatternSelector(true); }}>
            <MaterialCommunityIcons name="dots-grid" size={20} color="#fff" />
            <Text style={styles.toolbarButtonText}>Pattern</Text>
          </TouchableOpacity>
        </ScrollView>
      </Stack>

      {/* Canvas Area */}
      <RNView ref={viewRef} collapsable={false} style={styles.canvasWrapper}>
        <ScrollView style={styles.canvasContainer}>
          {renderCanvas()}
        </ScrollView>
      </RNView>

      {/* Tools Panel */}
      <Stack backgroundColor="#1A1A2E" paddingVertical={15} paddingHorizontal={10} borderTopWidth={1} borderTopColor="#2A2A3E">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tools.map((tool) => (
            <DrawingTool
              key={tool.name}
              icon={tool.icon}
              name={tool.name}
              isActive={activeTool === tool.name}
              onPress={handleToolSelect}
            />
          ))}
        </ScrollView>
      </Stack>

      {/* Bottom Controls */}
      <Stack flexDirection="row" alignItems="center" backgroundColor="#1A1A2E" paddingVertical={15} paddingHorizontal={20} borderTopWidth={1} borderTopColor="#2A2A3E">
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: currentColor }]}
          onPress={() => { setShowColorPicker(true); }}
        >
          <Text style={styles.colorButtonText}>Color</Text>
        </TouchableOpacity>
        
        <Stack flexDirection="row" alignItems="center" backgroundColor="#2A2A3E" paddingHorizontal={15} paddingVertical={8} borderRadius={20}>
          <Text color="#fff" marginRight={10} fontSize={12}>Stroke:</Text>
          <TouchableOpacity onPress={() => { setStrokeWidth(Math.max(1, strokeWidth - 1)); }}>
            <AntDesign name="minus" size={20} color="#fff" />
          </TouchableOpacity>
          <Text color="#fff" marginHorizontal={10} fontSize={14} fontWeight="bold">{strokeWidth}px</Text>
          <TouchableOpacity onPress={() => { setStrokeWidth(Math.min(20, strokeWidth + 1)); }}>
            <AntDesign name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </Stack>

        {activeTool === 'shape' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shapesPanel}>
            {shapes.map((shape) => (
              <TouchableOpacity
                key={shape.name}
                style={styles.shapeButton}
                onPress={() => { addShape(shape.name); }}
              >
                {shape.icon}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Stack>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowColorPicker(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <Text fontSize={20} fontWeight="bold" color="#fff" marginBottom={20}>Choose Color</Text>
            <ColorPicker
              currentColor={currentColor}
              onColorChange={setCurrentColor}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { setShowColorPicker(false); }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>

      {/* Fabric Selector Modal */}
      <Modal
        visible={showFabricSelector}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowFabricSelector(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <Text fontSize={20} fontWeight="bold" color="#fff" marginBottom={20}>Choose Fabric</Text>
            <FabricSelector
              selectedFabric={selectedFabric}
              onFabricSelect={(fabric: string) => {
                setSelectedFabric(fabric);
                setShowFabricSelector(false);
              }}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { setShowFabricSelector(false); }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>

      {/* Pattern Selector Modal */}
      <Modal
        visible={showPatternSelector}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowPatternSelector(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <Text fontSize={20} fontWeight="bold" color="#fff" marginBottom={20}>Choose Pattern</Text>
            <PatternSelector
              selectedPattern={selectedPattern}
              onPatternSelect={(pattern: string) => {
                setSelectedPattern(pattern);
                setShowPatternSelector(false);
              }}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { setShowPatternSelector(false); }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>

      {/* Layer Panel Modal */}
      <Modal
        visible={showLayerPanel}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowLayerPanel(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={20}>
              <Text fontSize={20} fontWeight="bold" color="#fff">Layers</Text>
              <TouchableOpacity onPress={addLayer}>
                <Ionicons name="add-circle" size={30} color="#6C63FF" />
              </TouchableOpacity>
            </Stack>
            <FlatList
              data={layers}
              renderItem={({ item, index }) => (
                <LayerItem
                  layer={item}
                  index={index}
                  isActive={activeLayer === item.id}
                  onSelect={setActiveLayer}
                  onToggleVisibility={toggleLayerVisibility}
                  onDelete={deleteLayer}
                />
              )}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { setShowLayerPanel(false); }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </Stack>
        </BlurView>
      </Modal>

      {/* Text Input Modal */}
      <Modal
        visible={showTextInput}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowTextInput(false); }}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Stack backgroundColor="#1A1A2E" borderRadius={20} padding={20} width={width * 0.9} maxHeight={height * 0.8}>
            <Text fontSize={20} fontWeight="bold" color="#fff" marginBottom={20}>Add Text</Text>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Enter text..."
              placeholderTextColor="#666"
              multiline
            />
            <Stack flexDirection="row" marginTop={20}>
              <TouchableOpacity
                style={[styles.modalButton, { flex: 1, marginRight: 10 }]}
                onPress={() => { setShowTextInput(false); }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { flex: 1, backgroundColor: '#6C63FF' }]}
                onPress={addText}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </Stack>
          </Stack>
        </BlurView>
      </Modal>

      {/* Design Tips Modal */}
      <DesignTips
        visible={showDesignTips}
        onClose={() => { setShowDesignTips(false); }}
        context="general"
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#2A2A3E',
    borderRadius: 20,
    marginRight: 10,
  },
  toolbarButtonDisabled: {
    opacity: 0.4,
  },
  toolbarButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  toolbarButtonTextDisabled: {
    color: '#666',
  },
  canvasWrapper: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    padding: 20,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  canvasBackground: {
    flex: 1,
    position: 'relative',
  },
  tool: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTool: {
    backgroundColor: '#6C63FF',
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  colorButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  shapesPanel: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  shapeButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2A2A3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  designElement: {
    position: 'absolute',
  },
  elementDelete: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  designText: {
    fontWeight: 'bold',
  },
  layerItem: {
    backgroundColor: '#2A2A3E',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  activeLayer: {
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  layerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#2A2A3E',
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
  textInput: {
    backgroundColor: '#2A2A3E',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default DesignStudioScreen;
