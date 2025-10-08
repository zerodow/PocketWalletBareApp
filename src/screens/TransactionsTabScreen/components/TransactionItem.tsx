import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { TransactionType } from '@/types';
import { TransactionItem as TransactionItemType } from '@/hooks/useTransactionPagination';

interface TransactionItemProps {
  item: TransactionItemType;
  onPress: (id: string) => void;
  formatDate: (timestamp: number) => string;
  formatAmount: (amount: number, type: TransactionType) => string;
}

export const TransactionItem = memo<TransactionItemProps>(
  ({ item, onPress, formatDate, formatAmount }) => {
    const styles = useStyles();

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionInfo}>
          <TextView
            size="body"
            family="semiBold"
            style={styles.transactionDesc}
          >
            {item.description}
          </TextView>
          <TextView size="caption" style={styles.transactionCategory}>
            {item.categoryName}
          </TextView>
        </View>

        <View style={styles.transactionRight}>
          <TextView
            size="body"
            family="semiBold"
            style={styles.transactionAmount}
            color={item.type === 'income' ? '#4CAF50' : '#F44336'}
          >
            {formatAmount(item.amount, item.type)}
          </TextView>
          <TextView size="caption" style={styles.transactionDate}>
            {formatDate(item.date)}
          </TextView>
        </View>
      </TouchableOpacity>
    );
  },
);

TransactionItem.displayName = 'TransactionItem';

const useStyles = makeStyles(theme => ({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  transactionCategory: {
    color: theme.colors.textDim,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    marginBottom: 2,
  },
  transactionDate: {
    color: theme.colors.textDim,
  },
}));
