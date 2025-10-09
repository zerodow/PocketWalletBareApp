import React from 'react';
import { TouchableOpacity } from 'react-native';
import { makeStyles } from '@/utils/makeStyles';
import { CategoryIcon } from './CategoryIcon';
import { TransactionInfo } from './TransactionInfo';
import { TransactionAmount } from './TransactionAmount';

export interface TransactionItemProps {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon?: string;
  onPress: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  description,
  amount,
  date,
  categoryName,
  categoryColor,
  categoryIcon,
  onPress,
}) => {
  const styles = useStyles();
  const isIncome = amount > 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <CategoryIcon icon={categoryIcon} color={categoryColor} />
      <TransactionInfo
        description={description}
        categoryName={categoryName}
        isIncome={isIncome}
      />
      <TransactionAmount amount={amount} isIncome={isIncome} date={date} />
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral400,
    shadowColor: theme.colors.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
}));

export * from './CategoryIcon';
export * from './TransactionInfo';
export * from './TransactionAmount';
