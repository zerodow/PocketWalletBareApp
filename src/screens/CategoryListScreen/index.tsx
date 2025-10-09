import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

import { SafeAreaWrapper, TextView, BaseButton } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { MainStackScreenProps } from '@/navigator/types';
import { useCategoryStore } from '@/store/categoryStore';
import Category from '@/database/models/Category';
import { CategoryItem } from './CategoryItem';

type CategoryListScreenProps = MainStackScreenProps<'CategoryList'>;

const CategoryListScreen = ({ navigation }: CategoryListScreenProps) => {
  const styles = useStyles();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    reorderCategories,
    deleteCategory,
  } = useCategoryStore();
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(category =>
    activeTab === 'expense' ? !category.isIncome : category.isIncome,
  );

  const handleAddCategory = () => {
    navigation.navigate('CategoryEdit', { isIncome: activeTab === 'income' });
  };

  const handleEditCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert(
        translate('categoryListScreen.cannotEdit'),
        translate('categoryListScreen.cannotEditDefault'),
      );
      return;
    }
    navigation.navigate('CategoryEdit', {
      categoryId: category.id,
      isIncome: category.isIncome,
    });
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await deleteCategory(category.id);
    } catch (err) {
      console.error('Error deleting category:', err);
      Alert.alert(
        translate('categoryListScreen.error'),
        translate('categoryListScreen.deleteError'),
      );
    }
  };

  const handleReorder = async (data: Category[]) => {
    try {
      await reorderCategories(data);
    } catch (err) {
      console.error('Error reordering categories:', err);
      Alert.alert(
        translate('categoryListScreen.error'),
        translate('categoryListScreen.reorderError'),
      );
      // Refresh to revert changes
      fetchCategories();
    }
  };

  const renderCategory = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Category>) => (
    <CategoryItem
      category={item}
      onEdit={handleEditCategory}
      onDelete={handleDeleteCategory}
      drag={drag}
      isActive={isActive}
    />
  );

  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TextView
                text="←"
                size="heading"
                color={styles.headerButtonText.color}
              />
            </TouchableOpacity>
            <TextView
              tx="categoryListScreen.title"
              size="heading"
              family="bold"
            />
            <View style={styles.headerButton} />
          </View>

          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color={styles.loadingIndicator.color}
            />
            <TextView
              tx="categoryListScreen.loading"
              size="body"
              color={styles.loadingText.color}
            />
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TextView
                text="←"
                size="heading"
                color={styles.headerButtonText.color}
              />
            </TouchableOpacity>
            <TextView
              tx="categoryListScreen.title"
              size="heading"
              family="bold"
            />
            <View style={styles.headerButton} />
          </View>

          <View style={styles.error}>
            <TextView
              text={`${translate('categoryListScreen.error')}: ${error}`}
              size="body"
              color={styles.errorText.color}
              style={styles.errorTextCenter}
            />
            <BaseButton
              tx="categoryListScreen.retry"
              onPress={fetchCategories}
              variant="outlined"
              style={styles.retryButton}
            />
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <TextView
              text="←"
              size="heading"
              color={styles.headerButtonText.color}
            />
          </TouchableOpacity>
          <TextView
            tx="categoryListScreen.title"
            size="heading"
            family="bold"
          />
          <TouchableOpacity
            onPress={handleAddCategory}
            style={styles.headerButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <TextView
              tx="categoryListScreen.add"
              size="body"
              color={styles.headerButtonText.color}
            />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              styles.leftTab,
              activeTab === 'expense' && styles.tabActive,
              activeTab === 'expense' && styles.tabActiveExpense,
            ]}
            onPress={() => setActiveTab('expense')}
          >
            <TextView
              tx="categoryListScreen.expense"
              size="body"
              family="semiBold"
              color={
                activeTab === 'expense'
                  ? styles.tabTextActive.color
                  : styles.tabTextInactive.color
              }
            />
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              styles.rightTab,
              activeTab === 'income' && styles.tabActive,
              activeTab === 'income' && styles.tabActiveIncome,
            ]}
            onPress={() => setActiveTab('income')}
          >
            <TextView
              tx="categoryListScreen.income"
              size="body"
              family="semiBold"
              color={
                activeTab === 'income'
                  ? styles.tabTextActive.color
                  : styles.tabTextInactive.color
              }
            />
          </Pressable>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {filteredCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <TextView
                tx="categoryListScreen.emptyIcon"
                style={styles.emptyIcon}
              />
              <TextView
                tx="categoryListScreen.emptyTitle"
                size="title"
                family="semiBold"
                style={styles.emptyTitle}
              />
              <TextView
                tx="categoryListScreen.emptyDescription"
                size="body"
                color={styles.emptyDescription.color}
                align="center"
              />
              <BaseButton
                tx="categoryListScreen.addButton"
                onPress={handleAddCategory}
                variant="filled"
                style={styles.addButton}
              />
            </View>
          ) : (
            <DraggableFlatList
              data={filteredCategories}
              onDragEnd={({ data }) => handleReorder(data)}
              keyExtractor={item => item.id}
              renderItem={renderCategory}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default CategoryListScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    color: theme.colors.primary,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingIndicator: {
    color: theme.colors.primary,
  },
  loadingText: {
    color: theme.colors.outline,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
  },
  errorTextCenter: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.palette.neutral200,
    borderRadius: theme.radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.palette.neutral400,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
  },
  leftTab: {
    marginRight: 2,
  },
  rightTab: {
    marginLeft: 2,
  },
  tabActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabActiveExpense: {
    backgroundColor: theme.colors.error,
  },
  tabActiveIncome: {
    backgroundColor: theme.colors.success,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: theme.colors.palette.neutral600,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    color: theme.colors.outline,
  },
  addButton: {
    marginTop: theme.spacing.md,
  },
}));
