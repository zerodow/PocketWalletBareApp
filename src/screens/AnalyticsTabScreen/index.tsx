import { useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { TextView, SafeAreaWrapper, BaseButton } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { TabScreenProps } from '@/navigator/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { format, isThisMonth } from 'date-fns';
import {
  MonthSwitcher,
  KPICard,
  DailyBarChart,
  CategoryDonutChart,
  EmptyStateCard,
  KPICardSkeleton,
  ChartSkeleton,
} from './components';

interface AnalyticsTabScreenProps extends TabScreenProps<'AnalyticsTab'> {}

const AnalyticsTabScreen = ({ navigation }: AnalyticsTabScreenProps) => {
  const styles = useStyles();

  const {
    selectedMonth,
    kpiData,
    dailyData,
    categoryData,
    isLoading,
    error,
    progressive,
    goToPreviousMonth,
    goToNextMonth,
    refreshDashboardProgressive,
  } = useDashboardStore();

  const isCurrentMonth = isThisMonth(selectedMonth);

  // Refresh data on mount and when screen comes into focus - Use progressive refresh
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshDashboardProgressive();
    });
    return unsubscribe;
  }, [navigation, refreshDashboardProgressive]);

  const handleRefresh = useCallback(async () => {
    await refreshDashboardProgressive();
  }, [refreshDashboardProgressive]);

  const handleNavigateToQuickAdd = () => {
    (navigation as any).navigate('AddTab');
  };

  const formatMonthTitle = () => {
    return format(selectedMonth, 'MMMM yyyy', { locale: undefined });
  };

  const renderKPISection = () => {
    if (progressive.kpisLoaded && kpiData) {
      return (
        <View style={styles.kpiSection}>
          <View style={styles.kpiRow}>
            <KPICard
              title={translate('dashboardScreen.totalIncome')}
              amount={kpiData.totalIncome}
              currency="₫"
              icon="plus"
              color="income"
            />
            <KPICard
              title={translate('dashboardScreen.totalExpense')}
              amount={kpiData.totalExpense}
              currency="₫"
              icon="minus"
              color="expense"
            />
          </View>
          <KPICard
            title={translate('dashboardScreen.savings')}
            amount={Math.abs(kpiData.savingsAmount)}
            currency="₫"
            percentage={kpiData.savingsPercentage}
            icon={kpiData.savingsAmount >= 0 ? 'caretUp' : 'caretDown'}
            color="savings"
            trend={
              kpiData.savingsPercentage >= 20
                ? 'up'
                : kpiData.savingsPercentage >= 0
                ? 'neutral'
                : 'down'
            }
          />
        </View>
      );
    }

    // Show skeletons while loading
    return (
      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <KPICardSkeleton />
          <KPICardSkeleton />
        </View>
        <KPICardSkeleton />
      </View>
    );
  };

  const renderChartsSection = () => {
    if (progressive.chartsLoaded && kpiData && kpiData.totalExpense > 0) {
      return (
        <View style={styles.chartsSection}>
          <DailyBarChart data={dailyData || []} />
          <CategoryDonutChart data={categoryData || []} />
        </View>
      );
    }

    if (progressive.chartsLoaded && kpiData && kpiData.totalExpense === 0) {
      return (
        <View style={styles.chartsSection}>
          <EmptyStateCard
            title={translate('dashboardScreen.noExpenses')}
            subtitle={translate('dashboardScreen.startAddingTransactions')}
            actionText={translate('dashboardScreen.addTransaction')}
            onActionPress={handleNavigateToQuickAdd}
            icon="plus"
          />
        </View>
      );
    }

    // Show chart skeletons while loading
    return (
      <View style={styles.chartsSection}>
        <ChartSkeleton height={200} />
        <ChartSkeleton height={250} />
      </View>
    );
  };

  // Show error state
  if (error && !progressive.kpisLoaded) {
    return (
      <SafeAreaWrapper>
        <View style={styles.errorContainer}>
          <TextView size="heading" family="semiBold">
            {translate('dashboardScreen.error')}
          </TextView>
          <TextView style={styles.errorText}>{error}</TextView>
          <BaseButton
            text={translate('dashboardScreen.retry')}
            variant="outlined"
            onPress={handleRefresh}
          />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TextView size="heading" family="bold">
              {translate('dashboardScreen.title')}
            </TextView>
            <TextView size="body" style={styles.subtitle}>
              {translate('dashboardScreen.subtitle')}
            </TextView>
          </View>

          <MonthSwitcher
            selectedMonth={selectedMonth}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            isCurrentMonth={isCurrentMonth}
          />

          {/* Progressive KPI Section */}
          {renderKPISection()}

          {/* Progressive Charts Section */}
          {renderChartsSection()}

          {/* Insights summary */}
          {progressive.kpisLoaded && kpiData && kpiData.totalIncome > 0 && (
            <View style={styles.insightsSection}>
              <TextView size="title" family="semiBold">
                {translate('dashboardScreen.monthlySummary')}
              </TextView>
              <View style={styles.insightCard}>
                <TextView style={styles.insightText}>
                  {formatMonthTitle()}
                </TextView>
                <TextView
                  size="title"
                  family="bold"
                  style={styles.insightValue}
                >
                  {kpiData.savingsPercentage >= 0
                    ? translate('dashboardScreen.increased')
                    : translate('dashboardScreen.decreased')}
                  {Math.abs(kpiData.savingsPercentage).toFixed(1)}%{' '}
                  {translate('dashboardScreen.savings')}
                </TextView>
                <TextView size="caption" style={styles.insightSubtitle}>
                  {translate('dashboardScreen.savingsRate')}:{' '}
                  {kpiData.savingsPercentage.toFixed(1)}%
                </TextView>
              </View>
            </View>
          )}

          {progressive.kpisLoaded &&
            kpiData &&
            kpiData.totalIncome === 0 &&
            kpiData.totalExpense === 0 && (
              <View style={styles.chartsSection}>
                <EmptyStateCard
                  title={translate('dashboardScreen.noData')}
                  subtitle={translate('dashboardScreen.noDataForMonth', {
                    month: format(selectedMonth, 'MM/yyyy'),
                  })}
                  actionText={translate('dashboardScreen.addTransaction')}
                  onActionPress={handleNavigateToQuickAdd}
                  icon="plus"
                />
              </View>
            )}
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default AnalyticsTabScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.textDim,
    marginTop: 4,
  },
  kpiSection: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  chartsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  insightsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  insightText: {
    color: theme.colors.textDim,
    marginBottom: 4,
  },
  insightValue: {
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  insightSubtitle: {
    color: theme.colors.textDim,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  errorText: {
    color: theme.colors.textDim,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
}));
