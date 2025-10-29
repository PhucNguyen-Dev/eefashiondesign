import { styled, Text as TamaguiText } from '@tamagui/core';

export const Text = styled(TamaguiText, {
  name: 'Text',
  
  variants: {
    variant: {
      h1: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 40,
      },
      h2: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 36,
      },
      h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
      },
      h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
      },
      body: {
        fontSize: 16,
        lineHeight: 24,
      },
      caption: {
        fontSize: 14,
        lineHeight: 20,
      },
      small: {
        fontSize: 12,
        lineHeight: 16,
      },
    },
    color: {
      primary: {
        color: '$textPrimary',
      },
      secondary: {
        color: '$textSecondary',
      },
      tertiary: {
        color: '$textTertiary',
      },
      muted: {
        color: '$textMuted',
      },
      accent: {
        color: '$primary',
      },
      success: {
        color: '$success',
      },
      warning: {
        color: '$warning',
      },
      error: {
        color: '$error',
      },
    },
    weight: {
      normal: {
        fontWeight: 'normal',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
      bold: {
        fontWeight: 'bold',
      },
    },
    align: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'body',
    color: 'primary',
    weight: 'normal',
    align: 'left',
  },
});

export const Heading = styled(Text, {
  name: 'Heading',
  fontWeight: 'bold',
});

export const Caption = styled(Text, {
  name: 'Caption',
  fontSize: 14,
});
