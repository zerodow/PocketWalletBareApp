import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextView, SafeAreaWrapper, Icon, TransactionItem } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { useAppStore } from '@/store/appStore';
import { translate } from '@/i18n/translate';
import type { TabScreenProps } from '@/navigator/types';
import { useHomeData } from './hooks/useHomeData';

type HomeScreenProps = TabScreenProps<'HomeTab'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { top } = useSafeAreaInsets();
  const styles = useStyles();
  const user = useAppStore(state => state.user);

  // Use custom hook for data loading
  const { isLoading, totalBalance, budgetData, recentTransactions } =
    useHomeData();

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
  console.log('getBudgetProgress', getBudgetProgress());
  const handleTransactionPress = (transactionId: string) => {
    (navigation as any).navigate('TransactionDetail', {
      transactionId,
    });
  };

  const renderTransactionItem: ListRenderItem<any> = ({ item }) => (
    <TransactionItem
      id={item.id}
      description={item.description}
      amount={item.amount}
      date={format(new Date(item.date), 'dd/MM/yyyy')}
      categoryName={item.categoryName}
      categoryColor={item.categoryColor}
      categoryIcon={item.categoryIcon}
      onPress={handleTransactionPress}
    />
  );

  const renderEmptyTransactions = () => (
    <View style={styles.emptyContainer}>
      <TextView size="body" weight="semiBold" style={styles.emptyText}>
        {translate('homeScreen.noTransactionsToday')}
      </TextView>
      <TextView size="body" style={styles.emptySubtext}>
        {translate('homeScreen.tapToAddTransaction')}
      </TextView>
    </View>
  );

  return (
    <SafeAreaWrapper top={false}>
      <ScrollView
        style={[styles.container, { paddingTop: top }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Purple Header */}
        <View style={styles.purpleHeader}>
          {/* Header Content */}
          <View style={styles.headerContent}>
            {/* User Avatar */}
            <View style={styles.userAvatar}>
              {user && (
                <TextView
                  size="body"
                  weight="semiBold"
                  style={styles.avatarText}
                >
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </TextView>
              )}
            </View>

            {/* Total Balance */}
            <View style={styles.balanceSection}>
              <TextView size="body" style={styles.balanceLabel}>
                {translate('homeScreen.totalBalance')}
              </TextView>
              <TextView
                size="display"
                weight="bold"
                style={styles.balanceAmount}
              >
                {formatAmount(totalBalance)}
              </TextView>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => (navigation as any).navigate('AddTab')}
              activeOpacity={0.8}
            >
              <Icon icon="add" size={20} color={styles.addIcon.color} />
            </TouchableOpacity>
          </View>

          {/* Budget Card */}
          <View style={styles.budgetCard}>
            <TextView size="title" weight="semiBold" style={styles.budgetTitle}>
              {format(new Date(), 'MMMM yyyy')} {translate('homeScreen.budget')}
            </TextView>
            <View style={styles.budgetRow}>
              <TextView
                size="heading"
                weight="bold"
                style={styles.budgetAmount}
              >
                {formatAmount(budgetData.spent)}
              </TextView>
              <TextView size="body" style={styles.budgetTotal}>
                / {formatAmount(budgetData.total)}
              </TextView>
              <TextView
                size="body"
                weight="semiBold"
                style={styles.budgetPercentage}
              >
                {Math.round(getBudgetProgress())}%
              </TextView>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${getBudgetProgress()}%` },
                ]}
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
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Transactions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TextView
                size="heading"
                weight="semiBold"
                style={styles.sectionTitle}
              >
                {translate('homeScreen.transactions')}
              </TextView>
              <TouchableOpacity
                onPress={() => (navigation as any).navigate('TransactionsTab')}
              >
                <TextView
                  size="body"
                  weight="medium"
                  style={styles.seeAllButton}
                >
                  {translate('homeScreen.seeAll')}
                </TextView>
              </TouchableOpacity>
            </View>

            <TextView size="body" weight="medium" style={styles.todayLabel}>
              {translate('homeScreen.today')}
            </TextView>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <TextView size="body" style={styles.loadingText}>
                  {translate('homeScreen.loadingTransactions')}
                </TextView>
              </View>
            ) : (
              <FlatList
                data={recentTransactions}
                renderItem={renderTransactionItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyTransactions}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.isDark
      ? theme.colors.background
      : theme.colors.primary,
  },

  scrollContent: {
    flexGrow: 1,
  },

  // Purple Header Styles
  purpleHeader: {
    backgroundColor: theme.isDark ? theme.colors.surface : theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.spacing.xl,
    borderBottomRightRadius: theme.spacing.xl,
    // Add subtle elevation for dark mode
    ...(theme.isDark && {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    }),
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  userAvatar: {
    width: theme.spacing.xxxl,
    height: theme.spacing.xxxl,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.isDark
      ? theme.colors.primary
      : theme.colors.onPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: theme.isDark ? theme.colors.onPrimary : theme.colors.primary,
  },

  balanceSection: {
    alignItems: 'center',
    minHeight: theme.spacing.xxxl + theme.spacing.xxl,
    flex: 1,
  },

  balanceLabel: {
    color: theme.isDark ? theme.colors.textDim : theme.colors.onPrimary,
    opacity: 0.9,
    marginBottom: theme.spacing.xxs,
  },

  balanceAmount: {
    color: theme.isDark ? theme.colors.text : theme.colors.onPrimary,
    lineHeight: theme.spacing.xxxl + theme.spacing.xxs,
  },

  addIcon: {
    color: theme.isDark ? theme.colors.onPrimary : theme.colors.primary,
  },

  addButton: {
    width: theme.spacing.xxxl,
    height: theme.spacing.xxxl,
    borderRadius: theme.spacing.lg,
    backgroundColor: theme.isDark
      ? theme.colors.primary
      : theme.colors.onPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    // Add subtle shadow for better visibility
    ...(theme.isDark && {
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    }),
  },

  // Budget Card Styles
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

  // Content Container Styles
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  section: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    color: theme.colors.text,
  },

  seeAllButton: {
    color: theme.colors.tint,
  },

  // Transactions Section Styles
  todayLabel: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.md,
  },

  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },

  loadingText: {
    color: theme.colors.textDim,
  },

  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },

  emptyText: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },

  emptySubtext: {
    color: theme.colors.textDim,
  },
}));
