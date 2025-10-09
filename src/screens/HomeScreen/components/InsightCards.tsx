import React from 'react';
import { View } from 'react-native';
import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import type { TopCategoryData, SpendingRateData } from '../hooks/useHomeData';

interface InsightCardsProps {
  topCategory: TopCategoryData | null;
  spendingRate: SpendingRateData | null;
  isLoading: boolean;
}

export const InsightCards: React.FC<InsightCardsProps> = ({
  topCategory,
  spendingRate,
  isLoading,
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
    <View style={styles.container}>
      {/* Top Category Card */}
      <View style={styles.card}>
        <TextView size="caption" weight="medium" style={styles.cardLabel}>
          {translate('homeScreen.topCategory')}
        </TextView>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <TextView size="caption" style={styles.loadingText}>
              {translate('homeScreen.loadingTransactions')}
            </TextView>
          </View>
        ) : topCategory ? (
          <View style={styles.cardContent}>
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: topCategory.categoryColor + '20' },
                ]}
              >
                <TextView>{topCategory.categoryIcon}</TextView>
                {/* <Icon
                  icon={topCategory.categoryIcon}
                  size={20}
                  color={topCategory.categoryColor}
                /> */}
              </View>
              <View style={styles.categoryInfo}>
                <TextView
                  size="body"
                  weight="semiBold"
                  style={styles.categoryName}
                  numberOfLines={1}
                >
                  {topCategory.categoryName}
                </TextView>
                <TextView size="caption" style={styles.categoryPercentage}>
                  {Math.round(topCategory.percentage)}%{' '}
                  {translate('homeScreen.ofExpenses')}
                </TextView>
              </View>
            </View>
            <TextView size="title" weight="bold" style={styles.categoryAmount}>
              {formatAmount(topCategory.amount)}
            </TextView>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <TextView size="caption" style={styles.emptyText}>
              {translate('homeScreen.noExpenseData')}
            </TextView>
          </View>
        )}
      </View>

      {/* Spending Rate Card */}
      <View style={styles.card}>
        <TextView size="caption" weight="medium" style={styles.cardLabel}>
          {translate('homeScreen.spendingRate')}
        </TextView>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <TextView size="caption" style={styles.loadingText}>
              {translate('homeScreen.loadingTransactions')}
            </TextView>
          </View>
        ) : spendingRate && spendingRate.currentMonthRate > 0 ? (
          <View style={styles.cardContent}>
            <View style={styles.rateHeader}>
              <TextView size="heading" weight="bold" style={styles.rateValue}>
                {Math.round(spendingRate.currentMonthRate)}%
              </TextView>
              {spendingRate.lastMonthRate > 0 && (
                <View
                  style={[
                    styles.rateIndicator,
                    spendingRate.isHigher
                      ? styles.rateIndicatorHigher
                      : styles.rateIndicatorLower,
                  ]}
                >
                  <Icon
                    icon={spendingRate.isHigher ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={
                      spendingRate.isHigher
                        ? styles.rateHigherText.color
                        : styles.rateLowerText.color
                    }
                  />
                  <TextView
                    size="caption"
                    weight="semiBold"
                    style={
                      spendingRate.isHigher
                        ? styles.rateHigherText
                        : styles.rateLowerText
                    }
                  >
                    {Math.round(spendingRate.difference)}%
                  </TextView>
                </View>
              )}
            </View>
            {spendingRate.lastMonthRate > 0 ? (
              <TextView size="caption" style={styles.rateDescription}>
                {spendingRate.isHigher
                  ? translate('homeScreen.higherThanLastMonth')
                  : translate('homeScreen.lowerThanLastMonth')}
              </TextView>
            ) : (
              <TextView size="caption" style={styles.rateDescription}>
                {translate('homeScreen.noComparisonData')}
              </TextView>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <TextView size="caption" style={styles.emptyText}>
              {translate('homeScreen.noIncomeData')}
            </TextView>
          </View>
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  card: {
    flex: 1,
    backgroundColor: theme.isDark
      ? theme.colors.background
      : theme.colors.onPrimary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    minHeight: 120,
    ...(theme.isDark && {
      borderWidth: 1,
      borderColor: theme.colors.border,
    }),
  },

  cardLabel: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },

  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Top Category Card Styles
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },

  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xxxs,
  },

  categoryPercentage: {
    color: theme.colors.textDim,
  },

  categoryAmount: {
    color: theme.colors.tint,
    marginTop: theme.spacing.xs,
  },

  // Spending Rate Card Styles
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },

  rateValue: {
    color: theme.colors.text,
  },

  rateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxxs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxxs,
    borderRadius: theme.spacing.xs,
  },

  rateIndicatorHigher: {
    backgroundColor: theme.colors.errorBackground,
  },

  rateIndicatorLower: {
    backgroundColor: theme.colors.successBackground,
  },

  rateHigherText: {
    color: theme.colors.error,
  },

  rateLowerText: {
    color: theme.colors.success,
  },

  rateDescription: {
    color: theme.colors.textDim,
    marginTop: theme.spacing.xs,
  },

  // Common Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: theme.colors.textDim,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: theme.colors.textDim,
    textAlign: 'center',
  },
}));
