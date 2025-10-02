import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TextView, TextViewProps } from '@/components/TextView';
import { makeHitSlop } from '@/utils/helper';
import { TxKeyPath } from '@/i18n';

type ButtonVariant = 'filled' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

export interface BaseButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  /**
   * Button text content
   */
  text?: string;

  /**
   * Translation key for button text
   */
  tx?: TxKeyPath;

  /**
   * Translation options
   */
  txOptions?: Record<string, any>;

  /**
   * Custom children (overrides text/tx)
   */
  children?: React.ReactNode;

  /**
   * Button variant style
   * @default 'filled'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Loading state - shows spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Custom button style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Custom text props
   */
  textProps?: Omit<TextViewProps, 'text' | 'tx' | 'txOptions'>;

  /**
   * Hit slop value for better touch area
   */
  hitSlopValue?: number;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  tx,
  txOptions,
  children,
  variant = 'filled',
  size = 'medium',
  loading = false,
  disabled,
  style,
  textProps,
  hitSlopValue,
  ...touchableProps
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  // Size configuration
  const sizeConfig = useMemo(() => ({
    small: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      fontSize: 'caption' as const,
      minHeight: 32,
    },
    medium: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      fontSize: 'body' as const,
      minHeight: 44,
    },
    large: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      fontSize: 'title' as const,
      minHeight: 52,
    },
  }), [theme.spacing]);

  const config = sizeConfig[size];

  // Styles
  const styles = useMemo(() => StyleSheet.create({
    baseButton: {
      paddingVertical: config.paddingVertical,
      paddingHorizontal: config.paddingHorizontal,
      minHeight: config.minHeight,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    filled: {
      backgroundColor: isDisabled ? theme.colors.outline : theme.colors.primary,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDisabled ? theme.colors.outline : theme.colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    loader: {
      marginRight: theme.spacing.xs,
    },
  }), [config, theme, isDisabled]);

  const getTextColor = (): string => {
    switch (variant) {
      case 'filled':
        return theme.colors.onPrimary;
      case 'outlined':
      case 'text':
        return isDisabled ? theme.colors.outline : theme.colors.primary;
    }
  };

  const buttonStyle = [
    styles.baseButton,
    styles[variant],
    style,
  ];

  const renderContent = () => {
    if (children) {
      return children;
    }

    return (
      <View style={styles.contentContainer}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        )}
        <TextView
          text={text}
          tx={tx}
          txOptions={txOptions}
          size={config.fontSize}
          family="semiBold"
          color={getTextColor()}
          {...textProps}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={isDisabled}
      activeOpacity={0.7}
      hitSlop={hitSlopValue ? makeHitSlop(hitSlopValue) : undefined}
      {...touchableProps}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
