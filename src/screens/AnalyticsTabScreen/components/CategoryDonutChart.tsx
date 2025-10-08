import { useMemo } from 'react';
import React from 'react';
import { View } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { CategoryData } from '@/store/dashboardStore';
import Svg, { Path, G } from 'react-native-svg';

interface CategoryDonutChartProps {
  data: CategoryData[];
  isLoading?: boolean;
  size?: number;
}

interface ChartCategory extends CategoryData {
  startAngle: number;
  endAngle: number;
  path: string;
}

export const CategoryDonutChart = React.memo<CategoryDonutChartProps>(
  ({ data, isLoading = false, size = 200 }) => {
    const styles = useStyles();

    const { chartData, totalAmount } = useMemo(() => {
      if (!data || data.length === 0) {
        return { chartData: [], totalAmount: 0 };
      }

      const total = data.reduce((sum, item) => sum + item.amount, 0);

      let currentAngle = 0;
      const chartCategories: ChartCategory[] = data
        .filter(item => item.amount > 0)
        .map(item => {
          const angle = (item.amount / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          // Calculate path for donut segment
          const centerX = size / 2;
          const centerY = size / 2;
          const innerRadius = size * 0.15;
          const outerRadius = size * 0.35;

          const largeArcFlag = angle > Math.PI ? 1 : 0;

          // Calculate points
          const x1 = centerX + outerRadius * Math.cos(startAngle);
          const y1 = centerY + outerRadius * Math.sin(startAngle);
          const x2 = centerX + outerRadius * Math.cos(endAngle);
          const y2 = centerY + outerRadius * Math.sin(endAngle);

          const x3 = centerX + innerRadius * Math.cos(endAngle);
          const y3 = centerY + innerRadius * Math.sin(endAngle);
          const x4 = centerX + innerRadius * Math.cos(startAngle);
          const y4 = centerY + innerRadius * Math.sin(startAngle);

          const path = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z',
          ].join(' ');

          currentAngle = endAngle;

          return {
            ...item,
            startAngle,
            endAngle,
            path,
          };
        });

      return { chartData: chartCategories, totalAmount: total };
    }, [data, size]);

    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
      }
      return amount.toLocaleString();
    };

    const formatPercentage = (amount: number, total: number) => {
      return ((amount / total) * 100).toFixed(1);
    };

    if (isLoading || !data || data.length === 0) {
      return (
        <View style={styles.container}>
          <TextView size="title" family="semiBold" style={styles.title}>
            {translate('dashboardScreen.categoryBreakdown')}
          </TextView>
          <View style={styles.emptyChart}>
            <TextView size="body" style={styles.emptyText}>
              {translate('dashboardScreen.noData')}
            </TextView>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextView size="title" family="semiBold" style={styles.title}>
          {translate('dashboardScreen.categoryBreakdown')}
        </TextView>

        <View style={styles.chartContent}>
          <View style={styles.chartWrapper}>
            <Svg height={size} width={size}>
              <G>
                {chartData.map((category, index) => (
                  <Path
                    key={category.categoryId}
                    d={category.path}
                    fill={category.color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </G>
            </Svg>

            {/* Center total */}
            <View style={styles.centerContent}>
              <TextView size="caption" style={styles.centerLabel}>
                Total
              </TextView>
              <TextView size="body" family="bold" style={styles.centerAmount}>
                {formatAmount(totalAmount)}
              </TextView>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {chartData.slice(0, 5).map((category, index) => (
              <View key={category.categoryId} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: category.color },
                  ]}
                />
                <View style={styles.legendText}>
                  <TextView
                    size="caption"
                    style={styles.legendName}
                    numberOfLines={1}
                  >
                    {category.categoryName}
                  </TextView>
                  <TextView
                    size="caption"
                    family="semiBold"
                    style={styles.legendAmount}
                  >
                    {formatAmount(category.amount)} (
                    {formatPercentage(category.amount, totalAmount)}%)
                  </TextView>
                </View>
              </View>
            ))}
            {chartData.length > 5 && (
              <TextView size="caption" style={styles.moreText}>
                +{chartData.length - 5} more categories
              </TextView>
            )}
          </View>
        </View>
      </View>
    );
  },
);

CategoryDonutChart.displayName = 'CategoryDonutChart';

const useStyles = makeStyles(theme => ({
  container: {
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
  title: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    color: theme.colors.textDim,
    marginBottom: 2,
  },
  centerAmount: {
    color: theme.colors.onSurface,
  },
  legend: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  legendAmount: {
    color: theme.colors.textDim,
  },
  moreText: {
    color: theme.colors.textDim,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  },
  emptyChart: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: theme.colors.textDim,
  },
}));
