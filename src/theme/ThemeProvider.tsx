import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme, type Theme, type ColorMode } from './createTheme';

const ThemeCtx = createContext<Theme | null>(null);

type Props = {
  children: React.ReactNode;
  /** Ép chế độ light/dark nếu muốn override hệ thống */
  forceMode?: ColorMode;
};

export const ThemeProvider: React.FC<Props> = ({ children, forceMode }) => {
  const system = useColorScheme();
  const mode: ColorMode = forceMode ?? (system === 'dark' ? 'dark' : 'light');

  const theme = useMemo(() => createTheme(mode), [mode]);

  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
