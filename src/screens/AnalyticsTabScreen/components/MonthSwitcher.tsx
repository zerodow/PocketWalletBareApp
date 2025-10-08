import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MonthSwitcherProps {
  selectedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isCurrentMonth: boolean;
}

export const MonthSwitcher = ({
  selectedMonth,
  onPreviousMonth,
  onNextMonth,
  isCurrentMonth,
}: MonthSwitcherProps) => {
  const styles = useStyles();

  const monthYear = format(selectedMonth, 'MMMM yyyy', { locale: vi });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onPreviousMonth}
        activeOpacity={0.7}
      >
        <Icon icon="chevron-back" size={20} color={styles.arrowIcon.color} />
      </TouchableOpacity>

      <View style={styles.monthContainer}>
        <TextView size="title" family="semiBold" style={styles.monthText}>
          {monthYear}
        </TextView>
        {isCurrentMonth && <View style={styles.currentMonthIndicator} />}
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onNextMonth}
        activeOpacity={0.7}
      >
        <Icon icon="chevron-forward" size={20} color={styles.arrowIcon.color} />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  arrowIcon: {
    color: theme.colors.onSurface,
  } as any,
  monthContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  monthText: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  currentMonthIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
}));
