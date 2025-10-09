import { useState, useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { startOfMonth, endOfMonth, isToday } from 'date-fns';
import { Q } from '@nozbe/watermelondb';

import { database } from '@/database';
import Transaction from '@/database/models/Transaction';
import Category from '@/database/models/Category';
import { statisticsService } from '@/services/statisticsService';
import { budgetService } from '@/services/budgetService';

interface TransactionItemData {
  id: string;
  description: string;
  amount: number;
  date: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon?: string;
}

interface BudgetData {
  spent: number;
  total: number;
  dailyBudget: number;
  daysLeft: number;
}

export interface TopCategoryData {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

export interface SpendingRateData {
  currentMonthRate: number;
  lastMonthRate: number;
  difference: number;
  isHigher: boolean;
}

interface UseHomeDataReturn {
  isLoading: boolean;
  totalBalance: number;
  budgetData: BudgetData | null;
  recentTransactions: TransactionItemData[];
  topCategory: TopCategoryData | null;
  spendingRate: SpendingRateData | null;
  refreshData: () => void;
}

export const useHomeData = (): UseHomeDataReturn => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionItemData[]
  >([]);
  const [topCategory, setTopCategory] = useState<TopCategoryData | null>(null);
  const [spendingRate, setSpendingRate] = useState<SpendingRateData | null>(
    null,
  );

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get current month's transactions
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const transactions = await database
        .get<Transaction>('transactions')
        .query(
          Q.where(
            'occurred_at',
            Q.between(monthStart.getTime(), monthEnd.getTime()),
          ),
          Q.where('trashed_at', Q.eq(null)),
          Q.sortBy('occurred_at', Q.desc),
        )
        .fetch();

      // Get categories for transaction mapping
      const categories = await database
        .get<Category>('categories')
        .query(Q.where('deleted_at', Q.eq(null)))
        .fetch();

      const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

      // Calculate total balance (income - expenses for current month)
      const monthlyIncome =
        transactions
          .filter(t => t.amountMinorUnits > 0)
          .reduce((sum, t) => sum + t.amountMinorUnits, 0) / 100;

      const monthlyExpenses =
        transactions
          .filter(t => t.amountMinorUnits < 0)
          .reduce((sum, t) => sum + Math.abs(t.amountMinorUnits), 0) / 100;

      const balance = monthlyIncome - monthlyExpenses;
      setTotalBalance(balance);

      // Get budget for current month from database
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const monthlyBudget = await budgetService.getBudgetForMonth(
        currentYear,
        currentMonth,
      );

      if (monthlyBudget) {
        // Budget exists - calculate budget data
        const budgetAmountInUnits = monthlyBudget.budgetAmount / 100; // Convert from minor units
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
        ).getDate();
        const currentDay = now.getDate();
        const daysLeft = daysInMonth - currentDay;

        setBudgetData({
          spent: monthlyExpenses,
          total: budgetAmountInUnits,
          dailyBudget: budgetAmountInUnits / daysInMonth,
          daysLeft: Math.max(0, daysLeft),
        });
      } else {
        // No budget set - set to null to show empty state
        setBudgetData(null);
      }

      // Get today's transactions for recent list
      const todayTransactions = transactions
        .filter(t => isToday(new Date(t.occurredAt)))
        .slice(0, 4)
        .map((t): TransactionItemData => {
          const category = categoryMap.get(t.categoryId);
          return {
            id: t.id,
            description: t.description,
            amount: t.amountMinorUnits / 100,
            date: t.occurredAt,
            categoryName: category?.name || 'Unknown',
            categoryColor: category?.color || '#6B7280',
            categoryIcon: category?.icon,
          };
        });

      setRecentTransactions(todayTransactions);

      // Calculate top expense category
      try {
        // Ensure statistics are up-to-date before reading category stats
        await statisticsService.generateMonthlyStatistics(
          currentYear,
          currentMonth,
        );

        const categoryStats = await statisticsService.getCategoryStatistics(
          currentYear,
          currentMonth,
        );

        if (categoryStats.length > 0) {
          // Sort by totalAmount descending to get the top category
          const topCategoryStat = categoryStats.sort(
            (a, b) => b.totalAmount - a.totalAmount,
          )[0];

          const category = categoryMap.get(topCategoryStat.categoryId);

          if (category) {
            setTopCategory({
              categoryId: topCategoryStat.categoryId,
              categoryName: category.name,
              categoryIcon: category.icon,
              categoryColor: category.color,
              amount: topCategoryStat.totalAmount,
              percentage: topCategoryStat.percentageOfMonth,
            });
          } else {
            setTopCategory(null);
          }
        } else {
          setTopCategory(null);
        }
      } catch (error) {
        console.error('Failed to load top category:', error);
        setTopCategory(null);
      }

      // Calculate spending rate comparison
      try {
        // Get last month's date
        const lastMonthDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const lastMonthYear = lastMonthDate.getFullYear();
        const lastMonthMonth = lastMonthDate.getMonth() + 1;

        // Get current month statistics
        const currentMonthStats = await statisticsService.getMonthlyStatistics(
          currentYear,
          currentMonth,
        );

        // Get last month statistics
        const lastMonthStats = await statisticsService.getMonthlyStatistics(
          lastMonthYear,
          lastMonthMonth,
        );

        if (currentMonthStats) {
          const currentIncome = currentMonthStats.totalIncome;
          const currentExpense = currentMonthStats.totalExpense;
          const currentRate =
            currentIncome > 0 ? (currentExpense / currentIncome) * 100 : 0;

          if (lastMonthStats) {
            const lastIncome = lastMonthStats.totalIncome;
            const lastExpense = lastMonthStats.totalExpense;
            const lastRate =
              lastIncome > 0 ? (lastExpense / lastIncome) * 100 : 0;

            const rateDifference = currentRate - lastRate;
            const isHigher = rateDifference > 0;

            setSpendingRate({
              currentMonthRate: currentRate,
              lastMonthRate: lastRate,
              difference: Math.abs(rateDifference),
              isHigher,
            });
          } else {
            // No last month data
            setSpendingRate({
              currentMonthRate: currentRate,
              lastMonthRate: 0,
              difference: 0,
              isHigher: false,
            });
          }
        } else {
          setSpendingRate(null);
        }
      } catch (error) {
        console.error('Failed to load spending rate:', error);
        setSpendingRate(null);
      }
    } catch (error) {
      console.error('Failed to load home screen data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when screen/tab comes into focus
  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, loadData]);

  return {
    isLoading,
    totalBalance,
    budgetData,
    recentTransactions,
    topCategory,
    spendingRate,
    refreshData: loadData,
  };
};
