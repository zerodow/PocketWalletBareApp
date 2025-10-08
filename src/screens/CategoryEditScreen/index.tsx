import { useEffect, useState } from 'react';
import {
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';

import {
  SafeAreaWrapper,
  TextView,
  InputField,
  BaseButton,
  ColorPicker,
  EmojiPicker,
} from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { MainStackScreenProps } from '@/navigator/types';
import { useCategoryStore } from '@/store/categoryStore';

// Predefined colors for categories
const CATEGORY_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#FF7675', // Light Red
  '#A29BFE', // Purple
  '#6C5CE7', // Dark Purple
  '#FD79A8', // Pink
  '#FDCB6E', // Orange
  '#74B9FF', // Light Blue
  '#636E72', // Gray
  '#00B894', // Success Green
  '#00CEC9', // Cyan
  '#E17055', // Brown
];

// Predefined emojis for categories
const CATEGORY_EMOJIS = [
  '🍔',
  '🚗',
  '🛒',
  '🏠',
  '⚡',
  '🏥',
  '🎬',
  '📚',
  '👕',
  '📋',
  '💰',
  '🎉',
  '📈',
  '🎁',
  '💵',
  '✈️',
  '🎯',
  '🏋️',
  '🍕',
  '☕',
  '🚌',
  '🛍️',
  '💊',
  '📱',
  '💻',
  '🎵',
  '🍺',
  '🥗',
  '🚖',
  '⛽',
  '🎪',
  '🏦',
  '💳',
  '📊',
  '🍰',
  '🎮',
  '📷',
  '🏃',
  '🌟',
  '🎨',
];

type CategoryEditScreenProps = MainStackScreenProps<'CategoryEdit'>;

const CategoryEditScreen = ({ navigation, route }: CategoryEditScreenProps) => {
  const styles = useStyles();
  const { categories, addCategory, updateCategory, loading } =
    useCategoryStore();

  const { categoryId, isIncome } = route.params;
  const isEditing = !!categoryId;
  const existingCategory = isEditing
    ? categories.find(c => c.id === categoryId)
    : null;

  const [name, setName] = useState(existingCategory?.name || '');
  const [selectedColor, setSelectedColor] = useState(
    existingCategory?.color || CATEGORY_COLORS[0],
  );
  const [selectedEmoji, setSelectedEmoji] = useState(
    existingCategory?.icon || CATEGORY_EMOJIS[0],
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && existingCategory) {
      setName(existingCategory.name);
      setSelectedColor(existingCategory.color);
      setSelectedEmoji(existingCategory.icon);
    }
  }, [isEditing, existingCategory]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert(
        translate('categoryEditScreen.errorTitle'),
        translate('categoryEditScreen.nameRequired'),
      );
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert(
        translate('categoryEditScreen.errorTitle'),
        translate('categoryEditScreen.nameTooShort'),
      );
      return false;
    }

    if (name.trim().length > 50) {
      Alert.alert(
        translate('categoryEditScreen.errorTitle'),
        translate('categoryEditScreen.nameTooLong'),
      );
      return false;
    }

    // Check for duplicate names (excluding current category when editing)
    const duplicateCategory = categories.find(
      c =>
        c.name.toLowerCase() === name.trim().toLowerCase() &&
        c.isIncome === isIncome &&
        c.id !== categoryId,
    );

    if (duplicateCategory) {
      Alert.alert(
        translate('categoryEditScreen.errorTitle'),
        translate('categoryEditScreen.nameDuplicate'),
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (isEditing && categoryId) {
        await updateCategory(categoryId, {
          name: name.trim(),
          icon: selectedEmoji,
          color: selectedColor,
        });
        Toast.show({
          type: 'success',
          text1: translate('categoryEditScreen.successTitle'),
          text2: translate('categoryEditScreen.categoryUpdated'),
        });
      } else {
        await addCategory({
          name: name.trim(),
          icon: selectedEmoji,
          color: selectedColor,
          isIncome,
        });
        Toast.show({
          type: 'success',
          text1: translate('categoryEditScreen.successTitle'),
          text2: translate('categoryEditScreen.categoryAdded'),
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert(
        translate('categoryEditScreen.errorTitle'),
        translate('categoryEditScreen.saveFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const title = isEditing
    ? translate('categoryEditScreen.titleEdit')
    : translate('categoryEditScreen.titleAdd');
  const saveButtonText = isEditing
    ? translate('categoryEditScreen.update')
    : translate('categoryEditScreen.add');

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.headerButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <TextView
              text="←"
              size="heading"
              color={styles.headerButtonText.color}
            />
          </TouchableOpacity>
          <TextView text={title} size="heading" family="bold" />
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.headerButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <TextView
              tx="categoryEditScreen.cancel"
              size="body"
              color={styles.headerButtonText.color}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Preview */}
          <View style={styles.section}>
            <TextView
              tx="categoryEditScreen.previewSection"
              size="title"
              family="semiBold"
              style={styles.sectionTitle}
            />
            <View style={styles.preview}>
              <View
                style={[
                  styles.previewIcon,
                  {
                    backgroundColor: selectedColor + '20',
                    borderColor: selectedColor,
                  },
                ]}
              >
                <TextView text={selectedEmoji} size="heading" />
              </View>
              <View style={styles.previewInfo}>
                <TextView
                  text={
                    name.trim() ||
                    translate('categoryEditScreen.namePlaceholder')
                  }
                  size="title"
                  family="semiBold"
                  color={
                    name.trim()
                      ? styles.previewName.color
                      : styles.previewNamePlaceholder.color
                  }
                  style={styles.previewName}
                />
                <TextView
                  text={
                    isIncome
                      ? translate('categoryEditScreen.typeIncome')
                      : translate('categoryEditScreen.typeExpense')
                  }
                  size="body"
                  family="medium"
                  color={
                    isIncome
                      ? styles.previewTypeIncome.color
                      : styles.previewTypeExpense.color
                  }
                />
              </View>
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <TextView
              tx="categoryEditScreen.nameSection"
              size="title"
              family="semiBold"
              style={styles.sectionTitle}
            />
            <InputField
              value={name}
              onClear={() => setName('')}
              showClear={name.length > 0}
              placeholder={translate('categoryEditScreen.namePlaceholderInput')}
              maxLength={50}
              autoCapitalize="words"
              returnKeyType="done"
              onChangeText={setName}
            />
            <TextView
              text={translate('categoryEditScreen.characterCount', {
                count: name.length,
              })}
              size="caption"
              color={styles.characterCount.color}
              style={styles.characterCount}
            />
          </View>

          {/* Emoji Selector */}
          <View style={styles.section}>
            <TextView
              tx="categoryEditScreen.iconSection"
              size="title"
              family="semiBold"
              style={styles.sectionTitle}
            />
            <EmojiPicker
              emojis={CATEGORY_EMOJIS}
              selectedEmoji={selectedEmoji}
              onEmojiSelect={setSelectedEmoji}
            />
          </View>

          {/* Color Selector */}
          <View style={styles.section}>
            <TextView
              tx="categoryEditScreen.colorSection"
              size="title"
              family="semiBold"
              style={styles.sectionTitle}
            />
            <ColorPicker
              colors={CATEGORY_COLORS}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </View>

          {/* Save Button */}
          <View style={styles.actions}>
            <BaseButton
              text={saveButtonText}
              variant="filled"
              size="large"
              onPress={handleSave}
              disabled={saving || loading}
              loading={saving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CategoryEditScreen;

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: theme.spacing.md,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  previewNamePlaceholder: {
    color: theme.colors.outline,
  },
  previewTypeIncome: {
    color: theme.colors.success,
  },
  previewTypeExpense: {
    color: theme.colors.error,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: theme.spacing.xs,
    color: theme.colors.outline,
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  saveButton: {
    width: '100%',
  },
}));
