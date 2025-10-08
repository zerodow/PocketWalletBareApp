import React from 'react';
import { View } from 'react-native';
import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonLine,
} from '@/components/Skeletons';
import { makeStyles } from '@/utils/makeStyles';

export const KPICardSkeleton = () => {
  const styles = useStyles();

  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <SkeletonLine width={120} height={14} />
        <SkeletonCircle size={24} />
      </View>
      <SkeletonBox height={20} width={160} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  skeletonCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 90,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
}));
