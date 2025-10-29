import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING } from '../../config/constants';

const tools = [
  { id: 'select', icon: 'cursor-default', name: 'Select' },
  { id: 'pen', icon: 'pen', name: 'Pen' },
  { id: 'brush', icon: 'brush', name: 'Brush' },
  { id: 'eraser', icon: 'eraser', name: 'Eraser' },
  { id: 'text', icon: 'format-text', name: 'Text' },
  { id: 'shapes', icon: 'shape', name: 'Shapes' },
  { id: 'line', icon: 'vector-line', name: 'Line' },
  { id: 'fill', icon: 'format-color-fill', name: 'Fill' },
];

const Toolbar = ({ selectedTool, onToolSelect, onUndo, onRedo, canUndo, canRedo }) => {
  const handleToolPress = (toolId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToolSelect(toolId);
  };

  return (
    <View style={styles.container}>
      {/* Main Tools */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.toolsScroll}
        contentContainerStyle={styles.toolsContainer}
      >
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolButton,
              selectedTool === tool.id && styles.toolButtonActive,
            ]}
            onPress={() => handleToolPress(tool.id)}
            activeOpacity={0.7}
          >
            {selectedTool === tool.id ? (
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.toolButtonGradient}
              >
                <MaterialCommunityIcons name={tool.icon} size={24} color="#fff" />
              </LinearGradient>
            ) : (
              <MaterialCommunityIcons
                name={tool.icon}
                size={24}
                color={COLORS.textSecondary}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Undo/Redo */}
      <View style={styles.undoRedoContainer}>
        <TouchableOpacity
          style={[styles.iconButton, !canUndo && styles.iconButtonDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <MaterialCommunityIcons
            name="undo"
            size={24}
            color={canUndo ? COLORS.textPrimary : COLORS.textTertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, !canRedo && styles.iconButtonDisabled]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <MaterialCommunityIcons
            name="redo"
            size={24}
            color={canRedo ? COLORS.textPrimary : COLORS.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  toolsScroll: {
    flex: 1,
  },
  toolsContainer: {
    alignItems: 'center',
  },
  toolButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderRadius: 12,
  },
  toolButtonActive: {
    overflow: 'hidden',
  },
  toolButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  undoRedoContainer: {
    flexDirection: 'row',
    marginLeft: SPACING.md,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingLeft: SPACING.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  iconButtonDisabled: {
    opacity: 0.3,
  },
});

export default Toolbar;
