import React from 'react';
import { View, Pressable } from 'react-native';
import { makeStyles } from '@/utils/makeStyles';
import { TextView } from '@/components/TextView';
import { TransactionType } from '@/types';
import { translate } from '@/i18n/translate';

export interface TypeToggleProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
}

export const TypeToggle = ({
  value,
  onChange,
  disabled = false,
}: TypeToggleProps) => {
  const styles = useStyles();

  const handlePress = (type: TransactionType) => {
    if (!disabled && type !== value) {
      onChange(type);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          styles.leftButton,
          value === 'expense' && styles.activeButton,
          value === 'expense' && styles.activeExpense,
          disabled && styles.disabledButton,
        ]}
        onPress={() => handlePress('expense')}
        disabled={disabled}
      >
        <TextView
          text={translate('quickAddScreen.expense')}
          size="body"
          family="semiBold"
          color={
            value === 'expense'
              ? styles.activeText.color
              : styles.inactiveText.color
          }
        />
      </Pressable>

      <Pressable
        style={[
          styles.button,
          styles.rightButton,
          value === 'income' && styles.activeButton,
          value === 'income' && styles.activeIncome,
          disabled && styles.disabledButton,
        ]}
        onPress={() => handlePress('income')}
        disabled={disabled}
      >
        <TextView
          text={translate('quickAddScreen.income')}
          size="body"
          family="semiBold"
          color={
            value === 'income'
              ? styles.activeText.color
              : styles.inactiveText.color
          }
        />
      </Pressable>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
  },
  leftButton: {
    marginRight: 2,
  },
  rightButton: {
    marginLeft: 2,
  },
  activeButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeExpense: {
    backgroundColor: theme.colors.error,
  },
  activeIncome: {
    backgroundColor: theme.colors.success,
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: theme.colors.onSurfaceVariant,
  },
  disabledButton: {
    opacity: 0.5,
  },
}));
