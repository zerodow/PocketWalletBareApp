import React from 'react';
import { View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface TransactionInfoProps {
  description: string;
  categoryName: string;
  isIncome: boolean;
}

export const TransactionInfo: React.FC<TransactionInfoProps> = ({
  description,
  categoryName,
  isIncome,
}) => {
  const styles = useStyles();

  const getDisplayText = () => {
    if (description && description.trim()) {
      return description;
    }
    // Fallback text based on transaction type
    return isIncome
      ? translate('categoryListScreen.income')
      : translate('categoryListScreen.expense');
  };

  const hasDescription = description && description.trim();

  return (
    <View style={styles.container}>
      <TextView
        text={getDisplayText()}
        size="body"
        family="semiBold"
        color={
          hasDescription
            ? styles.description.color
            : styles.placeholderText.color
        }
        style={hasDescription ? undefined : styles.placeholderItalic}
      />
      <TextView
        text={categoryName}
        size="caption"
        color={styles.category.color}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  description: {
    color: theme.colors.onSurface,
  },
  placeholderText: {
    color: theme.colors.palette.neutral600,
  },
  placeholderItalic: {
    fontStyle: 'italic',
  },
  category: {
    color: theme.colors.palette.neutral600,
  },
}));
