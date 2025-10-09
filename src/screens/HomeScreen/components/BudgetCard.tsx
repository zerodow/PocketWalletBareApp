import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { TextView, Icon, WarningModal } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface BudgetData {
  spent: number;
  total: number;
  dailyBudget: number;
  daysLeft: number;
}

interface BudgetCardProps {
  budgetData: BudgetData | null;
  onSetBudget?: () => void;
}

export const BudgetCard = ({ budgetData, onSetBudget }: BudgetCardProps) => {
  const styles = useStyles();
  const [showEditWarning, setShowEditWarning] = useState(false);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetProgress = () => {
    if (!budgetData) return 0;
    return (budgetData.spent / budgetData.total) * 100;
  };

  const getProgressBarColor = () => {
    const progress = getBudgetProgress();
    if (progress >= 90) return styles.progressBarDanger.backgroundColor;
    if (progress >= 70) return styles.progressBarWarning.backgroundColor;
    return styles.progressBar.backgroundColor;
  };

  // Empty State - No Budget Set
  if (!budgetData) {
    return (
      <View style={styles.budgetCard}>
        <TextView size="title" weight="semiBold" style={styles.budgetTitle}>
          {format(new Date(), 'MMMM yyyy')} {translate('homeScreen.budget')}
        </TextView>

        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon
              icon="wallet-outline"
              size={40}
              color={styles.emptyIcon.color}
            />
          </View>

          <TextView size="body" weight="medium" style={styles.emptyTitle}>
            {translate('homeScreen.noBudgetSet')}
          </TextView>

          <TextView size="caption" style={styles.emptyDescription}>
            {translate('homeScreen.setBudgetPrompt')}
          </TextView>

          {onSetBudget && (
            <TouchableOpacity
              style={styles.setBudgetButton}
              onPress={onSetBudget}
              activeOpacity={0.8}
            >
              <TextView
                size="body"
                weight="semiBold"
                style={styles.setBudgetButtonText}
              >
                {translate('homeScreen.setBudgetButton')}
              </TextView>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Active State - Budget Exists
  const savings = budgetData.total - budgetData.spent;
  const isOverBudget = budgetData.spent > budgetData.total;

  return (
    <View style={styles.budgetCard}>
      <View style={styles.headerRow}>
        <TextView size="title" weight="semiBold" style={styles.budgetTitle}>
          {format(new Date(), 'MMMM yyyy')} {translate('homeScreen.budget')}
        </TextView>
        {onSetBudget && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditWarning(true)}
            activeOpacity={0.8}
          >
            <TextView
              size="body"
              weight="semiBold"
              style={styles.editButtonText}
            >
              {translate('homeScreen.editBudget')}
            </TextView>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.budgetRow}>
        <TextView size="heading" weight="bold" style={styles.budgetAmount}>
          {formatAmount(budgetData.spent)}
        </TextView>
        <TextView size="body" style={styles.budgetTotal}>
          / {formatAmount(budgetData.total)}
        </TextView>
        <TextView
          size="body"
          weight="semiBold"
          style={
            getBudgetProgress() >= 90
              ? [styles.budgetPercentage, styles.percentageDanger]
              : styles.budgetPercentage
          }
        >
          {Math.round(getBudgetProgress())}%
        </TextView>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(getBudgetProgress(), 100)}%`,
              backgroundColor: getProgressBarColor(),
            },
          ]}
        />
      </View>

      <View style={styles.budgetDetails}>
        <View style={styles.budgetDetailItem}>
          <TextView size="caption" style={styles.budgetDetailLabel}>
            {translate('homeScreen.dailyBudget')}
          </TextView>
          <TextView
            size="body"
            weight="semiBold"
            style={styles.budgetDetailValue}
          >
            {formatAmount(budgetData.dailyBudget)}
          </TextView>
        </View>

        <View style={styles.budgetDetailItem}>
          <TextView size="caption" style={styles.budgetDetailLabel}>
            {isOverBudget
              ? translate('homeScreen.overBudget')
              : translate('homeScreen.savings')}
          </TextView>
          <TextView
            size="body"
            weight="semiBold"
            style={[
              styles.budgetDetailValue,
              isOverBudget ? styles.savingsDanger : styles.savingsSuccess,
            ]}
          >
            {formatAmount(Math.abs(savings))}
          </TextView>
        </View>

        <View style={styles.budgetDetailItem}>
          <TextView size="caption" style={styles.budgetDetailLabel}>
            {translate('homeScreen.daysLeft')}
          </TextView>
          <TextView
            size="body"
            weight="semiBold"
            style={styles.budgetDetailValue}
          >
            {budgetData.daysLeft}
          </TextView>
        </View>
      </View>

      {/* Edit Warning Modal */}
      {onSetBudget && (
        <WarningModal
          visible={showEditWarning}
          title={translate('homeScreen.editBudgetWarningTitle')}
          message={translate('homeScreen.editBudgetWarningMessage')}
          cancelText={translate('common.cancel')}
          proceedText={translate('homeScreen.editBudgetProceed')}
          onCancel={() => setShowEditWarning(false)}
          onProceed={() => {
            setShowEditWarning(false);
            onSetBudget?.();
          }}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  budgetCard: {
    backgroundColor: theme.isDark
      ? theme.colors.background
      : theme.colors.onPrimary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    ...(theme.isDark && {
      borderWidth: 1,
      borderColor: theme.colors.border,
    }),
  },

  budgetTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  // Active State Styles
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
  },

  budgetAmount: {
    color: theme.colors.tint,
  },

  budgetTotal: {
    color: theme.colors.textDim,
    marginLeft: theme.spacing.xxs,
  },

  budgetPercentage: {
    color: theme.colors.text,
    marginLeft: 'auto',
  },

  percentageDanger: {
    color: theme.colors.error,
  },

  editButton: {
    backgroundColor: theme.isDark
      ? theme.colors.surface
      : theme.colors.onPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },

  editButtonText: {
    color: theme.colors.tint,
  },

  progressBarContainer: {
    height: theme.spacing.xs - theme.spacing.xxxs,
    backgroundColor: theme.colors.border,
    borderRadius: theme.spacing.xxxs + 1,
    marginBottom: theme.spacing.md,
  },

  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: theme.spacing.xxxs + 1,
  },

  progressBarWarning: {
    backgroundColor: theme.colors.warning,
  },

  progressBarDanger: {
    backgroundColor: theme.colors.error,
  },

  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  budgetDetailItem: {
    flex: 1,
    alignItems: 'center',
  },

  budgetDetailLabel: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.xxxs,
  },

  budgetDetailValue: {
    color: theme.colors.text,
  },

  savingsSuccess: {
    color: theme.colors.success,
  },

  savingsDanger: {
    color: theme.colors.error,
  },

  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },

  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  emptyIcon: {
    color: theme.colors.textDim,
  },

  emptyTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },

  emptyDescription: {
    color: theme.colors.textDim,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },

  setBudgetButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },

  setBudgetButtonText: {
    color: theme.colors.onPrimary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    width: '100%',
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
