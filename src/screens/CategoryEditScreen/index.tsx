import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface CategoryEditScreenProps {
  route?: {
    params?: {
      categoryId?: string;
      isIncome: boolean;
    };
  };
}

const CategoryEditScreen = ({ route }: CategoryEditScreenProps) => {
  const styles = useStyles();
  const { categoryId, isIncome } = route?.params || { isIncome: false };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {categoryId ? translate('categoryEditScreen.titleEdit') : translate('categoryEditScreen.titleAdd')}
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          {translate('categoryEditScreen.subtitle', { 
            type: isIncome ? translate('categoryEditScreen.typeIncome') : translate('categoryEditScreen.typeExpense') 
          })}
        </TextView>
        <TextView size="body" style={styles.description}>
          {translate('categoryEditScreen.description')}
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
};

export default CategoryEditScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    opacity: 0.7,
  },
  description: {
    textAlign: 'center',
    opacity: 0.5,
  },
}));
