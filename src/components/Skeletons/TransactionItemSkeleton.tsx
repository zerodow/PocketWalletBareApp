import { View } from 'react-native';
import { SkeletonLine } from '@/components/Skeletons';
import { makeStyles } from '@/utils/makeStyles';

export const TransactionItemSkeleton = () => {
  const styles = useStyles();

  return (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonInfo}>
        <SkeletonLine width={180} height={16} />
        <SkeletonLine width={120} height={14} />
      </View>

      <View style={styles.skeletonRight}>
        <SkeletonLine width={100} height={16} />
        <SkeletonLine width={60} height={12} />
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  skeletonInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  skeletonRight: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
}));
