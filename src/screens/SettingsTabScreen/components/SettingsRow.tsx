import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface SettingsRowProps {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const SettingsRow = ({ label, children, style }: SettingsRowProps) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      <TextView size="body" family="medium" style={styles.label}>
        {label}
      </TextView>
      {children}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing.md,
  },
  label: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
}));
