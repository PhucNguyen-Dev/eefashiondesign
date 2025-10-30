import React, { useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Stack, Text, styled } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../core/utils/constants';
import { TamaguiColorPicker } from './ColorPicker';
import { TamaguiPropertySlider } from './PropertySlider';

interface RightSidebarProps {
  viewOrientation: string;
  setViewOrientation: (orientation: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (material: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  materialProps: {
    roughness: number;
    shininess: number;
    thickness: number;
    weight: number;
  };
  setMaterialProps: (props: any) => void;
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
}

const Container = styled(Stack, {
  width: 320,
  backgroundColor: THEME_COLORS.background.primary,
  borderLeftWidth: 1,
  borderLeftColor: THEME_COLORS.background.tertiary,
});

const ScrollContainer = styled(Stack, {
  flex: 1,
});

const Section = styled(Stack, {
  borderBottomWidth: 1,
  borderBottomColor: THEME_COLORS.background.tertiary,
});

const SectionHeader = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: 16,
  backgroundColor: THEME_COLORS.background.secondary,
});

const SectionTitle = styled(Text, {
  flex: 1,
  fontSize: 14,
  fontWeight: '600',
  color: THEME_COLORS.text.primary,
});

const SectionContent = styled(Stack, {
  padding: 16,
});

const OrientationGrid = styled(Stack, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  padding: 12,
});

const OrientationButton = styled(Stack, {
  width: '31%',
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  borderRadius: 12,
  backgroundColor: THEME_COLORS.background.secondary,
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    active: {
      true: {
        backgroundColor: THEME_COLORS.accent.blue + '15',
        borderColor: THEME_COLORS.accent.blue,
      },
    },
  },
});

const OrientationLabel = styled(Text, {
  fontSize: 11,
  color: THEME_COLORS.text.secondary,
  textAlign: 'center',
  variants: {
    active: {
      true: {
        color: THEME_COLORS.accent.blue,
        fontWeight: '600',
      },
    },
  },
});

const MaterialGrid = styled(Stack, {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
});

const MaterialButton = styled(Stack, {
  width: '47%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: 12,
  borderRadius: 10,
  backgroundColor: THEME_COLORS.background.secondary,
  borderWidth: 2,
  borderColor: 'transparent',
  variants: {
    active: {
      true: {
        borderColor: THEME_COLORS.accent.blue,
        backgroundColor: THEME_COLORS.background.tertiary,
      },
    },
  },
});

const MaterialSwatch = styled(Stack, {
  width: 36,
  height: 36,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
});

const MaterialLabel = styled(Text, {
  flex: 1,
  fontSize: 13,
  color: THEME_COLORS.text.secondary,
  variants: {
    active: {
      true: {
        color: THEME_COLORS.text.primary,
        fontWeight: '600',
      },
    },
  },
});

const SimulateButton = styled(Stack, {
  margin: 16,
  borderRadius: 12,
  overflow: 'hidden',
  variants: {
    active: {
      true: {
        transform: [{ scale: 0.98 }],
      },
    },
  },
});

const SimulateGradient = styled(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: 16,
});

const SimulateText = styled(Text, {
  fontSize: 15,
  fontWeight: '700',
  color: '#FFFFFF',
});

export const TamaguiRightSidebar: React.FC<RightSidebarProps> = ({
  viewOrientation,
  setViewOrientation,
  selectedMaterial,
  setSelectedMaterial,
  selectedColor,
  setSelectedColor,
  materialProps,
  setMaterialProps,
  isSimulating,
  setIsSimulating,
}) => {
  const [expandedSection, setExpandedSection] = useState('view');

  // View Orientations
  const viewOrientations = [
    { id: 'front', label: 'Front', icon: 'human-handsup' },
    { id: 'back', label: 'Back', icon: 'human-handsdown' },
    { id: 'left', label: 'Left', icon: 'rotate-left' },
    { id: 'right', label: 'Right', icon: 'rotate-right' },
    { id: 'top', label: 'Top', icon: 'arrow-up-bold' },
    { id: 'walking', label: 'Walking', icon: 'walk' },
  ];

  // Material Types
  const materials = [
    { id: 'denim', label: 'Denim', color: '#4A5568', icon: 'texture' },
    { id: 'cotton', label: 'Cotton', color: '#F7FAFC', icon: 'cloud' },
    { id: 'leather', label: 'Leather', color: '#744210', icon: 'shield' },
    { id: 'silk', label: 'Silk', color: '#FBD38D', icon: 'shimmer' },
    { id: 'wool', label: 'Wool', color: '#CBD5E0', icon: 'sheep' },
    { id: 'linen', label: 'Linen', color: '#EDF2F7', icon: 'leaf' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const updateMaterialProp = (key: string, value: number) => {
    setMaterialProps({ ...materialProps, [key]: value });
  };

  return (
    <Container>
      <ScrollContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* View Orientation Section */}
          <Section>
            <TouchableOpacity onPress={() => toggleSection('view')}>
              <SectionHeader>
                <MaterialCommunityIcons name="rotate-3d-variant" size={18} color={THEME_COLORS.text.primary} />
                <SectionTitle>View Orientation</SectionTitle>
                <Ionicons
                  name={expandedSection === 'view' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={THEME_COLORS.text.secondary}
                />
              </SectionHeader>
            </TouchableOpacity>

            {expandedSection === 'view' && (
              <OrientationGrid>
                {viewOrientations.map((orientation) => (
                  <TouchableOpacity
                    key={orientation.id}
                    onPress={() => setViewOrientation(orientation.id)}
                  >
                    <OrientationButton active={viewOrientation === orientation.id}>
                      <MaterialCommunityIcons
                        name={orientation.icon as any}
                        size={24}
                        color={
                          viewOrientation === orientation.id
                            ? THEME_COLORS.accent.blue
                            : THEME_COLORS.text.secondary
                        }
                      />
                      <OrientationLabel active={viewOrientation === orientation.id}>
                        {orientation.label}
                      </OrientationLabel>
                    </OrientationButton>
                  </TouchableOpacity>
                ))}
              </OrientationGrid>
            )}
          </Section>

          {/* Material Selector Section */}
          <Section>
            <TouchableOpacity onPress={() => toggleSection('material')}>
              <SectionHeader>
                <MaterialCommunityIcons name="palette" size={18} color={THEME_COLORS.text.primary} />
                <SectionTitle>Material</SectionTitle>
                <Ionicons
                  name={expandedSection === 'material' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={THEME_COLORS.text.secondary}
                />
              </SectionHeader>
            </TouchableOpacity>

            {expandedSection === 'material' && (
              <SectionContent>
                <MaterialGrid>
                  {materials.map((material) => (
                    <TouchableOpacity
                      key={material.id}
                      onPress={() => setSelectedMaterial(material.id)}
                    >
                      <MaterialButton active={selectedMaterial === material.id}>
                        <MaterialSwatch backgroundColor={material.color}>
                          <MaterialCommunityIcons
                            name={material.icon as any}
                            size={16}
                            color="#FFFFFF"
                          />
                        </MaterialSwatch>
                        <MaterialLabel active={selectedMaterial === material.id}>
                          {material.label}
                        </MaterialLabel>
                      </MaterialButton>
                    </TouchableOpacity>
                  ))}
                </MaterialGrid>
              </SectionContent>
            )}
          </Section>

          {/* Color Picker Section */}
          <Section>
            <TouchableOpacity onPress={() => toggleSection('color')}>
              <SectionHeader>
                <Ionicons name="color-palette" size={18} color={THEME_COLORS.text.primary} />
                <SectionTitle>Color</SectionTitle>
                <Ionicons
                  name={expandedSection === 'color' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={THEME_COLORS.text.secondary}
                />
              </SectionHeader>
            </TouchableOpacity>

            {expandedSection === 'color' && (
              <SectionContent>
                <TamaguiColorPicker
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </SectionContent>
            )}
          </Section>

          {/* Material Properties Section */}
          <Section>
            <TouchableOpacity onPress={() => toggleSection('properties')}>
              <SectionHeader>
                <Ionicons name="options-outline" size={18} color={THEME_COLORS.text.primary} />
                <SectionTitle>Properties</SectionTitle>
                <Ionicons
                  name={expandedSection === 'properties' ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={THEME_COLORS.text.secondary}
                />
              </SectionHeader>
            </TouchableOpacity>

            {expandedSection === 'properties' && (
              <SectionContent>
                <TamaguiPropertySlider
                  label="Roughness"
                  value={materialProps.roughness}
                  onValueChange={(value) => updateMaterialProp('roughness', value)}
                  icon="texture-box"
                />
                <TamaguiPropertySlider
                  label="Shininess"
                  value={materialProps.shininess}
                  onValueChange={(value) => updateMaterialProp('shininess', value)}
                  icon="shimmer"
                />
                <TamaguiPropertySlider
                  label="Thickness"
                  value={materialProps.thickness}
                  onValueChange={(value) => updateMaterialProp('thickness', value)}
                  icon="layers"
                />
                <TamaguiPropertySlider
                  label="Weight"
                  value={materialProps.weight}
                  onValueChange={(value) => updateMaterialProp('weight', value)}
                  icon="weight"
                />
              </SectionContent>
            )}
          </Section>

          {/* Simulate Button */}
          <Section>
            <TouchableOpacity onPress={() => setIsSimulating(!isSimulating)}>
              <SimulateButton active={isSimulating}>
                <LinearGradient
                  colors={
                    isSimulating
                      ? [THEME_COLORS.accent.coral, THEME_COLORS.accent.purple]
                      : [THEME_COLORS.accent.blue, THEME_COLORS.accent.teal]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}
                >
                  <MaterialCommunityIcons
                    name={isSimulating ? 'pause' : 'play'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <SimulateText>
                    {isSimulating ? 'Stop Simulation' : 'Simulate Physics'}
                  </SimulateText>
                </LinearGradient>
              </SimulateButton>
            </TouchableOpacity>
          </Section>
        </ScrollView>
      </ScrollContainer>
    </Container>
  );
};
