import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import numeral from 'numeral';
import { TextView, BaseButton, InputField } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface BudgetInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  initialAmount?: number;
}

export const BudgetInputModal = ({
  visible,
  onClose,
  onSave,
  initialAmount,
}: BudgetInputModalProps) => {
  const styles = useStyles();
  const [amount, setAmount] = useState(
    initialAmount ? initialAmount.toString() : '',
  );
  const [error, setError] = useState('');

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
    onSave(numericAmount * 100);
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
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
                    <TextView size="body" weight="medium" style={styles.currency}>
                      VND
                    </TextView>
                  </View>
                  {error ? (
                    <TextView size="caption" style={styles.errorText}>
                      {error}
                    </TextView>
                  ) : null}
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
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
