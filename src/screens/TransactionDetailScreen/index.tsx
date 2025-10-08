import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface TransactionDetailScreenProps {
  route?: {
    params?: {
      transactionId: string;
    };
  };
}

export default function TransactionDetailScreen({
  route,
}: TransactionDetailScreenProps) {
  const styles = useStyles();
  const transactionId = route?.params?.transactionId;

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          Transaction Detail
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          Transaction details placeholder - ID: {transactionId || 'N/A'}
        </TextView>
        <TextView size="body" style={styles.description}>
          Implement your transaction detail view here
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
