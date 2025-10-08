import { View } from 'react-native';
import { TransactionItemSkeleton } from './TransactionItemSkeleton';
import { makeStyles } from '@/utils/makeStyles';

interface TransactionListSkeletonProps {
  count?: number;
}

export const TransactionListSkeleton = ({
  count = 10,
}: TransactionListSkeletonProps) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <TransactionItemSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing.md,
    flex: 1,
  },
}));
