import { View } from 'react-native';
import { TextView, BaseButton, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface EmptyStateCardProps {
  title?: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: string;
}

export const EmptyStateCard = ({
  title = 'No data available',
  subtitle = 'Start by adding your first transaction',
  actionText = 'Add Transaction',
  onActionPress,
  icon = 'plus',
}: EmptyStateCardProps) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon icon={icon as any} size={32} color={styles.icon.color} />
      </View>

      <TextView size="heading" family="semiBold" style={styles.title}>
        {title}
      </TextView>
      <TextView size="body" style={styles.subtitle}>
        {subtitle}
      </TextView>

      {onActionPress && (
        <BaseButton
          text={actionText}
          variant="filled"
          onPress={onActionPress}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    color: theme.colors.primary,
  } as any,
  title: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.xl,
  },
}));
