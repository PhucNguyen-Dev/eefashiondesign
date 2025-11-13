import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { styled, Stack } from '@tamagui/core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Define XStack
const XStack = styled(Stack, { flexDirection: 'row' });

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface Tool {
  id: string;
  icon: string;
  name: string;
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

const Container = styled(XStack, {
  backgroundColor: '$bgCard',
  paddingVertical: '$sm',
  paddingHorizontal: '$md',
  borderRadius: 20,
  alignItems: 'center',
  marginBottom: '$md',
});

const ToolsScroll = styled(ScrollView, {
  flex: 1,
});

const ToolButton = styled(TouchableOpacity, {
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
  } as any,
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

const IconButton = styled(TouchableOpacity, {
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
  } as any,
});

const Toolbar: React.FC<ToolbarProps> = ({ 
  selectedTool, 
  onToolSelect, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo 
}) => {
  const handleToolPress = (toolId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToolSelect(toolId);
  };

  return (
    <Container>
      {/* Main Tools */}
      <ToolsScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            active={selectedTool === tool.id}
            onPress={() => handleToolPress(tool.id)}
            activeOpacity={0.7}
          >
            {selectedTool === tool.id ? (
              <LinearGradient
                colors={['#6C63FF', '#4ECDC4']}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                }}
              >
                <MaterialCommunityIcons name={tool.icon as any} size={24} color="#fff" />
              </LinearGradient>
            ) : (
              <MaterialCommunityIcons
                name={tool.icon as any}
                size={24}
                color="#B0B0C0"
              />
            )}
          </ToolButton>
        ))}
      </ToolsScroll>

      {/* Undo/Redo */}
      <UndoRedoContainer>
        <IconButton
          disabled={!canUndo}
          onPress={onUndo}
        >
          <MaterialCommunityIcons
            name="undo"
            size={24}
            color={canUndo ? '#FFFFFF' : '#666677'}
          />
        </IconButton>

        <IconButton
          disabled={!canRedo}
          onPress={onRedo}
        >
          <MaterialCommunityIcons
            name="redo"
            size={24}
            color={canRedo ? '#FFFFFF' : '#666677'}
          />
        </IconButton>
      </UndoRedoContainer>
    </Container>
  );
};

export default Toolbar;
