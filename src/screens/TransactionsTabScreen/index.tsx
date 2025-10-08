import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TextView, SafeAreaWrapper, BaseButton } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { TabScreenProps } from '@/navigator/types';
import { TransactionType } from '@/types';
import { useCallback } from 'react';
import {
  useTransactionPagination,
  TransactionItem as TransactionItemType,
} from '@/hooks/useTransactionPagination';
import { TransactionListSkeleton } from '@/components/Skeletons';
import { TransactionItem } from './components';

type TransactionsTabScreenProps = TabScreenProps<'TransactionsTab'>;

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return translate('transactionListScreen.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return translate('transactionListScreen.yesterday');
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    }
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    const locale = translate('transactionListScreen.currencyLocale');
    const symbol = translate('transactionListScreen.currencySymbol');
    const formatted = new Intl.NumberFormat(locale).format(amount);
    const prefix =
      type === 'income'
        ? translate('transactionListScreen.incomePrefix')
        : translate('transactionListScreen.expensePrefix');
    return `${prefix}${symbol}${formatted}`;
  };

  const handleItemPress = useCallback(
    (transactionId: string) => {
      (navigation as any).navigate('TransactionDetail', { transactionId });
    },
    [navigation],
  );

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionItemType }) => (
      <TransactionItem
        item={item}
        onPress={handleItemPress}
        formatDate={formatDate}
        formatAmount={formatAmount}
      />
    ),
    [handleItemPress],
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
          <FlatList
            data={transactions}
            keyExtractor={keyExtractor}
            renderItem={renderTransactionItem}
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
    padding: theme.spacing.md,
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
}));
