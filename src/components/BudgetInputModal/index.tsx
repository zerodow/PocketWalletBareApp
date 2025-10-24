// React
import React, { useState, useRef, useEffect } from 'react';

// React Native
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  Pressable,
  StyleSheet,
} from 'react-native';

// Third-party
import numeral from 'numeral';

// Components
import { TextView, InputField } from '@/components';

// Utilities
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

const ITEM_WIDTH = 60;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BudgetInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number, resetDay: number) => void;
  initialAmount?: number;
  initialResetDay?: number;
}

export const BudgetInputModal = ({
  visible,
  onClose,
  onSave,
  initialAmount,
  initialResetDay,
}: BudgetInputModalProps) => {
  const styles = useStyles();
  const flatListRef = useRef<FlatList>(null);
  const [amount, setAmount] = useState(
    initialAmount ? initialAmount.toString() : '',
  );
  const [resetDay, setResetDay] = useState(initialResetDay || 1);
  const [error, setError] = useState('');

  // Days array for the picker
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Scroll to selected day when modal opens or resetDay changes
  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: resetDay - 1,
          animated: true,
        });
      }, 100);
    }
  }, [visible, resetDay]);

  const handleAmountChange = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9]/g, '');
    setAmount(cleaned);
    setError('');
  };

  const formatAmountDisplay = (value: string) => {
    if (!value) return '';
    const numericValue = parseFloat(value);
    return numeral(numericValue).format('0,0');
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amount);

    if (!amount || numericAmount <= 0) {
      setError(translate('homeScreen.budgetAmountRequired'));
      return;
    }

    // Convert to minor units (multiply by 100 for VND)
    onSave(numericAmount * 100, resetDay);
    setAmount('');
    setResetDay(1);
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  // Handle scroll end to update selected day
  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    const newDay = Math.max(1, Math.min(31, index + 1));
    if (newDay !== resetDay) {
      setResetDay(newDay);
    }
  };

  // Render individual day item
  const renderDayItem = ({
    item,
    index: _index,
  }: {
    item: number;
    index: number;
  }) => {
    const isSelected = item === resetDay;
    return (
      <View style={styles.dayItemContainer}>
        <View style={[styles.dayItem, isSelected && styles.dayItemSelected]}>
          <TextView
            size={isSelected ? 'heading' : 'body'}
            weight={isSelected ? 'bold' : 'medium'}
            style={[
              styles.dayItemText,
              ...(isSelected ? [styles.dayItemTextSelected] : []),
            ]}
          >
            {item}
          </TextView>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop pressable to close modal without intercepting inner scroll gestures */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ScrollView
            style={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {/* Header */}
            <View style={styles.header}>
              <TextView size="title" weight="bold" style={styles.title}>
                {translate('homeScreen.budgetModalTitle')}
              </TextView>
              <TextView size="body" style={styles.description}>
                {translate('homeScreen.budgetModalDescription')}
              </TextView>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <TextView size="body" weight="medium" style={styles.label}>
                {translate('homeScreen.budgetAmountLabel')}
              </TextView>
              <View style={styles.inputWrapper}>
                <InputField
                  value={formatAmountDisplay(amount)}
                  onChangeText={handleAmountChange}
                  placeholder={translate('homeScreen.budgetAmountPlaceholder')}
                  keyboardType="numeric"
                  autoFocus
                  maxLength={15}
                  style={styles.input}
                />
                {/* <TextView size="body" weight="medium" style={styles.currency}>
                  VND
                </TextView> */}
              </View>
              {error ? (
                <TextView size="caption" style={styles.errorText}>
                  {error}
                </TextView>
              ) : null}
            </View>

            {/* Reset Day Section */}
            <View style={styles.resetDaySection}>
              <TextView size="body" weight="medium" style={styles.label}>
                {translate('homeScreen.budgetResetDayLabel')}
              </TextView>
              <TextView size="caption" style={styles.resetDayDescription}>
                {translate('homeScreen.budgetResetDayDescription')}
              </TextView>

              {/* Horizontal Day Picker */}
              <View style={styles.pickerContainer}>
                {/* Center indicator overlay */}
                <View style={styles.centerIndicator} pointerEvents="none">
                  <View style={styles.centerHighlight} />
                </View>

                <FlatList
                  ref={flatListRef}
                  data={days}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={ITEM_WIDTH}
                  decelerationRate="fast"
                  onMomentumScrollEnd={handleScrollEnd}
                  renderItem={renderDayItem}
                  keyExtractor={item => item.toString()}
                  contentContainerStyle={styles.pickerContent}
                  nestedScrollEnabled
                  getItemLayout={(data, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                  })}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <TextView
                  size="body"
                  weight="semiBold"
                  style={styles.cancelButtonText}
                >
                  {translate('common.cancel')}
                </TextView>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <TextView
                  size="body"
                  weight="semiBold"
                  style={styles.saveButtonText}
                >
                  {translate('homeScreen.saveBudget')}
                </TextView>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.scrim,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },

  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },

  header: {
    marginBottom: theme.spacing.lg,
  },

  title: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },

  description: {
    color: theme.colors.textDim,
  },

  inputSection: {
    marginBottom: theme.spacing.lg,
  },

  resetDaySection: {
    marginBottom: theme.spacing.lg,
  },

  resetDayDescription: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xxs,
  },

  pickerContainer: {
    height: 80,
    marginTop: theme.spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },

  pickerContent: {
    paddingHorizontal: (SCREEN_WIDTH * 0.9 - 32) / 2 - ITEM_WIDTH / 2, // Center first and last items
    alignItems: 'center',
  },

  centerIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  centerHighlight: {
    width: ITEM_WIDTH + 8,
    height: 60,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
  },

  dayItemContainer: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },

  dayItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_WIDTH - 8,
    height: 50,
  },

  dayItemSelected: {
    // Selected style handled by centerHighlight
  },

  dayItemText: {
    color: theme.colors.textDim,
  },

  dayItemTextSelected: {
    color: theme.colors.primary,
  },

  label: {
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  input: {
    flex: 1,
  },

  currency: {
    color: theme.colors.textDim,
  },

  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: theme.colors.border,
  },

  cancelButtonText: {
    color: theme.colors.text,
  },

  saveButton: {
    backgroundColor: theme.colors.primary,
  },

  saveButtonText: {
    color: theme.colors.onPrimary,
  },
}));
