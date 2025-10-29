import { styled, Stack, Text } from '@tamagui/core';
import { TextInput } from 'react-native';

export const Input = styled(TextInput, {
  name: 'Input',
  backgroundColor: '$bgCard',

  borderWidth: 1,
  borderColor: '$border',
  borderRadius: '$md',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$bgCard',
        borderColor: '$border',
      },
      filled: {
        backgroundColor: '$bgSecondary',
        borderColor: 'transparent',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: '$border',
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$sm',
        paddingVertical: '$xs',
        fontSize: 14,
      },
      md: {
        paddingHorizontal: '$md',
        paddingVertical: '$sm',
        fontSize: 16,
      },
      lg: {
        paddingHorizontal: '$lg',
        paddingVertical: '$md',
        fontSize: 18,
      },
    },
    error: {
      true: {
        borderColor: '$error',
      },
    },
    focused: {
      true: {
        borderColor: '$primary',
        borderWidth: 2,
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export const InputContainer = styled(Stack, {
  name: 'InputContainer',
  marginBottom: '$md',
});

export const InputLabel = styled(Text, {
  name: 'InputLabel',
  fontSize: 14,
  fontWeight: '500',
  marginBottom: '$xs',
});

export const InputError = styled(Text, {
  name: 'InputError',
  fontSize: 12,
  marginTop: '$xs',
});
