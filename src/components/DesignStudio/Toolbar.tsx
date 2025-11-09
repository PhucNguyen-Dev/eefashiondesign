import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING } from '../../config/constants';
import { styled } from '@tamagui/core';
import { Stack, XStack } from '../tamagui';

// Styled components using Tamagui
const Container = styled(XStack, {
  backgroundColor: '$bgCard',
  paddingVertical: '$sm',
  paddingHorizontal: '$md',
  borderRadius: 20,
  alignItems: 'center',
  marginBottom: '$md',
});

const ToolsScroll = styled(Stack, {
  flex: 1,
});

const ToolsContainer = styled(XStack, {
  alignItems: 'center',
});

const ToolButton = styled(Stack, {
  width: 48,
  height: 48,
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: '$xs',
  borderRadius: 12,
  variants: {
    active: {
      true: {
        overflow: 'hidden',
      },
    },
  } as const,
});

const ToolButtonGradient = styled(Stack, {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
});

const UndoRedoContainer = styled(XStack, {
  marginLeft: '$md',
  borderLeftWidth: 1,
  borderLeftColor: '$border',
  paddingLeft: '$md',
});

const IconButton = styled(Stack, {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '$xs',
  variants: {
    disabled: {
      true: {
        opacity: 0.3,
      },
    },
  } as const,
});

interface Tool {
  id: string;
  icon: string;
  name: string;
}

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools: Tool[] = [
  { id: 'select', icon: 'cursor-default', name: 'Select' },
  { id: 'pen', icon: 'pen', name: 'Pen' },
  { id: 'brush', icon: 'brush', name: 'Brush' },
  { id: 'eraser', icon: 'eraser', name: 'Eraser' },
  { id: 'text', icon: 'format-text', name: 'Text' },
  { id: 'shapes', icon: 'shape', name: 'Shapes' },
  { id: 'line', icon: 'vector-line', name: 'Line' },
  { id: 'fill', icon: 'format-color-fill', name: 'Fill' },
];

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect, onUndo, onRedo, canUndo, canRedo }) => {
  const handleToolPress = (toolId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToolSelect(toolId);
  };

  return (
    <Container>
      {/* Main Tools */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <ToolsContainer>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => handleToolPress(tool.id)}
              activeOpacity={0.7}
            >
              <ToolButton active={selectedTool === tool.id}>
                {selectedTool === tool.id ? (
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 12,
                    }}
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
              </ToolButton>
            </TouchableOpacity>
          ))}
        </ToolsContainer>
      </ScrollView>

      {/* Undo/Redo */}
      <UndoRedoContainer>
        <TouchableOpacity
          onPress={onUndo}
          disabled={!canUndo}
        >
          <IconButton disabled={!canUndo}>
            <MaterialCommunityIcons
              name="undo"
              size={24}
              color={canUndo ? COLORS.textPrimary : COLORS.textTertiary}
            />
          </IconButton>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRedo}
          disabled={!canRedo}
        >
          <IconButton disabled={!canRedo}>
            <MaterialCommunityIcons
              name="redo"
              size={24}
              color={canRedo ? COLORS.textPrimary : COLORS.textTertiary}
            />
          </IconButton>
        </TouchableOpacity>
      </UndoRedoContainer>
    </Container>
  );
};

export default Toolbar;
