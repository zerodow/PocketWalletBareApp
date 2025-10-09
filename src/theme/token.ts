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

// Color palette - comprehensive color scales
const palette = {
  // Neutral colors (light theme)
  neutral100: '#FFFFFF',
  neutral200: '#FAFAFA',
  neutral300: '#E5E7EB',
  neutral400: '#D1D5DB',
  neutral500: '#9CA3AF',
  neutral600: '#6B7280',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',

  // Purple primary theme
  primary100: '#FAF5FF',
  primary200: '#F3E8FF',
  primary300: '#E9D5FF',
  primary400: '#D8B4FE',
  primary500: '#C084FC', // Main purple
  primary600: '#A855F7',
  primary700: '#9333EA',
  primary800: '#7C3AED',
  primary900: '#581C87',

  // Secondary colors (complementary grays)
  secondary100: '#F9FAFB',
  secondary200: '#F3F4F6',
  secondary300: '#E5E7EB',
  secondary400: '#9CA3AF',
  secondary500: '#6B7280',

  // Accent colors (light purple variations)
  accent100: '#FAF5FF',
  accent200: '#F3E8FF',
  accent300: '#E9D5FF',
  accent400: '#D8B4FE',
  accent500: '#C084FC',

  // Status colors
  success100: '#ECFDF5',
  success500: '#10B981',
  warning100: '#FFFBEB',
  warning500: '#F59E0B',
  error100: '#FEF2F2',
  error500: '#EF4444',
  info100: '#EFF6FF',
  info500: '#3B82F6',

  // Overlays
  overlay20: 'rgba(192, 132, 252, 0.1)',
  overlay50: 'rgba(192, 132, 252, 0.2)',
  white: '#ffffff',
} as const;

// Colors - Light theme
export const lightColors = {
  // Material Design inspired colors (maintained for compatibility)
  primary: palette.primary500,
  onPrimary: '#FFFFFF',
  secondary: '#A8A4FF',
  onSecondary: '#1A1733',

  background: palette.neutral100,
  onBackground: palette.neutral800,
  surface: palette.neutral200,
  onSurface: palette.neutral800,

  error: palette.error500,
  onError: '#FFFFFF',
  outline: palette.neutral300,

  overlay: 'rgba(0,0,0,0.08)',
  scrim: 'rgba(0,0,0,0.3)',
  focus: '#FF575752',

  success: palette.success500,
  warning: palette.warning500,
  info: palette.info500,
  white: palette.white,

  // Semantic color names (from old system)
  text: palette.neutral800,
  textDim: palette.neutral600,
  textSecondary: palette.neutral600,
  tint: palette.primary500,
  tintInactive: palette.neutral400,
  border: palette.neutral300,
  separator: palette.neutral300,

  // Status colors with backgrounds
  successBackground: palette.success100,
  warningBackground: palette.warning100,
  errorBackground: palette.error100,
  infoBackground: palette.info100,

  // Overlays
  overlay20: palette.overlay20,
  overlay50: palette.overlay50,

  // Palette access for advanced usage
  palette,
} as const;

// Dark theme palette
const darkPalette = {
  // Neutral colors (dark theme - inverted)
  neutral100: '#111827',
  neutral200: '#1F2937',
  neutral300: '#374151',
  neutral400: '#4B5563',
  neutral500: '#6B7280',
  neutral600: '#9CA3AF',
  neutral700: '#D1D5DB',
  neutral800: '#E5E7EB',
  neutral900: '#F9FAFB',

  // Purple primary theme (same as light for brand consistency)
  primary100: '#581C87',
  primary200: '#7C3AED',
  primary300: '#9333EA',
  primary400: '#A855F7',
  primary500: '#C084FC', // Main purple
  primary600: '#D8B4FE',
  primary700: '#E9D5FF',
  primary800: '#F3E8FF',
  primary900: '#FAF5FF',

  // Secondary colors (dark mode grays)
  secondary100: '#374151',
  secondary200: '#4B5563',
  secondary300: '#6B7280',
  secondary400: '#9CA3AF',
  secondary500: '#D1D5DB',

  // Accent colors (purple variations for dark mode)
  accent100: '#581C87',
  accent200: '#7C3AED',
  accent300: '#9333EA',
  accent400: '#A855F7',
  accent500: '#C084FC',

  // Status colors (adapted for dark mode)
  success100: '#064E3B',
  success500: '#10B981',
  warning100: '#78350F',
  warning500: '#F59E0B',
  error100: '#7F1D1D',
  error500: '#EF4444',
  info100: '#1E3A8A',
  info500: '#3B82F6',

  // Overlays (adjusted for dark backgrounds)
  overlay20: 'rgba(192, 132, 252, 0.2)',
  overlay50: 'rgba(192, 132, 252, 0.3)',
} as const;

// Colors - Dark theme
export const darkColors = {
  // Material Design inspired colors (maintained for compatibility)
  primary: darkPalette.primary500,
  onPrimary: '#FFFFFF',
  secondary: '#A8A4FF',
  onSecondary: '#1A1733',

  background: darkPalette.neutral100,
  onBackground: darkPalette.neutral900,
  surface: darkPalette.neutral200,
  onSurface: darkPalette.neutral900,

  error: darkPalette.error500,
  onError: '#FFFFFF',
  outline: darkPalette.neutral300,

  overlay: 'rgba(255,255,255,0.08)',
  scrim: 'rgba(0,0,0,0.6)',
  focus: '#FF575752',

  success: darkPalette.success500,
  warning: darkPalette.warning500,
  info: darkPalette.info500,

  // Semantic color names (from old system)
  text: darkPalette.neutral900,
  textDim: darkPalette.neutral700,
  textSecondary: darkPalette.neutral700,
  tint: darkPalette.primary500,
  tintInactive: darkPalette.neutral500,
  border: darkPalette.neutral300,
  separator: darkPalette.neutral300,

  // Status colors with backgrounds
  successBackground: darkPalette.success100,
  warningBackground: darkPalette.warning100,
  errorBackground: darkPalette.error100,
  infoBackground: darkPalette.info100,

  // Overlays
  overlay20: darkPalette.overlay20,
  overlay50: darkPalette.overlay50,

  // Palette access for advanced usage
  palette: darkPalette,
  white: '#ffffff',
} as const;
