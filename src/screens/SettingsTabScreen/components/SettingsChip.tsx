import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface SettingsChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const SettingsChip = ({
  label,
  isSelected,
  onPress,
  disabled = false,
}: SettingsChipProps) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        isSelected && styles.chipActive,
        disabled && styles.chipDisabled,
      ]}
      activeOpacity={0.7}
    >
      <TextView
        size="body"
        style={[
          styles.chipText,
          isSelected && styles.chipTextActive,
          disabled && styles.chipTextDisabled,
        ]}
      >
        {label}
      </TextView>
    </TouchableOpacity>
  );
};

interface SettingsChipRowProps {
  children: React.ReactNode;
}

export const SettingsChipRow = ({ children }: SettingsChipRowProps) => {
  const styles = useStyles();

  return <View style={styles.chipRow}>{children}</View>;
};

const useStyles = makeStyles(theme => ({
  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    color: theme.colors.onSurface,
  },
  chipTextActive: {
    color: theme.colors.onPrimary,
  },
  chipTextDisabled: {
    color: theme.colors.textDim,
  },
}));
