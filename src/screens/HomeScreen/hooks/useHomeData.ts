import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { startOfMonth, endOfMonth, isToday } from 'date-fns';
import { Q } from '@nozbe/watermelondb';

import { database } from '@/database';
import Transaction from '@/database/models/Transaction';
import Category from '@/database/models/Category';
import type { TransactionItemData } from '../components/TransactionItem';

interface BudgetData {
  spent: number;
  total: number;
  dailyBudget: number;
  daysLeft: number;
}

interface UseHomeDataReturn {
  isLoading: boolean;
  totalBalance: number;
  budgetData: BudgetData;
  recentTransactions: TransactionItemData[];
  refreshData: () => void;
}

export const useHomeData = (): UseHomeDataReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    spent: 0,
    total: 0,
    dailyBudget: 0,
    daysLeft: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionItemData[]
  >([]);

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

      // Calculate budget data (using monthly expenses as budget tracking)
      const monthBudget = 1000000; // Example budget of 1M VND
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();
      const currentDay = now.getDate();
      const daysLeft = daysInMonth - currentDay;

      setBudgetData({
        spent: monthlyExpenses,
        total: monthBudget,
        dailyBudget: monthBudget / daysInMonth,
        daysLeft: Math.max(0, daysLeft),
      });

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
    } catch (error) {
      console.error('Failed to load home screen data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return {
    isLoading,
    totalBalance,
    budgetData,
    recentTransactions,
    refreshData: loadData,
  };
};
