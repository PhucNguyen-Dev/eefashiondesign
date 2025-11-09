/**
 * PropertiesPanel Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui PropertiesPanel
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import PropertiesPanelTamagui from '../tamagui/PropertiesPanel';

const PropertiesPanel = ({ selectedElement, onUpdateProperty }) => {
  return (
    <PropertiesPanelTamagui
      selectedElement={selectedElement}
      onUpdateProperty={onUpdateProperty}
    />
  );
};

export default PropertiesPanel;
              onValueChange={(value) => onUpdateProperty('fontSize', value)}
              min={8}
              max={72}
              icon="format-size"
            />
          </View>
        )}

        {/* Stroke */}
        {selectedElement.type !== 'text' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stroke</Text>
            <PropertySlider
              label="Width"
              value={selectedElement.strokeWidth || 0}
              onValueChange={(value) => onUpdateProperty('strokeWidth', value)}
              min={0}
              max={20}
              icon="border-outside"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    maxHeight: 500,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  elementType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  propertyItem: {
    marginBottom: SPACING.md,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  propertyLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyIcon: {
    marginRight: SPACING.xs,
  },
  propertyLabelText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  propertyValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: COLORS.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default PropertiesPanel;
