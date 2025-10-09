import React from 'react';
import { View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface TransactionAmountProps {
  amount: number;
  isIncome: boolean;
  date: string;
}

export const TransactionAmount: React.FC<TransactionAmountProps> = ({
  amount,
  isIncome,
  date,
}) => {
  const styles = useStyles();

  const formatAmount = () => {
    const formatted = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
    const sign = isIncome ? '+' : '-';
    return `${sign}${formatted}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <TextView
          text={formatAmount()}
          size="body"
          family="semiBold"
          color={
            isIncome ? styles.positiveAmount.color : styles.negativeAmount.color
          }
        />
        <TextView
          text="₫"
          size="body"
          family="semiBold"
          color={
            isIncome ? styles.positiveAmount.color : styles.negativeAmount.color
          }
          style={styles.currency}
        />
      </View>
      <TextView text={date} size="caption" color={styles.date.color} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'flex-end',
    gap: theme.spacing.xxs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: theme.spacing.xxxs,
    marginBottom: 2,
  },
  currency: {
    marginLeft: 2,
  },
  positiveAmount: {
    color: theme.colors.success,
  },
  negativeAmount: {
    color: theme.colors.error,
  },
  date: {
    color: theme.colors.palette.neutral600,
  },
}));
