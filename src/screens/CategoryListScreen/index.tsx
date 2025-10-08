import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface CategoryListScreenProps {
  // Add navigation props when needed
}

const CategoryListScreen = ({}: CategoryListScreenProps) => {
  const styles = useStyles();

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {translate('categoryListScreen.title')}
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          {translate('categoryListScreen.subtitle')}
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
};

export default CategoryListScreen;

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
    opacity: 0.7,
  },
}));
