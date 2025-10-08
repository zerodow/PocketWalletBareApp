import React from 'react';
import { View } from 'react-native';
import { SkeletonLine, SkeletonBox } from '@/components/Skeletons';
import { makeStyles } from '@/utils/makeStyles';

interface ChartSkeletonProps {
  height?: number;
}

export const ChartSkeleton = ({ height = 200 }: ChartSkeletonProps) => {
  const styles = useStyles();

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <SkeletonLine width={140} height={16} />
      </View>
      <SkeletonBox height={height} radius={12} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: theme.spacing.sm,
  },
}));
