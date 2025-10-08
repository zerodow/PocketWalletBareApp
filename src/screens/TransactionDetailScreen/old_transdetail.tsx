import { useEffect, useState } from 'react';
import {
  View,
  ViewStyle,
  TextStyle,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Text } from '@/components/Text';
import { TypeToggle } from '@/components/TypeToggle';
import { CategoryChips } from '@/components/CategoryChips';

import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { MainStackParamList } from '@/navigators/MainNavigator';
import { useSyncStore } from '@/store/syncStore';
import { useCategoryStore } from '@/store/categoryStore';
import { database } from '@/database';
import { TransactionType } from '@/types';

interface TransactionDetail {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  categoryId: string;
  note: string;
  date: number;
}

type TransactionDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'TransactionDetail'
>;

export const TransactionDetailScreen = ({
  route,
  navigation,
}: TransactionDetailScreenProps) => {
  const { themed } = useAppTheme();
  const { enqueue } = useSyncStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { transactionId } = route.params;

  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadTransaction();
    fetchCategories();
  }, [transactionId, fetchCategories]);

  const loadTransaction = async () => {
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
        note: data.description,
        date: data.occurredAt,
      });
    } catch (error) {
      console.error('Error loading transaction:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin giao dịch');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!transaction) return;

    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (!transaction.categoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
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
      Alert.alert('Thành công', 'Đã cập nhật giao dịch');
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật giao dịch');
    }
  };

  const handleDelete = () => {
    Alert.alert('Xóa giao dịch', 'Bạn có chắc muốn xóa giao dịch này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: confirmDelete },
    ]);
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

      Alert.alert('Thành công', 'Đã xóa giao dịch');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Lỗi', 'Không thể xóa giao dịch');
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
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    const sign = type === 'income' ? '+' : '-';
    return `${sign}${formatted} VND`;
  };

  const formatAmountDisplay = (amount: string) => {
    if (!amount) return '';
    // Only format if it's a valid number
    const num = parseFloat(amount);
    if (isNaN(num) || amount.endsWith('.')) {
      // Don't format if ending with decimal point or invalid
      return amount;
    }
    // Format with thousand separators
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading || !transaction) {
    return (
      <Screen style={themed($screen)} preset="fixed">
        <Header
          title="Chi tiết giao dịch"
          leftIcon="back"
          onLeftPress={() => navigation.goBack()}
        />
        <View style={themed($center)}>
          <Text>Đang tải...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={themed($screen)} preset="scroll">
      <Header
        title={isEditing ? 'Sửa giao dịch' : 'Chi tiết giao dịch'}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightText={isEditing ? 'Hủy' : 'Sửa'}
        onRightPress={() => {
          if (isEditing) {
            loadTransaction(); // Reset changes
          }
          setIsEditing(!isEditing);
        }}
      />

      {isEditing ? (
        <>
          <View style={themed($section)}>
            <TypeToggle
              value={transaction.type}
              onChange={value => updateField('type', value)}
            />
          </View>
          <View style={themed($section)}>
            <TextField
              value={formatAmountDisplay(transaction.amount)}
              onChangeText={text => {
                // Remove all non-digit characters except decimal point
                let cleaned = text.replace(/[^\d.]/g, '');

                // Ensure only one decimal point
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                  cleaned = parts[0] + '.' + parts.slice(1).join('');
                }

                // Prevent leading zeros (except for decimal cases like 0.5)
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
              style={themed($amountInput)}
              inputWrapperStyle={themed($amountInputWrapper)}
            />
            <Text text="VND" style={themed($currency)} />
          </View>

          <View style={themed($section)}>
            <CategoryChips
              categories={categories}
              selectedId={transaction.categoryId}
              onSelect={id => updateField('categoryId', id)}
            />
          </View>

          <View style={themed($section)}>
            <Text preset="subheading" text="Ghi chú" style={themed($label)} />
            <TextField
              value={transaction.note}
              onChangeText={text => updateField('note', text)}
              placeholder="Ghi chú (tùy chọn)"
              multiline={true}
              style={themed($noteInput)}
              inputWrapperStyle={themed($noteInputWrapper)}
              returnKeyType="done"
            />
          </View>

          <View style={themed($section)}>
            <Text preset="subheading" text="Ngày" style={themed($label)} />
            <TouchableOpacity
              style={themed($dateButton)}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text text="📅" style={themed($dateIcon)} />
              <Text
                text={formatDate(transaction.date)}
                style={themed($dateText)}
              />
              <Text text="▼" style={themed($dropdownIcon)} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={themed($viewSection)}>
            <Text
              preset="subheading"
              text="Số tiền"
              style={themed($viewLabel)}
            />
            <Text style={themed($viewAmountText(transaction.type))}>
              {formatAmount(parseFloat(transaction.amount), transaction.type)}
            </Text>
          </View>

          <View style={themed($viewSection)}>
            <Text
              preset="subheading"
              text="Danh mục"
              style={themed($viewLabel)}
            />
            <View style={themed($categoryView)}>
              {categories.find(cat => cat.id === transaction.categoryId) && (
                <>
                  <Text style={themed($categoryIcon)}>
                    {
                      categories.find(cat => cat.id === transaction.categoryId)
                        ?.icon
                    }
                  </Text>
                  <Text style={themed($categoryName)}>
                    {
                      categories.find(cat => cat.id === transaction.categoryId)
                        ?.name
                    }
                  </Text>
                </>
              )}
            </View>
          </View>

          {transaction.note && (
            <View style={themed($viewSection)}>
              <Text
                preset="subheading"
                text="Ghi chú"
                style={themed($viewLabel)}
              />
              <Text style={themed($viewText)}>{transaction.note}</Text>
            </View>
          )}

          <View style={themed($viewSection)}>
            <Text preset="subheading" text="Ngày" style={themed($viewLabel)} />
            <Text style={themed($viewText)}>
              {formatDate(transaction.date)}
            </Text>
          </View>
        </>
      )}

      {isEditing && (
        <View style={themed($actions)}>
          <Button
            text="Lưu"
            preset="filled"
            onPress={handleSave}
            style={themed($saveButton)}
          />
        </View>
      )}

      <View style={themed($actions)}>
        <Button
          text="Xóa giao dịch"
          preset="default"
          onPress={handleDelete}
          style={themed($deleteButton)}
        />
      </View>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={themed($modalOverlay)}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={themed($modalContent)}>
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
              style={themed($datePicker)}
            />

            {Platform.OS === 'ios' && (
              <View style={themed($modalFooter)}>
                <Button
                  text="Hủy"
                  preset="default"
                  onPress={() => setShowDatePicker(false)}
                  style={themed($cancelButton)}
                />
                <Button
                  text="Xong"
                  preset="filled"
                  onPress={() => setShowDatePicker(false)}
                  style={themed($confirmButton)}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
};

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
});

const $center: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
});

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
});

const $amountDisplay: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.xl,
  alignItems: 'center',
  justifyContent: 'center',
});

const $amountText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 28,
  fontWeight: '600',
  color: colors.text,
  fontFamily: typography.primary.semiBold,
});

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
  paddingBottom: spacing.lg,
});

const $saveButton: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
});

const $deleteButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: '100%',
  backgroundColor: colors.palette.angry500,
});

const $viewSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  paddingHorizontal: spacing.md,
});

const $viewLabel: ThemedStyle<TextStyle> = ({
  spacing,
  colors,
  typography,
}) => ({
  marginBottom: spacing.xs,
  fontSize: 14,
  fontWeight: '500',
  color: colors.textDim,
  fontFamily: typography.primary.medium,
});

const $viewText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  color: colors.text,
  fontFamily: typography.primary.normal,
  lineHeight: 24,
});

const $viewAmountText =
  (type: TransactionType): ThemedStyle<TextStyle> =>
  ({ typography }) => ({
    fontSize: 24,
    fontWeight: '600',
    color: type === 'income' ? '#4CAF50' : '#F44336',
    fontFamily: typography.primary.semiBold,
  });

const $categoryView: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
});

const $categoryIcon: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
});

const $categoryName: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  color: colors.text,
  fontFamily: typography.primary.medium,
});

const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
});

const $amountInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: colors.tint,
  paddingVertical: 16,
});

const $amountInput: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: 32,
  fontWeight: '600',
  textAlign: 'center',
  fontFamily: typography.primary.semiBold,
});

const $currency: ThemedStyle<TextStyle> = ({
  colors,
  typography,
  spacing,
}) => ({
  fontSize: 16,
  color: colors.textDim,
  textAlign: 'center',
  marginTop: spacing.xs,
  fontFamily: typography.primary.medium,
});

const $modalOverlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
});

const $modalContent: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  marginHorizontal: spacing.md,
  maxWidth: 400,
  paddingTop: spacing.md,
  width: '90%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
});

const $datePicker: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
});

const $modalFooter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  padding: spacing.md,
  gap: spacing.sm,
});

const $cancelButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
});

const $confirmButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
});

const $dateButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  gap: spacing.sm,
});

const $dateIcon: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
});

const $dateText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  fontSize: 16,
  fontWeight: '500',
  color: colors.text,
  fontFamily: typography.primary.medium,
});

const $dropdownIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
});

const $noteInputWrapper: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  minHeight: 80,
  paddingVertical: spacing.sm,
  alignItems: 'flex-start',
});

const $noteInput: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: 16,
  fontWeight: '400',
  textAlignVertical: 'top',
  fontFamily: typography.primary.normal,
  minHeight: 60,
});
