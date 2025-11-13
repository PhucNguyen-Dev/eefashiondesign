import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'

// Custom theme colors matching the app's design
const customTokens = {
  color: {
    // Primary colors
    primary: '#6C63FF',
    primaryLight: '#8B84FF',
    primaryDark: '#5449E6',
    
    // Accent colors
    accent: '#FF6B6B',
    accentLight: '#FF8B8B',
    accentDark: '#E65555',
    
    // Background colors
    bgPrimary: '#0F0F1E',
    bgSecondary: '#1A1A2E',
    bgCard: '#1E1E3F',
    bgInput: '#2A2A3E',
    bgHover: '#252545',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0C0',
    textTertiary: '#888899',
    textMuted: '#666677',
    
    // Semantic colors
    success: '#00D9C0',
    successLight: '#33E6D0',
    warning: '#FFD93D',
    warningLight: '#FFE066',
    error: '#FF6B6B',
    errorLight: '#FF8B8B',
    info: '#4A90E2',
    infoLight: '#6BA8E8',
    
    // Additional accent colors
    blue: '#4A90E2',
    purple: '#6C5CE7',
    teal: '#00D9C0',
    coral: '#FF6B6B',
    mint: '#7FFFD4',
    gold: '#FBD38D',
    pink: '#F687B3',
    
    // Neutral colors
    border: '#2A2A4A',
    borderLight: '#3A3A5A',
    shadow: '#000000',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  size: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    xxl: 64,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
}

// Create the Tamagui configuration
const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      ...customTokens.color,
    },
    space: {
      ...config.tokens.space,
      ...customTokens.space,
    },
    size: {
      ...config.tokens.size,
      ...customTokens.size,
    },
    radius: {
      ...config.tokens.radius,
      ...customTokens.radius,
    },
    zIndex: {
      ...config.tokens.zIndex,
      ...customTokens.zIndex,
    },
  },
  themes: {
    dark: {
      background: customTokens.color.bgPrimary,
      backgroundHover: customTokens.color.bgHover,
      backgroundPress: customTokens.color.bgCard,
      backgroundFocus: customTokens.color.bgSecondary,
      backgroundStrong: customTokens.color.bgCard,
      backgroundTransparent: 'transparent',
      color: customTokens.color.textPrimary,
      colorHover: customTokens.color.textPrimary,
      colorPress: customTokens.color.textSecondary,
      colorFocus: customTokens.color.textPrimary,
      colorTransparent: 'transparent',
      borderColor: customTokens.color.border,
      borderColorHover: customTokens.color.borderLight,
      borderColorFocus: customTokens.color.primary,
      borderColorPress: customTokens.color.primaryDark,
      placeholderColor: customTokens.color.textMuted,
      primary: customTokens.color.primary,
      primaryHover: customTokens.color.primaryLight,
      primaryPress: customTokens.color.primaryDark,
      secondary: customTokens.color.accent,
      secondaryHover: customTokens.color.accentLight,
      secondaryPress: customTokens.color.accentDark,
      success: customTokens.color.success,
      warning: customTokens.color.warning,
      error: customTokens.color.error,
      info: customTokens.color.info,
    },
    light: {
      background: '#FFFFFF',
      backgroundHover: '#F5F5F5',
      backgroundPress: '#E0E0E0',
      backgroundFocus: '#F0F0F0',
      backgroundStrong: '#E5E5E5',
      backgroundTransparent: 'transparent',
      color: '#1A1A1A',
      colorHover: '#000000',
      colorPress: '#333333',
      colorFocus: '#1A1A1A',
      colorTransparent: 'transparent',
      borderColor: '#E0E0E0',
      borderColorHover: '#D0D0D0',
      borderColorFocus: customTokens.color.primary,
      borderColorPress: customTokens.color.primaryDark,
      placeholderColor: '#999999',
      primary: customTokens.color.primary,
      primaryHover: customTokens.color.primaryLight,
      primaryPress: customTokens.color.primaryDark,
      secondary: customTokens.color.accent,
      secondaryHover: customTokens.color.accentLight,
      secondaryPress: customTokens.color.accentDark,
      success: customTokens.color.success,
      warning: customTokens.color.warning,
      error: customTokens.color.error,
      info: customTokens.color.info,
    },
  },
  shorthands: {
    bg: 'backgroundColor',
    bc: 'borderColor',
    bw: 'borderWidth',
    br: 'borderRadius',
    m: 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    p: 'padding',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    w: 'width',
    h: 'height',
    f: 'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
    fd: 'flexDirection',
    fw: 'flexWrap',
    fs: 'fontSize',
    lh: 'lineHeight',
    ta: 'textAlign',
    c: 'color',
  } as const,
})

export type AppConfig = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig
