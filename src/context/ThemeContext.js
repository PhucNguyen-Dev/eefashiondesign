import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, LIGHT_COLORS } from '../config/constants';
import { useAppStore } from '../store';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { theme: userTheme, setTheme, toggleTheme } = useAppStore();

  // Determine active theme (user preference or system)
  const activeTheme = userTheme === 'system' ? systemColorScheme : userTheme;
  const isDark = activeTheme === 'dark';

  // Get theme colors
  const colors = useMemo(() => (isDark ? COLORS : LIGHT_COLORS), [isDark]);

  const theme = useMemo(
    () => ({
      colors,
      isDark,
      isLight: !isDark,
      setTheme,
      toggleTheme,
      activeTheme,
      userTheme,
    }),
    [colors, isDark, activeTheme, userTheme]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
