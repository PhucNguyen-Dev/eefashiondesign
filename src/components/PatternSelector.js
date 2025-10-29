import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Rect, Line, Path, Pattern, Defs, G } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PatternSelector = ({ selectedPattern, onPatternSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('geometric');

  const patterns = {
    geometric: [
      { id: 'stripes', name: 'Stripes', type: 'lines' },
      { id: 'dots', name: 'Polka Dots', type: 'circles' },
      { id: 'checkers', name: 'Checkers', type: 'squares' },
      { id: 'zigzag', name: 'Zigzag', type: 'zigzag' },
      { id: 'diamonds', name: 'Diamonds', type: 'diamonds' },
    ],
    floral: [
      { id: 'roses', name: 'Roses', type: 'floral' },
      { id: 'leaves', name: 'Leaves', type: 'leaves' },
      { id: 'vines', name: 'Vines', type: 'vines' },
      { id: 'tropical', name: 'Tropical', type: 'tropical' },
    ],
    abstract: [
      { id: 'watercolor', name: 'Watercolor', type: 'watercolor' },
      { id: 'marble', name: 'Marble', type: 'marble' },
      { id: 'gradient', name: 'Gradient', type: 'gradient' },
      { id: 'splatter', name: 'Splatter', type: 'splatter' },
    ],
  };

  const renderPattern = (pattern) => {
    const size = 80;
    
    switch (pattern.type) {
      case 'lines':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="stripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <Line x1="0" y1="0" x2="0" y2="10" stroke="#6C63FF" strokeWidth="2" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#stripes)" />
          </Svg>
        );
      case 'circles':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Circle cx="10" cy="10" r="3" fill="#FF6B6B" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#dots)" />
          </Svg>
        );
      case 'squares':
        return (
          <Svg width={size} height={size}>
            <Defs>
              <Pattern id="checkers" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <Rect x="0" y="0" width="10" height="10" fill="#4ECDC4" />
                <Rect x="10" y="10" width="10" height="10" fill="#4ECDC4" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={size} height={size} fill="url(#checkers)" />
          </Svg>
        );
      case 'zigzag':
        return (
          <Svg width={size} height={size}>
            <Path
              d="M0,20 L10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,40 L10,30 L20,40 L30,30 L40,40 L50,30 L60,40 L70,30 L80,40"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M0,60 L10,50 L20,60 L30,50 L40,60 L50,50 L60,60 L70,50 L80,60"
              stroke="#FFD93D"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        );
      default:
        return (
          <View style={[styles.patternPlaceholder, { backgroundColor: '#6C63FF' }]}>
            <MaterialCommunityIcons name="texture" size={40} color="#fff" />
          </View>
        );
    }
  };

  const PatternCard = ({ pattern }) => {
    const isSelected = selectedPattern?.id === pattern.id;

    return (
      <TouchableOpacity
        style={[styles.patternCard, isSelected && styles.selectedCard]}
        onPress={() => onPatternSelect(pattern)}
      >
        <View style={styles.patternPreview}>
          {renderPattern(pattern)}
        </View>
        <Text style={styles.patternName}>{pattern.name}</Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#6C63FF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'geometric' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('geometric')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'geometric' && styles.activeCategoryTabText]}>
            Geometric
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'floral' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('floral')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'floral' && styles.activeCategoryTabText]}>
            Floral
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'abstract' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('abstract')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'abstract' && styles.activeCategoryTabText]}>
            Abstract
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pattern Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.patternGrid}>
          {patterns[selectedCategory].map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </View>
      </ScrollView>

      {/* Pattern Options */}
      {selectedPattern && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Pattern Options</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Scale</Text>
            <View style={styles.scaleButtons}>
              <TouchableOpacity style={styles.scaleButton}>
                <MaterialCommunityIcons name="minus" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.scaleValue}>100%</Text>
              <TouchableOpacity style={styles.scaleButton}>
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Rotation</Text>
            <View style={styles.rotationButtons}>
              <TouchableOpacity style={styles.rotationButton}>
                <Text style={styles.rotationText}>0°</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rotationButton}>
                <Text style={styles.rotationText}>45°</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rotationButton}>
                <Text style={styles.rotationText}>90°</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 400,
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#2A2A3E',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  activeCategoryTab: {
    backgroundColor: '#6C63FF',
  },
  categoryTabText: {
    color: '#888',
    fontSize: 14,
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  patternCard: {
    width: (width - 80) / 3,
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2A2A3E',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6C63FF',
  },
  patternPreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  patternPlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  patternName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  optionsContainer: {
    backgroundColor: '#2A2A3E',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    color: '#888',
    fontSize: 14,
  },
  scaleButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scaleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleValue: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 15,
  },
  rotationButtons: {
    flexDirection: 'row',
  },
  rotationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    borderRadius: 10,
    marginLeft: 10,
  },
  rotationText: {
    color: '#6C63FF',
    fontSize: 12,
  },
});

export default PatternSelector;
