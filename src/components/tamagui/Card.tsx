import { styled, Stack } from '@tamagui/core';

export const Card = styled(Stack, {
  name: 'Card',
  backgroundColor: '$bgCard',
  borderRadius: '$lg',
  padding: '$lg',
  shadowColor: '$shadow',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$bgCard',
      },
      elevated: {
        backgroundColor: '$bgCard',
        shadowOpacity: 0.5,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$border',
      },
    },
    padding: {
      none: {
        padding: 0,
      },
      sm: {
        padding: '$sm',
      },
      md: {
        padding: '$md',
      },
      lg: {
        padding: '$lg',
      },
      xl: {
        padding: '$xl',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'default',
    padding: 'lg',
  },
});

export const CardHeader = styled(Stack, {
  name: 'CardHeader',
  marginBottom: '$md',
});

export const CardContent = styled(Stack, {
  name: 'CardContent',
});

export const CardFooter = styled(Stack, {
  name: 'CardFooter',
  marginTop: '$md',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});
