import React, { useState } from 'react';
import { Stack, Text, styled } from '@tamagui/core';
import { TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { THEME_COLORS } from '@infrastructure/config/constants';

interface LeftSidebarProps {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedGarment: string;
  setSelectedGarment: (garment: string) => void;
}

const Sidebar = styled(Stack, {
  width: 280,
  backgroundColor: '$bgPrimary',
  borderRightWidth: 1,
  borderRightColor: '$bgTertiary',
});

const Section = styled(Stack, {
  borderBottomWidth: 1,
  borderBottomColor: '$bgTertiary',
});

const SectionHeader = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: 16,
  backgroundColor: '$bgSecondary',
});

const SectionTitle = styled(Text, {
  flex: 1,
  fontSize: 14,
  fontWeight: '600',
  color: '$textPrimary',
});

const SectionContent = styled(Stack, {
  padding: 12,
  gap: 8,
});

const ControlButton = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  backgroundColor: '$bgSecondary',
});

const ControlLabel = styled(Text, {
  fontSize: 14,
  color: '$textPrimary',
});

const GarmentButton = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  backgroundColor: '$bgSecondary',
});

const GarmentIcon = styled(Stack, {
  width: 40,
  height: 40,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
});

const GarmentLabel = styled(Text, {
  flex: 1,
  fontSize: 14,
  color: '$textSecondary',
});

const ToolGrid = styled(Stack, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  padding: 12,
});

const ToolButton = styled(Stack, {
  width: '48%',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 12,
  backgroundColor: '$bgSecondary',
  borderWidth: 2,
  borderColor: 'transparent',
});

const ToolLabel = styled(Text, {
  fontSize: 12,
  color: '$textSecondary',
  textAlign: 'center',
});

const AdvancedToolButton = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: 8,
  backgroundColor: '$bgSecondary',
});

const AdvancedToolLabel = styled(Text, {
  flex: 1,
  fontSize: 14,
  color: '$textPrimary',
});

export const TamaguiLeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedTool,
  setSelectedTool,
  selectedGarment,
  setSelectedGarment,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('tools');

  // View Controls
  const viewControls = [
    { id: 'rotate', icon: 'rotate-3d-variant', label: 'Rotate' },
    { id: 'pan', icon: 'pan', label: 'Pan' },
    { id: 'zoom', icon: 'magnify', label: 'Zoom' },
    { id: 'reset', icon: 'restore', label: 'Reset View' },
  ];

  // Garment Types
  const garmentTypes = [
    { id: 'jumpsuit', icon: 'human-handsup', label: 'Jumpsuit', color: THEME_COLORS.accent.blue },
    { id: 'dress', icon: 'human-female-dance', label: 'Dress', color: THEME_COLORS.accent.purple },
    { id: 'shirt', icon: 'tshirt-crew', label: 'Shirt', color: THEME_COLORS.accent.teal },
    { id: 'pants', icon: 'human-male', label: 'Pants', color: THEME_COLORS.accent.coral },
    { id: 'jacket', icon: 'coat-rack', label: 'Jacket', color: THEME_COLORS.accent.mint },
  ];

  // Design Tools
  const designTools = [
    { id: 'select', icon: 'cursor-default', label: 'Select' },
    { id: 'material', icon: 'palette', label: 'Material' },
    { id: 'pattern', icon: 'texture', label: 'Pattern' },
    { id: 'draw', icon: 'brush', label: 'Draw' },
    { id: 'text', icon: 'format-text', label: 'Text' },
    { id: 'measure', icon: 'ruler', label: 'Measure' },
  ];

  // Advanced Tools
  const advancedTools = [
    { id: 'lighting', icon: 'lightbulb-on', label: 'Lighting' },
    { id: 'seams', icon: 'vector-polyline', label: 'Seams' },
    { id: 'pleating', icon: 'waves', label: 'Pleating' },
    { id: 'uv-map', icon: 'grid', label: 'UV Map' },
    { id: 'pose', icon: 'human-handsdown', label: 'Pose' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Sidebar>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* View Controls Section */}
        <Section>
          <TouchableOpacity onPress={() => toggleSection('view')}>
            <SectionHeader>
              <Ionicons name="eye-outline" size={18} color={THEME_COLORS.text.primary} />
              <SectionTitle>View Controls</SectionTitle>
              <Ionicons
                name={expandedSection === 'view' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={THEME_COLORS.text.secondary}
              />
            </SectionHeader>
          </TouchableOpacity>

          {expandedSection === 'view' && (
            <SectionContent>
              {viewControls.map((control) => (
                <TouchableOpacity key={control.id}>
                  <ControlButton>
                    <MaterialCommunityIcons
                      name={control.icon}
                      size={20}
                      color={THEME_COLORS.text.secondary}
                    />
                    <ControlLabel>{control.label}</ControlLabel>
                  </ControlButton>
                </TouchableOpacity>
              ))}
            </SectionContent>
          )}
        </Section>

        {/* Garment Selector Section */}
        <Section>
          <TouchableOpacity onPress={() => toggleSection('garment')}>
            <SectionHeader>
              <MaterialCommunityIcons name="hanger" size={18} color={THEME_COLORS.text.primary} />
              <SectionTitle>Garment Type</SectionTitle>
              <Ionicons
                name={expandedSection === 'garment' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={THEME_COLORS.text.secondary}
              />
            </SectionHeader>
          </TouchableOpacity>

          {expandedSection === 'garment' && (
            <SectionContent>
              {garmentTypes.map((garment) => (
                <TouchableOpacity
                  key={garment.id}
                  onPress={() => setSelectedGarment(garment.id)}
                >
                  <GarmentButton
                    style={[
                      selectedGarment === garment.id && {
                        backgroundColor: THEME_COLORS.background.tertiary,
                        borderWidth: 1,
                        borderColor: THEME_COLORS.accent.blue + '40',
                      },
                    ]}
                  >
                    <GarmentIcon style={{ backgroundColor: garment.color + '20' }}>
                      <MaterialCommunityIcons
                        name={garment.icon}
                        size={24}
                        color={selectedGarment === garment.id ? garment.color : THEME_COLORS.text.secondary}
                      />
                    </GarmentIcon>
                    <GarmentLabel
                      style={[
                        selectedGarment === garment.id && {
                          color: THEME_COLORS.text.primary,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {garment.label}
                    </GarmentLabel>
                    {selectedGarment === garment.id && (
                      <Ionicons name="checkmark-circle" size={18} color={garment.color} />
                    )}
                  </GarmentButton>
                </TouchableOpacity>
              ))}
            </SectionContent>
          )}
        </Section>

        {/* Design Tools Section */}
        <Section>
          <TouchableOpacity onPress={() => toggleSection('tools')}>
            <SectionHeader>
              <Feather name="tool" size={18} color={THEME_COLORS.text.primary} />
              <SectionTitle>Design Tools</SectionTitle>
              <Ionicons
                name={expandedSection === 'tools' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={THEME_COLORS.text.secondary}
              />
            </SectionHeader>
          </TouchableOpacity>

          {expandedSection === 'tools' && (
            <ToolGrid>
              {designTools.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  onPress={() => setSelectedTool(tool.id)}
                  style={{ width: '48%' }}
                >
                  <ToolButton
                    style={[
                      selectedTool === tool.id && {
                        backgroundColor: THEME_COLORS.accent.blue + '15',
                        borderColor: THEME_COLORS.accent.blue,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={tool.icon}
                      size={22}
                      color={
                        selectedTool === tool.id
                          ? THEME_COLORS.accent.blue
                          : THEME_COLORS.text.secondary
                      }
                    />
                    <ToolLabel
                      style={[
                        selectedTool === tool.id && {
                          color: THEME_COLORS.accent.blue,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {tool.label}
                    </ToolLabel>
                  </ToolButton>
                </TouchableOpacity>
              ))}
            </ToolGrid>
          )}
        </Section>

        {/* Advanced Tools Section */}
        <Section>
          <TouchableOpacity onPress={() => toggleSection('advanced')}>
            <SectionHeader>
              <Ionicons name="options-outline" size={18} color={THEME_COLORS.text.primary} />
              <SectionTitle>Advanced Tools</SectionTitle>
              <Ionicons
                name={expandedSection === 'advanced' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={THEME_COLORS.text.secondary}
              />
            </SectionHeader>
          </TouchableOpacity>

          {expandedSection === 'advanced' && (
            <SectionContent>
              {advancedTools.map((tool) => (
                <TouchableOpacity key={tool.id}>
                  <AdvancedToolButton>
                    <MaterialCommunityIcons
                      name={tool.icon}
                      size={20}
                      color={THEME_COLORS.text.secondary}
                    />
                    <AdvancedToolLabel>{tool.label}</AdvancedToolLabel>
                    <Ionicons name="chevron-forward" size={16} color={THEME_COLORS.text.tertiary} />
                  </AdvancedToolButton>
                </TouchableOpacity>
              ))}
            </SectionContent>
          )}
        </Section>
      </ScrollView>
    </Sidebar>
  );
};

export default TamaguiLeftSidebar;
