import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/constants';

const LayerItem = ({ layer, isSelected, onSelect, onToggleVisibility, onDelete }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(layer.id);
  };

  return (
    <Animated.View
      style={[
        styles.layerItem,
        isSelected && styles.layerItemSelected,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.layerContent}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Layer Icon */}
        <View style={styles.layerIcon}>
          <MaterialCommunityIcons
            name={layer.type === 'text' ? 'format-text' : 'shape'}
            size={20}
            color={isSelected ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        {/* Layer Info */}
        <View style={styles.layerInfo}>
          <Text
            style={[styles.layerName, isSelected && styles.layerNameSelected]}
            numberOfLines={1}
          >
            {layer.name || `Layer ${layer.id}`}
          </Text>
          <Text style={styles.layerType}>{layer.type}</Text>
        </View>

        {/* Actions */}
        <View style={styles.layerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onToggleVisibility(layer.id)}
          >
            <MaterialCommunityIcons
              name={layer.visible ? 'eye' : 'eye-off'}
              size={20}
              color={layer.visible ? COLORS.textSecondary : COLORS.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(layer.id)}
          >
            <MaterialCommunityIcons name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LayerPanel = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
  onReorderLayers,
}) => {
  const renderLayer = ({ item }) => (
    <LayerItem
      layer={item}
      isSelected={item.id === selectedLayerId}
      onSelect={onSelectLayer}
      onToggleVisibility={onToggleVisibility}
      onDelete={onDeleteLayer}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Layers</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={layers}
        renderItem={renderLayer}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="layers-off" size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No layers yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.xs,
  },
  list: {
    flex: 1,
  },
  layerItem: {
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgInput,
    overflow: 'hidden',
  },
  layerItemSelected: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  layerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  layerIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  layerInfo: {
    flex: 1,
  },
  layerName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  layerNameSelected: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  layerType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
    textTransform: 'capitalize',
  },
  layerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
  },
});

export default LayerPanel;
