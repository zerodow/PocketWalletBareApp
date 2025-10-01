import {
  lightColors,
  darkColors,
  spacing,
  radius,
  elevation,
  duration,
  easing,
} from './token';
import { typography } from './typography';

export type ColorMode = 'light' | 'dark';

export type Theme = Readonly<{
  colors: typeof lightColors;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  duration: typeof duration;
  easing: typeof easing;
  typography: typeof typography;
  isDark: boolean;
}>;

/** Tạo theme từ mode ('light' | 'dark') */
export const createTheme = (mode: ColorMode): Theme => ({
  colors: mode === 'dark' ? darkColors : lightColors,
  spacing,
  radius,
  elevation,
  duration,
  easing,
  typography,
  isDark: mode === 'dark',
});
