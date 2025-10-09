import {
  View,
  SectionList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  TextView,
  SafeAreaWrapper,
  BaseButton,
  TransactionItem,
} from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { TabScreenProps } from '@/navigator/types';
import { useCallback, useMemo } from 'react';
import {
  useTransactionPagination,
  TransactionItem as TransactionItemType,
} from '@/hooks/useTransactionPagination';
import { TransactionListSkeleton } from '@/components/Skeletons';
import { format, isToday, isYesterday } from 'date-fns';

type TransactionsTabScreenProps = TabScreenProps<'TransactionsTab'>;

interface TransactionSection {
  title: string;
  date: string;
  data: TransactionItemType[];
}

const TransactionsTabScreen = ({ navigation }: TransactionsTabScreenProps) => {
  const styles = useStyles();
  const {
    transactions,
    refreshing,
    loadingMore,
    progressive,
    refreshProgressive,
    loadNextPage,
  } = useTransactionPagination({ pageSize: 20 });

  useFocusEffect(
    useCallback(() => {
      if (transactions.length === 0) {
        refreshProgressive();
      }
    }, [refreshProgressive, transactions.length]),
  );

  // Group transactions by day
  const sections = useMemo(() => {
    const groupedByDay = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          timestamp: transaction.date,
          transactions: [],
        };
      }
      acc[dateKey].transactions.push(transaction);
      return acc;
    }, {} as Record<string, { date: string; timestamp: number; transactions: TransactionItemType[] }>);

    // Convert to array and sort by date (newest first)
    return Object.values(groupedByDay)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(group => {
        const date = new Date(group.timestamp);
        let title: string;

        if (isToday(date)) {
          title = translate('transactionListScreen.today');
        } else if (isYesterday(date)) {
          title = translate('transactionListScreen.yesterday');
        } else {
          title = format(date, 'dd/MM/yyyy');
        }

        return {
          title,
          date: group.date,
          data: group.transactions,
        } as TransactionSection;
      });
  }, [transactions]);

  const handleItemPress = useCallback(
    (transactionId: string) => {
      (navigation as any).navigate('TransactionDetail', { transactionId });
    },
    [navigation],
  );

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionItemType }) => {
      const date = new Date(item.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedDate = `${day}/${month}`;

      return (
        <View style={styles.paddingItem}>
          <TransactionItem
            id={item.id}
            description={item.description}
            amount={item.type === 'income' ? item.amount : -item.amount}
            date={formattedDate}
            categoryName={item.categoryName || 'Danh mục'}
            categoryColor={item.categoryColor || '#6B7280'}
            categoryIcon={item.categoryIcon}
            onPress={handleItemPress}
          />
        </View>
      );
    },
    [handleItemPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <View style={styles.sectionHeader}>
        <TextView
          text={section.title}
          size="body"
          family="semiBold"
          color={styles.sectionHeaderText.color}
        />
      </View>
    ),
    [styles],
  );

  const keyExtractor = useCallback((item: TransactionItemType) => item.id, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" />
        <TextView size="body" style={styles.loadingFooterText}>
          {translate('transactionListScreen.loadingMore')}
        </TextView>
      </View>
    );
  };

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <TextView size="display" style={styles.emptyIcon}>
          💰
        </TextView>
        <TextView size="heading" family="semiBold" style={styles.emptyTitle}>
          {translate('transactionListScreen.emptyTitle')}
        </TextView>
        <TextView size="body" style={styles.emptySubtitle}>
          {translate('transactionListScreen.emptySubtitle')}
        </TextView>
        <BaseButton
          text={translate('transactionListScreen.addTransactionButton')}
          variant="filled"
          onPress={() => (navigation as any).navigate('AddTab')}
          style={styles.addButton}
        />
      </View>
    ),
    [navigation, styles],
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextView size="heading" family="bold" style={styles.title}>
            {translate('transactionListScreen.title')}
          </TextView>
        </View>

        {progressive.showSkeleton ? (
          <TransactionListSkeleton count={8} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={keyExtractor}
            renderItem={renderTransactionItem}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            // Pagination
            onEndReached={loadNextPage}
            onEndReachedThreshold={0.1}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={20}
            windowSize={10}
            // Refresh control
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshProgressive}
              />
            }
            // Loading footer
            ListFooterComponent={renderFooter}
            // Sticky headers
            stickySectionHeadersEnabled={true}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default TransactionsTabScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  title: {
    color: theme.colors.onBackground,
  },
  listContent: {
    // padding: theme.spacing.md,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    color: theme.colors.textDim,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    paddingHorizontal: theme.spacing.xl,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  loadingFooterText: {
    color: theme.colors.textDim,
  },
  sectionHeader: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs + theme.spacing.md,
    // borderBottomWidth: 1,
    // borderBottomColor: theme.colors.palette.neutral300,
    // marginHorizontal: theme.spacing.md,
  },
  sectionHeaderText: {
    color: theme.colors.palette.neutral600,
  },
  paddingItem: {
    paddingHorizontal: theme.spacing.md,
  },
}));
