import { useState, useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { DatabaseQueries } from '@/database/queries';
import { TransactionType } from '@/types';

export interface TransactionItem {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: number;
  categoryName?: string;
}

export interface ProgressiveLoadingState {
  phase: 'skeleton' | 'data' | 'complete';
  showSkeleton: boolean;
}

export interface UseTransactionPaginationResult {
  transactions: TransactionItem[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  progressive: ProgressiveLoadingState;
  loadNextPage: () => void;
  refresh: () => void;
  refreshProgressive: () => void;
  isEmpty: boolean;
}

interface UseTransactionPaginationOptions {
  pageSize?: number;
  sortField?: 'occurred_at' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook for paginated transaction loading with infinite scroll support
 */
export const useTransactionPagination = (
  options: UseTransactionPaginationOptions = {},
): UseTransactionPaginationResult => {
  const { pageSize = 20 } = options;

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [progressive, setProgressive] = useState<ProgressiveLoadingState>({
    phase: 'skeleton',
    showSkeleton: true,
  });

  // Use ref to track current page to avoid adding it as dependency
  const currentPageRef = useRef(0);

  const mapDatabaseTransaction = useCallback(
    (record: any, categoryMap: Map<string, string>): TransactionItem => {
      return {
        id: record.id,
        amount: Math.abs(record.amountMinorUnits / 100),
        type: (record.amountMinorUnits >= 0
          ? 'income'
          : 'expense') as TransactionType,
        description: record.description,
        date: record.occurredAt || new Date().getTime(),
        categoryName: categoryMap.get(record.categoryId) || 'Danh mục',
      };
    },
    [],
  );

  const fetchTransactions = useCallback(
    async (reset: boolean = false) => {
      if (reset) {
        setRefreshing(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }

      try {
        const page = reset ? 0 : currentPageRef.current;
        const result = await DatabaseQueries.getTransactionsPaginated(
          page,
          pageSize,
        );

        // Load categories for mapping
        const categories = await DatabaseQueries.getCategories();
        const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

        const transactionList = result.transactions.map(record =>
          mapDatabaseTransaction(record, categoryMap),
        );

        if (reset) {
          setTransactions(transactionList);
        } else {
          setTransactions(prev => [...prev, ...transactionList]);
        }

        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);

        if (reset) {
          currentPageRef.current = 1;
        } else {
          currentPageRef.current += 1;
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [pageSize, mapDatabaseTransaction],
  );

  const loadNextPage = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchTransactions();
  }, [fetchTransactions, hasMore, loadingMore]);

  const refresh = useCallback(() => {
    currentPageRef.current = 0;
    setHasMore(true);
    fetchTransactions(true);
  }, [fetchTransactions]);

  const refreshProgressive = useCallback(() => {
    // Phase 0: Show skeleton immediately
    setProgressive({
      phase: 'skeleton',
      showSkeleton: true,
    });
    setLoading(true);
    currentPageRef.current = 0;
    setHasMore(true);

    // Use InteractionManager for smooth UI updates
    InteractionManager.runAfterInteractions(async () => {
      try {
        // Phase 1: Load data progressively
        setProgressive({
          phase: 'data',
          showSkeleton: false,
        });

        const result = await DatabaseQueries.getTransactionsPaginated(
          0,
          pageSize,
        );
        const categories = await DatabaseQueries.getCategories();
        const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

        const transactionList = result.transactions.map(record =>
          mapDatabaseTransaction(record, categoryMap),
        );

        setTransactions(transactionList);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
        currentPageRef.current = 1;

        // Phase 2: Complete
        setTimeout(() => {
          setProgressive({
            phase: 'complete',
            showSkeleton: false,
          });
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error('Error loading transactions progressively:', error);
        setLoading(false);
        setProgressive({
          phase: 'complete',
          showSkeleton: false,
        });
      }
    });
  }, [pageSize, mapDatabaseTransaction]);

  const isEmpty = transactions.length === 0 && !loading;

  return {
    transactions,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    totalCount,
    progressive,
    loadNextPage,
    refresh,
    refreshProgressive,
    isEmpty,
  };
};
