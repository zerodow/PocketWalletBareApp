import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

export interface TransactionItemData {
  id: string;
  description: string;
  amount: number;
  date: number;
  categoryName: string;
  categoryColor: string;
}

interface TransactionItemProps {
  transaction: TransactionItemData;
  onPress: (transactionId: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const styles = useStyles();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(transaction.id)}
    >
      <View
        style={[styles.icon, { backgroundColor: transaction.categoryColor }]}
      >
        <Icon icon="menu" size={16} color="#FFFFFF" />
      </View>

      <View style={styles.details}>
        <TextView size="body" weight="semiBold" style={styles.name}>
          {transaction.description}
        </TextView>
        <TextView size="caption" style={styles.date}>
          {format(new Date(transaction.date), 'dd/MM/yyyy')}
        </TextView>
      </View>

      <TextView
        size="body"
        weight="semiBold"
        style={[
          styles.amount,
          transaction.amount > 0
            ? styles.positiveAmount
            : styles.negativeAmount,
        ]}
      >
        {transaction.amount > 0 ? '+' : ''}
        {formatAmount(transaction.amount)}
      </TextView>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.isDark ? theme.colors.primary : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.isDark ? 0.1 : 0.05,
    shadowRadius: theme.spacing.xxs,
    elevation: 2,
    // Add border for dark mode
    ...(theme.isDark && {
      borderWidth: 1,
      borderColor: theme.colors.border,
    }),
  },

  icon: {
    width: theme.spacing.xxxl,
    height: theme.spacing.xxxl,
    borderRadius: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },

  details: {
    flex: 1,
  },

  name: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xxxs,
  },

  date: {
    color: theme.colors.textDim,
  },

  amount: {
    // Color will be applied via positiveAmount/negativeAmount styles
  },

  positiveAmount: {
    color: theme.colors.success,
  },

  negativeAmount: {
    color: theme.colors.error,
  },
}));
