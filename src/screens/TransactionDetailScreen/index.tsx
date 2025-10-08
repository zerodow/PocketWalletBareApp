import { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import {
  SafeAreaWrapper,
  TextView,
  BaseButton,
  InputField,
  TypeToggle,
  CategoryChips,
  Icon,
} from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { MainStackScreenProps } from '@/navigator/types';
import { useSyncStore } from '@/store/syncStore';
import { useCategoryStore } from '@/store/categoryStore';
import { database } from '@/database';

interface TransactionDetail {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  categoryId: string;
  note: string;
  date: number;
}

type TransactionDetailScreenProps = MainStackScreenProps<'TransactionDetail'>;

const TransactionDetailScreen = ({
  route,
  navigation,
}: TransactionDetailScreenProps) => {
  const styles = useStyles();
  const { enqueue } = useSyncStore();
  const { categories, fetchCategories, getCategoriesByType } =
    useCategoryStore();
  const transactionId = route?.params?.transactionId;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadTransaction = useCallback(async () => {
    if (!transactionId) {
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        'Transaction ID is missing',
      );
      navigation.goBack();
      return;
    }

    try {
      const transactionRecord = await database
        .get('transactions')
        .find(transactionId);
      const data = transactionRecord as any;

      setTransaction({
        id: transactionRecord.id,
        amount: Math.abs(data.amountMinorUnits / 100).toString(),
        type: data.amountMinorUnits >= 0 ? 'income' : 'expense',
        categoryId: data.categoryId,
        note: data.description || '',
        date: data.occurredAt,
      });
    } catch (error) {
      console.error('Error loading transaction:', error);
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        'Unable to load transaction',
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [transactionId, navigation]);

  useEffect(() => {
    loadTransaction();
    fetchCategories();
  }, [loadTransaction, fetchCategories]);

  const handleSave = async () => {
    if (!transaction) return;

    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        translate('transactionDetailScreen.amountRequired'),
      );
      return;
    }

    if (!transaction.categoryId) {
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        translate('transactionDetailScreen.categoryRequired'),
      );
      return;
    }

    try {
      await database.write(async () => {
        const transactionRecord = await database
          .get('transactions')
          .find(transaction.id);
        await transactionRecord.update((record: any) => {
          record.amountMinorUnits =
            Math.round(parseFloat(transaction.amount) * 100) *
            (transaction.type === 'expense' ? -1 : 1);
          record.description = transaction.note;
          record.occurredAt = transaction.date;
          record.categoryId = transaction.categoryId;
          record.transactionSyncStatus = 'pending';
        });
      });

      // Enqueue sync operation
      enqueue({
        id: transaction.id,
        op: 'update',
        payload: {
          id: transaction.id,
          amountMinorUnits:
            Math.round(parseFloat(transaction.amount) * 100) *
            (transaction.type === 'expense' ? -1 : 1),
          description: transaction.note,
          occurredAt: transaction.date,
          categoryId: transaction.categoryId,
        },
      });

      setIsEditing(false);
      Alert.alert(
        translate('transactionDetailScreen.saveSuccess'),
        translate('transactionDetailScreen.saveSuccess'),
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        'Unable to update transaction',
      );
    }
  };

  const handleDelete = () => {
    Alert.alert(
      translate('transactionDetailScreen.deleteConfirmTitle'),
      translate('transactionDetailScreen.deleteConfirmMessage'),
      [
        {
          text: translate('transactionDetailScreen.cancel'),
          style: 'cancel',
        },
        {
          text: translate('transactionDetailScreen.delete'),
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    if (!transaction) return;

    try {
      await database.write(async () => {
        const transactionRecord = await database
          .get('transactions')
          .find(transaction.id);
        await transactionRecord.update((record: any) => {
          record.trashedAt = Date.now();
          record.transactionSyncStatus = 'pending';
        });
      });

      // Enqueue sync operation
      enqueue({
        id: transaction.id,
        op: 'delete',
        payload: { id: transaction.id },
      });

      Alert.alert(
        translate('transactionDetailScreen.deleteSuccess'),
        translate('transactionDetailScreen.deleteSuccess'),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert(
        translate('transactionDetailScreen.errorTitle'),
        'Unable to delete transaction',
      );
    }
  };

  const updateField = <K extends keyof TransactionDetail>(
    field: K,
    value: TransactionDetail[K],
  ) => {
    if (transaction) {
      setTransaction({ ...transaction, [field]: value });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'dd/MM/yyyy');
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    const sign = type === 'income' ? '+' : '-';
    return `${sign}${formatted} ₫`;
  };

  const formatAmountDisplay = (amount: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num) || amount.endsWith('.')) {
      return amount;
    }
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reload transaction
      loadTransaction();
    }
    setIsEditing(!isEditing);
  };

  if (loading || !transaction) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <TextView size="body" style={styles.loadingText}>
            {translate('transactionDetailScreen.loading')}
          </TextView>
        </View>
      </SafeAreaWrapper>
    );
  }

  const currentCategory = categories.find(
    cat => cat.id === transaction.categoryId,
  );
  const currentCategories = getCategoriesByType(transaction.type === 'income');

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon icon="back" size={24} color={styles.headerIcon.color} />
          </TouchableOpacity>

          <TextView size="title" family="semiBold" style={styles.headerTitle}>
            {isEditing
              ? translate('transactionDetailScreen.editTitle')
              : translate('transactionDetailScreen.title')}
          </TextView>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleEditToggle}
            activeOpacity={0.7}
          >
            <TextView
              size="body"
              family="medium"
              style={styles.headerButtonText}
            >
              {isEditing
                ? translate('transactionDetailScreen.cancel')
                : translate('transactionDetailScreen.edit')}
            </TextView>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {isEditing ? (
            <>
              {/* Edit Mode */}
              <View style={styles.section}>
                <TypeToggle
                  value={transaction.type}
                  onChange={value => updateField('type', value)}
                />
              </View>

              <View style={styles.section}>
                <InputField
                  value={formatAmountDisplay(transaction.amount)}
                  onChangeText={text => {
                    let cleaned = text.replace(/[^\d.]/g, '');
                    const parts = cleaned.split('.');
                    if (parts.length > 2) {
                      cleaned = parts[0] + '.' + parts.slice(1).join('');
                    }
                    if (
                      cleaned.length > 1 &&
                      cleaned[0] === '0' &&
                      cleaned[1] !== '.'
                    ) {
                      cleaned = cleaned.substring(1);
                    }
                    updateField('amount', cleaned);
                  }}
                  placeholder="0"
                  keyboardType="numeric"
                  style={styles.amountInput}
                />
                <TextView size="body" style={styles.currency}>
                  ₫
                </TextView>
              </View>

              <View style={styles.section}>
                <TextView
                  size="body"
                  family="medium"
                  style={styles.sectionLabel}
                >
                  {translate('transactionDetailScreen.category')}
                </TextView>
                <CategoryChips
                  categories={currentCategories}
                  selectedId={transaction.categoryId}
                  onSelect={id => updateField('categoryId', id)}
                />
              </View>

              <View style={styles.section}>
                <TextView
                  size="body"
                  family="medium"
                  style={styles.sectionLabel}
                >
                  {translate('transactionDetailScreen.note')}
                </TextView>
                <InputField
                  value={transaction.note}
                  onChangeText={text => updateField('note', text)}
                  placeholder={translate('quickAddScreen.notePlaceholder')}
                  multiline
                  style={styles.noteInput}
                />
              </View>

              <View style={styles.section}>
                <TextView
                  size="body"
                  family="medium"
                  style={styles.sectionLabel}
                >
                  {translate('transactionDetailScreen.date')}
                </TextView>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <TextView size="heading">📅</TextView>
                  <TextView size="body" family="medium" style={styles.dateText}>
                    {formatDate(transaction.date)}
                  </TextView>
                  <TextView size="caption" style={styles.dropdownIcon}>
                    ▼
                  </TextView>
                </TouchableOpacity>
              </View>

              <View style={styles.actions}>
                <BaseButton
                  text={translate('transactionDetailScreen.save')}
                  variant="filled"
                  onPress={handleSave}
                />
              </View>
            </>
          ) : (
            <>
              {/* View Mode */}
              <View style={styles.viewSection}>
                <TextView size="body" family="medium" style={styles.viewLabel}>
                  {translate('transactionDetailScreen.amount')}
                </TextView>
                <TextView
                  size="display"
                  family="bold"
                  style={
                    transaction.type === 'income'
                      ? styles.viewAmountIncome
                      : styles.viewAmountExpense
                  }
                >
                  {formatAmount(
                    parseFloat(transaction.amount),
                    transaction.type,
                  )}
                </TextView>
              </View>

              <View style={styles.viewSection}>
                <TextView size="body" family="medium" style={styles.viewLabel}>
                  {translate('transactionDetailScreen.category')}
                </TextView>
                {currentCategory && (
                  <View style={styles.categoryView}>
                    <TextView size="heading">{currentCategory.icon}</TextView>
                    <TextView size="body" family="medium">
                      {currentCategory.name}
                    </TextView>
                  </View>
                )}
              </View>

              {transaction.note && (
                <View style={styles.viewSection}>
                  <TextView
                    size="body"
                    family="medium"
                    style={styles.viewLabel}
                  >
                    {translate('transactionDetailScreen.note')}
                  </TextView>
                  <TextView size="body" style={styles.viewText}>
                    {transaction.note}
                  </TextView>
                </View>
              )}

              <View style={styles.viewSection}>
                <TextView size="body" family="medium" style={styles.viewLabel}>
                  {translate('transactionDetailScreen.date')}
                </TextView>
                <TextView size="body" style={styles.viewText}>
                  {formatDate(transaction.date)}
                </TextView>
              </View>
            </>
          )}

          {/* Delete Button (always visible) */}
          <View style={styles.deleteButtonContainer}>
            <BaseButton
              text={translate('transactionDetailScreen.delete')}
              variant="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
            />
          </View>
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.modalContent}>
              <DateTimePicker
                value={new Date(transaction.date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (date) {
                    updateField('date', date.getTime());
                  }
                }}
              />

              {Platform.OS === 'ios' && (
                <View style={styles.modalFooter}>
                  <BaseButton
                    text={translate('transactionDetailScreen.cancel')}
                    variant="outlined"
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalButton}
                  />
                  <BaseButton
                    text="Done"
                    variant="filled"
                    onPress={() => setShowDatePicker(false)}
                    style={styles.modalButton}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default TransactionDetailScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textDim,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing.xs,
    minWidth: 60,
  },
  headerIcon: {
    color: theme.colors.text,
  } as any,
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerButtonText: {
    color: theme.colors.primary,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  sectionLabel: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.sm,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  currency: {
    color: theme.colors.textDim,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  dateText: {
    flex: 1,
    color: theme.colors.text,
  },
  dropdownIcon: {
    color: theme.colors.textDim,
  },
  actions: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  viewSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  viewLabel: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.sm,
  },
  viewText: {
    color: theme.colors.text,
    lineHeight: 24,
  },
  viewAmountIncome: {
    color: '#4CAF50',
    lineHeight: 48,
  },
  viewAmountExpense: {
    color: '#F44336',
    lineHeight: 48,
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  deleteButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.lg,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
}));
