import { styled, Stack, Text } from '@tamagui/core';

export const Button = styled(Stack, {
  name: 'Button',
  backgroundColor: '$primary',
  paddingHorizontal: '$lg',
  paddingVertical: '$md',
  borderRadius: '$md',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      secondary: {
        backgroundColor: '$accent',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '$primary',
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      error: {
        backgroundColor: '$error',
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$sm',
        paddingVertical: '$xs',
      },
      md: {
        paddingHorizontal: '$lg',
        paddingVertical: '$md',
      },
      lg: {
        paddingHorizontal: '$xl',
        paddingVertical: '$lg',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontSize: 16,
  fontWeight: '600',
  
  variants: {
    variant: {
      outline: {
      },
      ghost: {
      },
    },
    size: {
      sm: {
        fontSize: 14,
      },
      md: {
        fontSize: 16,
      },
      lg: {
        fontSize: 18,
      },
    },
  } as const,
});
