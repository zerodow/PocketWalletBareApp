import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Pressable,
  ViewStyle,
} from 'react-native';
import { makeStyles } from '@/utils/makeStyles';
import { makeHitSlop } from '@/utils/helper';
import { TextView } from '@/components/TextView';
import { TxKeyPath } from '@/i18n';

type InputType = 'text' | 'number' | 'password';

export interface InputFieldProps
  extends Omit<TextInputProps, 'secureTextEntry'> {
  /**
   * Label text
   */
  label?: string;

  /**
   * Translation key for label
   */
  labelTx?: TxKeyPath;

  /**
   * Input type - determines keyboard and behavior
   * @default 'text'
   */
  type?: InputType;

  /**
   * Show clear button when input has value
   * @default false
   */
  showClear?: boolean;

  /**
   * Callback when clear button is pressed
   */
  onClear?: () => void;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Translation key for error message
   */
  errorTx?: TxKeyPath;

  /**
   * Custom container style
   */
  containerStyle?: ViewStyle | ViewStyle[];

  /**
   * Custom input container style
   */
  inputContainerStyle?: ViewStyle | ViewStyle[];

  /**
   * Disable the input
   * @default false
   */
  disabled?: boolean;
}

export const InputField = ({
  label,
  labelTx,
  type = 'text',
  showClear = false,
  onClear,
  error,
  errorTx,
  value,
  containerStyle,
  inputContainerStyle,
  disabled = false,
  style,
  ...textInputProps
}: InputFieldProps) => {
  const styles = useStyles();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasValue = value && value.length > 0;
  const hasError = !!(error || errorTx);

  // Determine keyboard type based on input type
  const getKeyboardType = (): TextInputProps['keyboardType'] => {
    if (type === 'number') return 'numeric';
    return textInputProps.keyboardType || 'default';
  };

  // Determine if input should be secure
  const isSecure = type === 'password' && !isPasswordVisible;

  const handleClear = () => {
    onClear?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {(label || labelTx) && (
        <TextView
          text={label}
          tx={labelTx}
          size="body"
          family="medium"
          color={styles.label.color}
          style={styles.label}
        />
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
          inputContainerStyle,
        ]}
      >
        <TextInput
          value={value}
          editable={!disabled}
          secureTextEntry={isSecure}
          keyboardType={getKeyboardType()}
          placeholderTextColor={styles.placeholder.color}
          style={[styles.input, style]}
          {...textInputProps}
        />

        {/* Right Icons Container */}
        <View style={styles.iconsContainer}>
          {/* Clear Button */}
          {showClear && hasValue && !disabled && (
            <Pressable
              onPress={handleClear}
              style={styles.iconButton}
              hitSlop={makeHitSlop(8)}
            >
              <TextView text="✕" size="title" color={styles.iconText.color} />
            </Pressable>
          )}

          {/* Password Visibility Toggle */}
          {type === 'password' && !disabled && (
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
              hitSlop={makeHitSlop(8)}
            >
              <TextView
                text={isPasswordVisible ? '👁' : '👁‍🗨'}
                size="title"
                color={styles.iconText.color}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Error Message */}
      {hasError && (
        <TextView
          text={error}
          tx={errorTx}
          size="caption"
          color={styles.errorText.color}
          style={styles.errorText}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: theme.isDark ? theme.colors.surface : '#F5F5F5',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.family.regular,
    fontSize: theme.typography.size.body,
    color: theme.colors.onSurface,
    paddingVertical: theme.spacing.sm,
  },
  placeholder: {
    color: theme.isDark ? theme.colors.white : theme.colors.outline,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconButton: {
    padding: theme.spacing.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: theme.colors.outline,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
  },
}));
