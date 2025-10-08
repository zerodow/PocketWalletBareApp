import { memo } from 'react';
import { View } from 'react-native';
import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import numeral from 'numeral';

interface KPICardProps {
  title: string;
  amount: number;
  currency: string;
  percentage?: number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'income' | 'expense' | 'savings' | 'neutral';
}

export const KPICard = memo<KPICardProps>(
  ({
    title,
    amount,
    currency = '₫',
    percentage,
    icon,
    trend = 'neutral',
    color = 'neutral',
  }) => {
    const styles = useStyles();

    const formatAmount = (value: number) => {
      if (value >= 1000000000) {
        return (
          numeral(value / 1000000000).format('0.0') +
          translate('dashboardScreen.billion')
        );
      } else if (value >= 1000000) {
        return (
          numeral(value / 1000000).format('0.0') +
          translate('dashboardScreen.million')
        );
      } else if (value >= 1000) {
        return (
          numeral(value / 1000).format('0.0') +
          translate('dashboardScreen.thousand')
        );
      }
      return numeral(value).format('0,0');
    };

    const getTrendIcon = () => {
      switch (trend) {
        case 'up':
          return 'caretUp';
        case 'down':
          return 'caretDown';
        default:
          return null;
      }
    };

    const getTrendColor = () => {
      switch (trend) {
        case 'up':
          return '#10B981'; // Green
        case 'down':
          return '#EF4444'; // Red
        default:
          return undefined;
      }
    };

    return (
      <View
        style={[styles.container, { borderLeftColor: getColorAccent(color) }]}
      >
        <View style={styles.header}>
          <TextView size="caption" style={styles.title}>
            {title}
          </TextView>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getColorAccent(color) },
              ]}
            >
              <Icon icon={icon as any} size={16} color={styles.icon.color} />
            </View>
          )}
        </View>

        <View style={styles.amountContainer}>
          <TextView size="body" family="bold" style={styles.amount}>
            {`${formatAmount(amount)} ${currency}`}
          </TextView>

          {percentage !== undefined && (
            <View style={styles.percentageContainer}>
              {getTrendIcon() && (
                <Icon
                  icon={getTrendIcon() as any}
                  size={12}
                  color={getTrendColor()}
                />
              )}
              <TextView
                size="caption"
                family="semiBold"
                style={[styles.percentage, { color: getTrendTextColor(trend) }]}
              >
                {`${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`}
              </TextView>
            </View>
          )}
        </View>
      </View>
    );
  },
);

KPICard.displayName = 'KPICard';

// Helper functions
function getColorAccent(color: KPICardProps['color']) {
  switch (color) {
    case 'income':
      return '#10B981'; // Green
    case 'expense':
      return '#EF4444'; // Red
    case 'savings':
      return '#8B5CF6'; // Purple
    default:
      return '#6366F1'; // Default blue
  }
}

function getTrendTextColor(trend: KPICardProps['trend']) {
  switch (trend) {
    case 'up':
      return '#10B981'; // Green
    case 'down':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 90,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: theme.colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
  } as any,
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    color: theme.colors.onSurface,
    flex: 1,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  percentage: {
    // Color will be set dynamically
  },
}));
