import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { translate } from '@/i18n/translate';
import { TxKeyPath } from '@/i18n';

type FontFamily = 'regular' | 'medium' | 'semiBold' | 'bold' | 'italic';
type FontSize = 'caption' | 'body' | 'title' | 'heading' | 'display';
type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

export interface TextViewProps extends Omit<TextProps, 'children'> {
  /**
   * Text content - string or translation key
   */
  text?: string;

  /**
   * Translation key from i18n
   */
  tx?: TxKeyPath;

  /**
   * Translation options for i18n
   */
  txOptions?: Record<string, any>;

  /**
   * Children to render (overrides text/tx)
   */
  children?: React.ReactNode;

  /**
   * Font family from theme
   */
  family?: FontFamily;

  /**
   * Font size from theme
   */
  size?: FontSize;

  /**
   * Font weight from theme
   */
  weight?: FontWeight;

  /**
   * Text color - can be theme color key or custom color
   */
  color?: string;

  /**
   * Text alignment
   */
  align?: TextStyle['textAlign'];

  /**
   * Text transform
   */
  transform?: TextStyle['textTransform'];

  /**
   * Line height (multiplier of font size if < 2, otherwise absolute value)
   */
  lineHeight?: number;

  /**
   * Custom style
   */
  style?: TextStyle | TextStyle[];
}

export const TextView: React.FC<TextViewProps> = ({
  text,
  tx,
  txOptions,
  children,
  family = 'regular',
  size = 'body',
  weight,
  color,
  align,
  transform,
  lineHeight,
  style,
  ...textProps
}) => {
  const theme = useTheme();

  // Determine content priority: children > tx > text
  const content = children ?? (tx ? translate(tx, txOptions) : text);

  // Calculate line height
  const fontSize = theme.typography.size[size];
  const calculatedLineHeight = lineHeight
    ? lineHeight < 2
      ? fontSize * lineHeight
      : lineHeight
    : undefined;

  const textStyle: TextStyle = {
    fontFamily: theme.typography.family[family],
    fontSize,
    fontWeight: weight ? theme.typography.weight[weight] : undefined,
    color: color || theme.colors.onBackground,
    textAlign: align,
    textTransform: transform,
    lineHeight: calculatedLineHeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {content}
    </Text>
  );
};
