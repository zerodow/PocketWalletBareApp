// theme/types.ts

import type { TextStyle } from 'react-native';

/**
 * Color tokens cho light/dark theo nghĩa SEMANTIC (không phải tên mã màu).
 * Phù hợp với tokens trong tokens.ts (lightColors / darkColors).
 */
export type ColorTokens = Readonly<{
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;

  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;

  error: string;
  onError: string;
  outline: string;

  // State / effects
  overlay: string; // overlay nhẹ trên UI (hover/pressed)
  scrim: string; // nền mờ toàn màn hình (modal)
  focus: string; // focus ring / focus outline

  // Feedback
  success: string;
  warning: string;
  info: string;
}>;

export type SpacingTokens = Readonly<{
  xxxs: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}>;

export type RadiusTokens = Readonly<{
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}>;

export type ElevationTokens = Readonly<{
  level0: number;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}>;

export type DurationTokens = Readonly<{
  fast: number; // ms
  normal: number; // ms
  slow: number; // ms
}>;

export type EasingTokens = Readonly<{
  standard: string;
  decel: string;
  accel: string;
}>;

/**
 * Typography chỉ là type; implement ở typography.ts rồi import vào Theme.
 * scale: nhận size gốc và trả size đã scale theo system font scale.
 */
export type Typography = Readonly<{
  scale: (size: number) => number;
  family: Readonly<{
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
    italic?: string;
  }>;
  size: Readonly<{
    caption: number;
    body: number;
    title: number;
    heading: number;
    display: number;
  }>;
  weight: Readonly<{
    regular: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    semiBold: TextStyle['fontWeight'];
    bold: TextStyle['fontWeight'];
  }>;
}>;

export type ColorMode = 'light' | 'dark';

/**
 * Theme tổng hợp – sẽ được tạo từ createTheme(mode) bằng cách
 * kết hợp tokens (spacing/radius/…) + bảng màu light/dark + typography.
 */
export type Theme = Readonly<{
  colors: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  elevation: ElevationTokens;
  duration: DurationTokens;
  easing: EasingTokens;
  typography: Typography;
  isDark: boolean;
}>;

/** Helper: lấy union key của một nhóm token (hữu ích cho style prop typing) */
export type TokenKeys<T> = keyof T;

export type SpacingKey = TokenKeys<SpacingTokens>;
export type RadiusKey = TokenKeys<RadiusTokens>;
export type ElevationKey = TokenKeys<ElevationTokens>;
export type DurationKey = TokenKeys<DurationTokens>;
export type EasingKey = TokenKeys<EasingTokens>;
