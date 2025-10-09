import { View, TouchableOpacity, Alert } from 'react-native';
import {
  ScaleDecorator,
  OpacityDecorator,
} from 'react-native-draggable-flatlist';

import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import Category from '@/database/models/Category';

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  drag: () => void;
  isActive: boolean;
}

export const CategoryItem = ({
  category,
  onEdit,
  onDelete,
  drag,
  isActive,
}: CategoryItemProps) => {
  const styles = useStyles();

  const handleDelete = () => {
    if (category.isDefault) {
      Alert.alert(
        translate('categoryListScreen.cannotDelete'),
        translate('categoryListScreen.cannotDeleteDefault'),
      );
      return;
    }

    Alert.alert(
      translate('categoryListScreen.deleteTitle'),
      translate('categoryListScreen.deleteMessage', { name: category.name }),
      [
        { text: translate('common.cancel'), style: 'cancel' },
        {
          text: translate('categoryListScreen.deleteTitle'),
          style: 'destructive',
          onPress: () => onDelete(category),
        },
      ],
    );
  };

  return (
    <ScaleDecorator>
      <OpacityDecorator activeOpacity={0.8}>
        <TouchableOpacity
          style={[styles.categoryItem, isActive && styles.categoryItemActive]}
          onPress={() => onEdit(category)}
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor: category.color + '20',
                  borderColor: category.color,
                },
              ]}
            >
              <TextView text={category.icon} size="title" />
            </View>

            <View style={styles.categoryInfo}>
              <View style={styles.categoryHeader}>
                <TextView
                  text={category.name}
                  size="body"
                  family="semiBold"
                  style={styles.categoryName}
                />
                {category.isDefault && (
                  <View style={styles.defaultBadge}>
                    <TextView
                      tx="categoryListScreen.defaultBadge"
                      size="caption"
                      family="medium"
                      color={styles.defaultBadgeText.color}
                    />
                  </View>
                )}
              </View>
              <TextView
                text={
                  category.isIncome
                    ? translate('categoryListScreen.income')
                    : translate('categoryListScreen.expense')
                }
                size="caption"
                family="medium"
                color={
                  category.isIncome
                    ? styles.categoryTypeIncome.color
                    : styles.categoryTypeExpense.color
                }
              />
            </View>

            <View style={styles.categoryActions}>
              {!category.isDefault && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon
                    icon="trash-outline"
                    size={20}
                    color={styles.deleteIcon.color}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.dragHandle}
                onLongPress={drag}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  icon="reorder-two-outline"
                  size={20}
                  color={styles.dragIcon.color}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </OpacityDecorator>
    </ScaleDecorator>
  );
};

const useStyles = makeStyles(theme => ({
  categoryItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral400,
    shadowColor: theme.colors.onBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItemActive: {
    backgroundColor: theme.colors.palette.neutral300,
    borderColor: theme.colors.primary,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xxs,
  },
  categoryName: {
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary + '30',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.primary + '50',
  },
  defaultBadgeText: {
    color: theme.colors.primary,
  },
  categoryTypeIncome: {
    color: theme.colors.success,
  },
  categoryTypeExpense: {
    color: theme.colors.error,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  deleteButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  deleteIcon: {
    color: theme.colors.error,
  },
  dragHandle: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  dragIcon: {
    color: theme.colors.palette.neutral600,
  },
}));
