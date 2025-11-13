/**
 * Glassmorphism Design System Components
 * Reusable glass-effect components with cross-platform support
 * Supports web (backdrop-filter) and mobile (fallback styles)
 */

import React from 'react';
import { Platform } from 'react-native';
import { Stack, styled } from '@tamagui/core';

// Base Glass Component with platform-specific backdrop filter
const GlassBase = styled(Stack, {
  borderWidth: 1,
  borderRadius: '$4',
  
  variants: {
    intensity: {
      light: {
        backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
      },
      medium: {
        backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
      strong: {
        backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
          ? 'rgba(255, 255, 255, 0.25)' 
          : 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
    dark: {
      true: {
        // Dark mode variants
      },
      false: {
        // Light mode variants (default)
      },
    },
  },
  
  defaultVariants: {
    intensity: 'medium',
    dark: false,
  },
});

// Glass Card Component
export const GlassCard = styled(GlassBase, {
  padding: '$4',
  borderRadius: '$6',
  
  // Web-specific backdrop filter
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }),
  
  variants: {
    elevated: {
      true: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  },
});

// Glass Panel Component (for sidebars, modals)
export const GlassPanel = styled(GlassBase, {
  padding: '$5',
  borderRadius: '$4',
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
  }),
});

// Glass Navigation Bar
export const GlassNavBar = styled(GlassBase, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderRadius: 0,
  borderTopWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  }),
});

// Glass Modal Overlay
export const GlassModal = styled(GlassBase, {
  padding: '$6',
  borderRadius: '$8',
  maxWidth: 500,
  width: '90%',
  alignSelf: 'center',
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
  }),
  
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.5,
  shadowRadius: 20,
  elevation: 20,
});

// Glass Button
export const GlassButton = styled(GlassBase, {
  paddingHorizontal: '$5',
  paddingVertical: '$3',
  borderRadius: '$10',
  alignItems: 'center',
  justifyContent: 'center',
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  
  hoverStyle: Platform.OS === 'web' ? {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.02 }],
  } : {},
  
  pressStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 0.98 }],
  },
});

// Glass Input Container
export const GlassInput = styled(GlassBase, {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderRadius: '$4',
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  }),
  
  focusStyle: {
    borderColor: 'rgba(108, 99, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

// Glass Floating Action Button
export const GlassFAB = styled(GlassBase, {
  width: 60,
  height: 60,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 20,
  right: 20,
  
  ...(Platform.OS === 'web' && {
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),
  
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
  
  hoverStyle: Platform.OS === 'web' ? {
    transform: [{ scale: 1.1 }, { rotate: '5deg' }],
    shadowOpacity: 0.5,
  } : {},
  
  pressStyle: {
    transform: [{ scale: 0.9 }],
  },
});

// Dark Mode Glass Variants
export const GlassCardDark = styled(GlassCard, {
  backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
    ? 'rgba(0, 0, 0, 0.3)' 
    : 'rgba(0, 0, 0, 0.5)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
});

export const GlassPanelDark = styled(GlassPanel, {
  backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
    ? 'rgba(0, 0, 0, 0.4)' 
    : 'rgba(0, 0, 0, 0.6)',
  borderColor: 'rgba(255, 255, 255, 0.15)',
});

export const GlassModalDark = styled(GlassModal, {
  backgroundColor: Platform.OS === 'web' || Platform.OS === 'ios' 
    ? 'rgba(0, 0, 0, 0.5)' 
    : 'rgba(0, 0, 0, 0.7)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
});

// Utility function to check if backdrop filter is supported
export const supportsBackdropFilter = () => {
  return Platform.OS === 'web' || Platform.OS === 'ios';
};

// Custom Glass Component with children
interface GlassComponentProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  dark?: boolean;
  elevated?: boolean;
  style?: any;
}

export const GlassComponent: React.FC<GlassComponentProps> = ({ 
  children, 
  intensity = 'medium', 
  dark = false,
  elevated = false,
  style,
  ...props 
}) => {
  const supportsBackdrop = Platform.OS === 'web' || Platform.OS === 'ios';
  
  const backgroundColor = dark
    ? intensity === 'light' ? 'rgba(0, 0, 0, 0.3)' 
      : intensity === 'medium' ? 'rgba(0, 0, 0, 0.4)' 
      : 'rgba(0, 0, 0, 0.5)'
    : intensity === 'light' ? 'rgba(255, 255, 255, 0.1)' 
      : intensity === 'medium' ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(255, 255, 255, 0.25)';
  
  const borderColor = dark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.2)';
  
  return (
    <Stack
      backgroundColor={backgroundColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="$4"
      padding="$4"
      {...(supportsBackdrop && Platform.OS === 'web' && {
        style: {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          ...style,
        },
      })}
      {...(elevated && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      })}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default {
  GlassCard,
  GlassPanel,
  GlassNavBar,
  GlassModal,
  GlassButton,
  GlassInput,
  GlassFAB,
  GlassCardDark,
  GlassPanelDark,
  GlassModalDark,
  GlassComponent,
  supportsBackdropFilter,
};

