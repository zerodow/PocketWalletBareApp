import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface CategoryEditScreenProps {
  route?: {
    params?: {
      categoryId?: string;
      isIncome: boolean;
    };
  };
}

export default function CategoryEditScreen({ route }: CategoryEditScreenProps) {
  const styles = useStyles();
  const { categoryId, isIncome } = route?.params || { isIncome: false };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {categoryId ? 'Edit Category' : 'Add Category'}
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          Category editing placeholder - Type: {isIncome ? 'Income' : 'Expense'}
        </TextView>
        <TextView size="body" style={styles.description}>
          Implement your category form here
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
}

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
