import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface WarningModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText: string;
  proceedText: string;
  onCancel: () => void;
  onProceed: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
  visible,
  title,
  message,
  cancelText,
  proceedText,
  onCancel,
  onProceed,
}) => {
  const styles = useStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalWrapper}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onCancel}
        />
        <View style={styles.modalContent}>
          <TextView size="title" weight="semiBold" style={styles.modalTitle}>
            {title}
          </TextView>
          <TextView size="body" style={styles.modalMessage}>
            {message}
          </TextView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <TextView size="body" weight="semiBold">
                {cancelText}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={onProceed}
              activeOpacity={0.8}
            >
              <TextView
                size="body"
                weight="semiBold"
                color={styles.modalPrimaryText.color}
              >
                {proceedText}
              </TextView>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    width: '90%',
    maxWidth: 420,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    color: theme.colors.textDim,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  modalButtonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalPrimaryText: {
    color: theme.colors.onPrimary,
  },
}));
