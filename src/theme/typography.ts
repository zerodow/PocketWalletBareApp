import { PixelRatio } from 'react-native';

/**
 * Dùng 1 nơi duy nhất để scale font theo system font scale.
 * Thay đổi SCALING_FACTOR nếu muốn nhạy hơn/kém hơn.
 */
const SCALING_FACTOR = 0.5;

export const scaleFont = (size: number) => {
  const systemScale = PixelRatio.getFontScale();
  const adjusted = 1 + (systemScale - 1) * SCALING_FACTOR;
  return Math.round(size * adjusted);
};

export const typography = {
  scale: scaleFont,
  family: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    italic: 'Inter-Italic',
  },
  size: {
    caption: scaleFont(12),
    body: scaleFont(14),
    title: scaleFont(16),
    heading: scaleFont(20),
    display: scaleFont(28),
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;
