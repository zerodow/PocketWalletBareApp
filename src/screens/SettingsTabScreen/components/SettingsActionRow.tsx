import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface SettingsActionRowProps {
  label: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  onPress: () => void;
}

export const SettingsActionRow = ({
  label,
  description,
  icon,
  iconColor,
  onPress,
}: SettingsActionRowProps) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Icon
              icon={icon}
              size={24}
              color={iconColor || styles.icon.color}
              type="ionicon"
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <TextView size="body" family="semiBold" style={styles.label}>
            {label}
          </TextView>
          {description && (
            <TextView size="caption" style={styles.description}>
              {description}
            </TextView>
          )}
        </View>
      </View>
      <Icon
        icon="chevron-forward"
        size={20}
        color={styles.chevron.color}
        type="ionicon"
      />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    color: theme.colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xxs,
  },
  description: {
    color: theme.colors.textDim,
  },
  chevron: {
    color: theme.colors.outline,
  },
}));
