import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const SettingsSection = ({
  title,
  children,
  style,
}: SettingsSectionProps) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <TextView size="title" family="semiBold" style={styles.title}>
        {title}
      </TextView>
      {children}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
}));
