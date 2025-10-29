import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FabricSelector = ({ selectedFabric, onFabricSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('natural');

  const fabricCategories = {
    natural: [
      {
        id: 'cotton',
        name: 'Cotton',
        icon: 'flower',
        description: 'Breathable and comfortable',
        properties: ['Breathable', 'Soft', 'Durable'],
        colors: ['#FFFFFF', '#F5F5DC'],
      },
      {
        id: 'silk',
        name: 'Silk',
        icon: 'shimmer',
        description: 'Luxurious and smooth',
        properties: ['Smooth', 'Lustrous', 'Lightweight'],
        colors: ['#FFE4E1', '#FFF0F5'],
      },
      {
        id: 'wool',
        name: 'Wool',
        icon: 'sheep',
        description: 'Warm and insulating',
        properties: ['Warm', 'Elastic', 'Water-resistant'],
        colors: ['#D3D3D3', '#A9A9A9'],
      },
      {
        id: 'linen',
        name: 'Linen',
        icon: 'leaf',
        description: 'Cool and crisp',
        properties: ['Cool', 'Strong', 'Absorbent'],
        colors: ['#FAF0E6', '#F5DEB3'],
      },
    ],
    synthetic: [
      {
        id: 'polyester',
        name: 'Polyester',
        icon: 'chemical-weapon',
        description: 'Durable and wrinkle-resistant',
        properties: ['Durable', 'Quick-dry', 'Wrinkle-resistant'],
        colors: ['#E6E6FA', '#DDA0DD'],
      },
      {
        id: 'nylon',
        name: 'Nylon',
        icon: 'molecule',
        description: 'Strong and elastic',
        properties: ['Strong', 'Elastic', 'Lightweight'],
        colors: ['#B0C4DE', '#87CEEB'],
      },
      {
        id: 'spandex',
        name: 'Spandex',
        icon: 'stretch-to-page',
        description: 'Stretchy and flexible',
        properties: ['Stretchy', 'Form-fitting', 'Comfortable'],
        colors: ['#FFB6C1', '#FFC0CB'],
      },
    ],
    special: [
      {
        id: 'denim',
        name: 'Denim',
        icon: 'texture-box',
        description: 'Sturdy cotton twill',
        properties: ['Durable', 'Versatile', 'Classic'],
        colors: ['#4169E1', '#191970'],
      },
      {
        id: 'leather',
        name: 'Leather',
        icon: 'cow',
        description: 'Durable and stylish',
        properties: ['Durable', 'Water-resistant', 'Luxurious'],
        colors: ['#8B4513', '#654321'],
      },
      {
        id: 'velvet',
        name: 'Velvet',
        icon: 'diamond-stone',
        description: 'Soft and luxurious',
        properties: ['Soft', 'Rich texture', 'Elegant'],
        colors: ['#8B008B', '#4B0082'],
      },
    ],
  };

  const FabricCard = ({ fabric }) => {
    const isSelected = selectedFabric?.id === fabric.id;

    return (
      <TouchableOpacity
        style={[styles.fabricCard, isSelected && styles.selectedCard]}
        onPress={() => onFabricSelect(fabric)}
      >
        <LinearGradient
          colors={fabric.colors}
          style={styles.fabricGradient}
        >
          <View style={styles.fabricIconContainer}>
            <MaterialCommunityIcons
              name={fabric.icon}
              size={40}
              color="#fff"
            />
          </View>
        </LinearGradient>
        <View style={styles.fabricInfo}>
          <Text style={styles.fabricName}>{fabric.name}</Text>
          <Text style={styles.fabricDescription}>{fabric.description}</Text>
          <View style={styles.fabricProperties}>
            {fabric.properties.map((prop, index) => (
              <View key={index} style={styles.propertyBadge}>
                <Text style={styles.propertyText}>{prop}</Text>
              </View>
            ))}
          </View>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#6C63FF" />
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
          style={[styles.categoryTab, selectedCategory === 'natural' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('natural')}
        >
          <MaterialCommunityIcons
            name="leaf"
            size={20}
            color={selectedCategory === 'natural' ? '#fff' : '#888'}
          />
          <Text style={[styles.categoryTabText, selectedCategory === 'natural' && styles.activeCategoryTabText]}>
            Natural
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'synthetic' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('synthetic')}
        >
          <MaterialCommunityIcons
            name="chemical-weapon"
            size={20}
            color={selectedCategory === 'synthetic' ? '#fff' : '#888'}
          />
          <Text style={[styles.categoryTabText, selectedCategory === 'synthetic' && styles.activeCategoryTabText]}>
            Synthetic
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'special' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('special')}
        >
          <MaterialCommunityIcons
            name="star"
            size={20}
            color={selectedCategory === 'special' ? '#fff' : '#888'}
          />
          <Text style={[styles.categoryTabText, selectedCategory === 'special' && styles.activeCategoryTabText]}>
            Special
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fabric List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {fabricCategories[selectedCategory].map((fabric) => (
          <FabricCard key={fabric.id} fabric={fabric} />
        ))}
      </ScrollView>

      {/* Selected Fabric Details */}
      {selectedFabric && (
        <View style={styles.selectedDetails}>
          <Text style={styles.selectedTitle}>Selected: {selectedFabric.name}</Text>
          <Text style={styles.selectedDescription}>
            Perfect for your design! This fabric offers excellent {selectedFabric.properties[0].toLowerCase()} properties.
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
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
    marginLeft: 5,
  },
  activeCategoryTabText: {
    color: '#fff',
  },
  fabricCard: {
    flexDirection: 'row',
    backgroundColor: '#2A2A3E',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6C63FF',
  },
  fabricGradient: {
    width: 100,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabricIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabricInfo: {
    flex: 1,
    padding: 15,
  },
  fabricName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  fabricDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  fabricProperties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  propertyText: {
    color: '#6C63FF',
    fontSize: 10,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  selectedDetails: {
    backgroundColor: '#2A2A3E',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  selectedDescription: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});

export default FabricSelector;
