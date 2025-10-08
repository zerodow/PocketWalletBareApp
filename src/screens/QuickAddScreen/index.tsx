import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import numeral from 'numeral';

import {
  SafeAreaWrapper,
  BaseButton,
  InputField,
  TextView,
  TypeToggle,
  CategoryChips,
} from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { TabScreenProps } from '@/navigator/types';
import { useTransactionDraftStore } from '@/store/transactionDraftStore';
import { useSyncStore } from '@/store/syncStore';
import { useCategoryStore } from '@/store/categoryStore';
import { database } from '@/database';

type QuickAddScreenProps = TabScreenProps<'AddTab'>;

const QuickAddScreen = ({ navigation }: QuickAddScreenProps) => {
  const styles = useStyles();
  const { draft, setField, reset } = useTransactionDraftStore();
  const { enqueue } = useSyncStore();
  const { fetchCategories, getCategoriesByType } = useCategoryStore();

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Get current categories filtered by expense/income type
  const currentCategories = getCategoriesByType(draft.type === 'income');

  // Auto-suggest category based on note keywords
  useEffect(() => {
    if (draft.note && !draft.categoryId && currentCategories.length > 0) {
      const lowerNote = draft.note.toLowerCase();

      // Simple keyword-based suggestion using category names
      const matchingCategory = currentCategories.find(category => {
        const categoryName = category.name.toLowerCase();
        return (
          lowerNote.includes(categoryName) || categoryName.includes(lowerNote)
        );
      });

      if (matchingCategory) {
        setField('categoryId', matchingCategory.id);
      }
    }
  }, [draft.note, draft.categoryId, currentCategories, setField]);

  const handleSave = async () => {
    if (!draft.amount || parseFloat(draft.amount) <= 0) {
      Alert.alert(
        translate('quickAddScreen.errorTitle'),
        translate('quickAddScreen.amountRequired'),
      );
      return;
    }

    if (!draft.categoryId) {
      Alert.alert(
        translate('quickAddScreen.errorTitle'),
        translate('quickAddScreen.categoryRequired'),
      );
      return;
    }

    try {
      // Create transaction in database
      const transactionsCollection = database.get('transactions');
      const newTransaction = await database.write(async () => {
        return await transactionsCollection.create((transaction: any) => {
          transaction.amountMinorUnits =
            Math.round(parseFloat(draft.amount) * 100) *
            (draft.type === 'expense' ? -1 : 1);
          transaction.currencyCode = 'VND';
          transaction.description = draft.note || '';
          transaction.occurredAt = draft.date;
          transaction.categoryId = draft.categoryId;
          transaction.transactionSyncStatus = 'pending';
        });
      });

      // Enqueue sync operation
      const transactionData = newTransaction as any;
      enqueue({
        id: newTransaction.id,
        op: 'create',
        payload: {
          id: newTransaction.id,
          amountMinorUnits: transactionData.amountMinorUnits,
          currencyCode: transactionData.currencyCode,
          description: transactionData.description,
          occurredAt: transactionData.occurredAt,
          categoryId: transactionData.categoryId,
        },
      });

      // Show success toast
      Toast.show({
        type: 'success',
        text1: translate('quickAddScreen.successTitle'),
        text2: translate('quickAddScreen.transactionAdded'),
        visibilityTime: 2000,
      });

      // Reset form and go back
      reset();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert(
        translate('quickAddScreen.errorTitle'),
        translate('quickAddScreen.saveFailed'),
      );
    }
  };

  const handleCancel = () => {
    reset();
    navigation.goBack();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatAmountDisplay = (amount: string) => {
    if (!amount) return '';
    return numeral(amount).format('0,0');
  };

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters and leading zeros
    const cleaned = text
      .replace(/([^0-9]+)/gi, '')
      .replace(/^0+(?=\d)/, '')
      .replace(/,/gi, '');
    setField('amount', cleaned);
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.headerButton}
            >
              <TextView
                text="✕"
                size="title"
                family="semiBold"
                color={styles.headerButtonText.color}
              />
            </TouchableOpacity>
            <TextView
              text={translate('quickAddScreen.title')}
              size="title"
              family="bold"
            />
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <TextView
                text={translate('quickAddScreen.saveButton')}
                size="body"
                family="semiBold"
                color={styles.saveButtonText.color}
              />
            </TouchableOpacity>
          </View>

          {/* Type Toggle */}
          <View style={styles.section}>
            <TypeToggle
              value={draft.type}
              onChange={value => setField('type', value)}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <InputField
              value={formatAmountDisplay(draft.amount)}
              onChangeText={handleAmountChange}
              placeholder={translate('quickAddScreen.amountPlaceholder')}
              keyboardType="numeric"
              maxLength={25}
              style={styles.amountInput}
              inputContainerStyle={styles.amountInputContainer}
            />
            <TextView
              text={translate('quickAddScreen.currency')}
              size="body"
              family="medium"
              color={styles.currency.color}
              style={styles.currency}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <TextView
              text={translate('quickAddScreen.categoryLabel')}
              size="body"
              family="semiBold"
              style={styles.label}
            />
            <CategoryChips
              categories={currentCategories}
              selectedId={draft.categoryId}
              onSelect={id => setField('categoryId', id)}
              onShowMore={() => (navigation as any).navigate('CategoryList')}
            />
          </View>

          {/* Note Input */}
          <View style={styles.section}>
            <TextView
              text={translate('quickAddScreen.noteLabel')}
              size="body"
              family="semiBold"
              style={styles.label}
            />
            <InputField
              value={draft.note}
              onChangeText={text => setField('note', text)}
              placeholder={translate('quickAddScreen.notePlaceholder')}
              multiline={true}
              style={styles.noteInput}
              inputContainerStyle={styles.noteInputContainer}
              returnKeyType="done"
            />
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <TextView
              text={translate('quickAddScreen.dateLabel')}
              size="body"
              family="semiBold"
              style={styles.label}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <TextView text="📅" size="title" />
              <TextView
                text={formatDate(draft.date)}
                size="body"
                family="medium"
                style={styles.dateText}
              />
              <TextView
                text="▼"
                size="caption"
                color={styles.dropdownIcon.color}
              />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <BaseButton
              text={translate('quickAddScreen.saveButton')}
              variant="filled"
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
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
              value={new Date(draft.date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (date) {
                  setField('date', date.getTime());
                }
              }}
              style={styles.datePicker}
            />

            {Platform.OS === 'ios' && (
              <View style={styles.modalFooter}>
                <BaseButton
                  text={translate('quickAddScreen.cancelButton')}
                  variant="outlined"
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalButton}
                />
                <BaseButton
                  text={translate('quickAddScreen.saveButton')}
                  variant="filled"
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalButton}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default QuickAddScreen;

const useStyles = makeStyles(theme => ({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    marginBottom: theme.spacing.lg,
  },
  headerButton: {
    padding: theme.spacing.sm,
    minWidth: 60,
  },
  headerButtonText: {
    color: theme.colors.onSurface,
  },
  saveButtonText: {
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  amountInputContainer: {
    backgroundColor: theme.colors.palette.primary100,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
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
  noteInputContainer: {
    minHeight: 80,
    alignItems: 'flex-start',
  },
  noteInput: {
    textAlignVertical: 'top',
    minHeight: 60,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: theme.spacing.sm,
  },
  dateText: {
    flex: 1,
  },
  dropdownIcon: {
    color: theme.colors.textDim,
  },
  actions: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.xl,
    marginHorizontal: theme.spacing.md,
    maxWidth: 400,
    paddingTop: theme.spacing.md,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  datePicker: {
    paddingHorizontal: theme.spacing.md,
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
