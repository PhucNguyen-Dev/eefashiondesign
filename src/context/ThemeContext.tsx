import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, LIGHT_COLORS } from '../config/constants.js';
import { useAppStore } from '@state/appStore';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  warning: string;
  success: string;
  error: string;
  bgDark: string;
  bgCard: string;
  bgInput: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderActive: string;
  gradientPrimary: string[];
  gradientSecondary: string[];
  gradientSuccess: string[];
  gradientDanger: string[];
}

export interface ThemeContextValue {
  colors: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  activeTheme: 'light' | 'dark';
  userTheme: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme, setTheme: appSetTheme, toggleTheme } = useAppStore();

  // Determine active theme (user preference only, no system support in appStore)
  const activeTheme = userTheme === 'dark' ? 'dark' : 'light';
  
  const isDark = activeTheme === 'dark';

  // Get theme colors
  const colors = useMemo(() => (isDark ? COLORS : LIGHT_COLORS) as ColorScheme, [isDark]);

  // Wrapper for setTheme that only accepts 'light' | 'dark'
  const setTheme = (theme: ThemeMode) => {
    if (theme === 'light' || theme === 'dark') {
      appSetTheme(theme);
    }
    // Ignore 'system' as it's not supported by appStore
  };

  const theme = useMemo<ThemeContextValue>(
    () => ({
      colors,
      isDark,
      isLight: !isDark,
      setTheme,
      toggleTheme,
      activeTheme,
      userTheme: userTheme as ThemeMode,
    }),
    [colors, isDark, activeTheme, userTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
