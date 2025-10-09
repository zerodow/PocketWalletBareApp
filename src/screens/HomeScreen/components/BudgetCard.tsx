import React from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface BudgetData {
  spent: number;
  total: number;
  dailyBudget: number;
  daysLeft: number;
}

interface BudgetCardProps {
  budgetData: BudgetData;
}

export const BudgetCard = ({ budgetData }: BudgetCardProps) => {
  const styles = useStyles();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetProgress = () => {
    return (budgetData.spent / budgetData.total) * 100;
  };

  return (
    <View style={styles.budgetCard}>
      <TextView size="title" weight="semiBold" style={styles.budgetTitle}>
        {format(new Date(), 'MMMM yyyy')} {translate('homeScreen.budget')}
      </TextView>
      <View style={styles.budgetRow}>
        <TextView size="heading" weight="bold" style={styles.budgetAmount}>
          {formatAmount(budgetData.spent)}
        </TextView>
        <TextView size="body" style={styles.budgetTotal}>
          / {formatAmount(budgetData.total)}
        </TextView>
        <TextView size="body" weight="semiBold" style={styles.budgetPercentage}>
          {Math.round(getBudgetProgress())}%
        </TextView>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: `${getBudgetProgress()}%` }]}
        />
      </View>

      <View style={styles.budgetDetails}>
        <TextView size="caption" style={styles.budgetDetailText}>
          {translate('homeScreen.dailyBudget')} -{' '}
          {formatAmount(budgetData.dailyBudget)}
        </TextView>
        <TextView size="caption" style={styles.budgetDetailText}>
          {budgetData.daysLeft} {translate('homeScreen.daysLeft')}
        </TextView>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  budgetCard: {
    backgroundColor: theme.isDark
      ? theme.colors.background
      : theme.colors.onPrimary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    // Add border for dark mode
    ...(theme.isDark && {
      borderWidth: 1,
      borderColor: theme.colors.border,
    }),
  },

  budgetTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  budgetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },

  budgetAmount: {
    color: theme.colors.tint,
  },

  budgetTotal: {
    color: theme.colors.textDim,
    marginLeft: theme.spacing.xxs,
  },

  budgetPercentage: {
    color: theme.colors.text,
    marginLeft: 'auto',
  },

  progressBarContainer: {
    height: theme.spacing.xs - theme.spacing.xxxs,
    backgroundColor: theme.colors.border,
    borderRadius: theme.spacing.xxxs + 1,
    marginBottom: theme.spacing.sm,
  },

  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.tint,
    borderRadius: theme.spacing.xxxs + 1,
  },

  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  budgetDetailText: {
    color: theme.colors.textDim,
  },
}));
