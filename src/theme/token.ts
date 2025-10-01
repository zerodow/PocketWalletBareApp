// theme/tokens.ts

// Spacing theo 8pt system
export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

// Border radius
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

// Elevation / Shadow level
export const elevation = {
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 12,
} as const;

// Animation duration & easing
export const duration = {
  fast: 120,
  normal: 200,
  slow: 320,
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2,0,0,1)',
  decel: 'cubic-bezier(0,0,0,1)',
  accel: 'cubic-bezier(0.4,0,1,1)',
} as const;

// Colors - Light theme
export const lightColors = {
  primary: '#6C5CE7',
  onPrimary: '#FFFFFF',
  secondary: '#A8A4FF',
  onSecondary: '#1A1733',

  background: '#FFF3EB',
  onBackground: '#1B1B1F',
  surface: '#FFFFFF',
  onSurface: '#1B1B1F',

  error: '#D32F2F',
  onError: '#FFFFFF',
  outline: '#CAC4D0',

  overlay: 'rgba(0,0,0,0.08)',
  scrim: 'rgba(0,0,0,0.3)',
  focus: '#FF575752',

  success: '#2E7D32',
  warning: '#ED6C02',
  info: '#0288D1',
} as const;

// Colors - Dark theme
export const darkColors: typeof lightColors = {
  ...lightColors,
  surface: '#121212',
  onSurface: '#E6E1E5',
  background: '#000000',
  onBackground: '#E6E1E5',
  overlay: 'rgba(255,255,255,0.08)',
  scrim: 'rgba(0,0,0,0.6)',
};
