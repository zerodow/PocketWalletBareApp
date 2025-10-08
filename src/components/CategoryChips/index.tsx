import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import { makeStyles } from '@/utils/makeStyles';
import { TextView } from '@/components/TextView';
import Category from '@/database/models/Category';
import { translate } from '@/i18n/translate';

export interface CategoryChipsProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (categoryId: string) => void;
  onShowMore?: () => void;
  disabled?: boolean;
}

export const CategoryChips = ({
  categories,
  selectedId,
  onSelect,
  onShowMore,
  disabled = false,
}: CategoryChipsProps) => {
  const styles = useStyles();

  const displayCategories = categories.slice(0, 8);
  const hasMore = categories.length > 8;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {displayCategories.map(category => {
        const isSelected = category.id === selectedId;
        return (
          <Pressable
            key={category.id}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              disabled && styles.chipDisabled,
            ]}
            onPress={() => !disabled && onSelect(category.id)}
            disabled={disabled}
          >
            <TextView text={category.icon} size="title" style={styles.icon} />
            <TextView
              text={category.name}
              size="caption"
              family={isSelected ? 'semiBold' : 'regular'}
              color={isSelected ? styles.selectedText.color : styles.text.color}
              numberOfLines={1}
            />
          </Pressable>
        );
      })}

      {hasMore && onShowMore && (
        <Pressable
          style={[
            styles.chip,
            styles.showMoreChip,
            disabled && styles.chipDisabled,
          ]}
          onPress={onShowMore}
          disabled={disabled}
        >
          <TextView text="+" size="title" style={styles.icon} />
          <TextView
            text={translate('quickAddScreen.showMore')}
            size="caption"
            family="medium"
            color={styles.showMoreText.color}
            numberOfLines={1}
          />
        </Pressable>
      )}
    </ScrollView>
  );
};

const useStyles = makeStyles(theme => ({
  scrollContent: {
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    gap: theme.spacing.xxs,
  },
  chipSelected: {
    backgroundColor: theme.colors.palette.primary200,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  showMoreChip: {
    borderStyle: 'dashed',
  },
  icon: {
    marginBottom: theme.spacing.xxs,
  },
  text: {
    color: theme.colors.onSurface,
  },
  selectedText: {
    color: theme.colors.palette.primary900,
  },
  showMoreText: {
    color: theme.colors.primary,
  },
}));
