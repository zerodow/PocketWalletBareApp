import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface TransactionDetailScreenProps {
  route?: {
    params?: {
      transactionId: string;
    };
  };
}

const TransactionDetailScreen = ({
  route,
}: TransactionDetailScreenProps) => {
  const styles = useStyles();
  const transactionId = route?.params?.transactionId;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {translate('transactionDetailScreen.title')}
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          {translate('transactionDetailScreen.subtitle', { transactionId: transactionId || 'N/A' })}
        </TextView>
        <TextView size="body" style={styles.description}>
          {translate('transactionDetailScreen.description')}
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
};

export default TransactionDetailScreen;

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
