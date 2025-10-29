import { styled } from '@tamagui/core';
import { View, ScrollView } from 'react-native';

export const Container = styled(View, {
  name: 'Container',
  flex: 1,
  backgroundColor: '$bgPrimary',
  
  variants: {
    centered: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
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
    padding: 'lg',
  },
});

export const Row = styled(View, {
  name: 'Row',
  flexDirection: 'row',
  alignItems: 'center',
  
  variants: {
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      between: {
        justifyContent: 'space-between',
      },
      around: {
        justifyContent: 'space-around',
      },
      evenly: {
        justifyContent: 'space-evenly',
      },
    },
    align: {
      start: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      end: {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
    },
    gap: {
      xs: {
        gap: '$xs',
      },
      sm: {
        gap: '$sm',
      },
      md: {
        gap: '$md',
      },
      lg: {
        gap: '$lg',
      },
      xl: {
        gap: '$xl',
      },
    },
  } as const,
  
  defaultVariants: {
    justify: 'start',
    align: 'center',
  },
});

export const Column = styled(View, {
  name: 'Column',
  flexDirection: 'column',
  
  variants: {
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      between: {
        justifyContent: 'space-between',
      },
      around: {
        justifyContent: 'space-around',
      },
      evenly: {
        justifyContent: 'space-evenly',
      },
    },
    align: {
      start: {
        alignItems: 'flex-start',
      },
      center: {
        alignItems: 'center',
      },
      end: {
        alignItems: 'flex-end',
      },
      stretch: {
        alignItems: 'stretch',
      },
    },
    gap: {
      xs: {
        gap: '$xs',
      },
      sm: {
        gap: '$sm',
      },
      md: {
        gap: '$md',
      },
      lg: {
        gap: '$lg',
      },
      xl: {
        gap: '$xl',
      },
    },
  } as const,
  
  defaultVariants: {
    justify: 'start',
    align: 'stretch',
  },
});

export const ScrollContainer = styled(ScrollView, {
  name: 'ScrollContainer',
  flex: 1,
  backgroundColor: '$bgPrimary',
});

export const Box = styled(View, {
  name: 'Box',
});
