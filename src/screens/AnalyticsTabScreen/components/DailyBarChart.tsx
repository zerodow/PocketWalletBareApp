import React, { useMemo } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { TextView } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { DailyData } from '@/store/dashboardStore';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';

interface DailyBarChartProps {
  data: DailyData[];
  isLoading?: boolean;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const DailyBarChart = React.memo<DailyBarChartProps>(
  ({ data, isLoading = false, height = 200 }) => {
    const styles = useStyles();

    const { maxValue, chartData, gridLines } = useMemo(() => {
      if (!data || data.length === 0) {
        return { maxValue: 0, chartData: [], gridLines: [] };
      }

      const max = Math.max(...data.map(d => d.amount));
      const roundedMax = Math.ceil(max / 1000) * 1000 || 1000;

      const chartWidth = Math.max(screenWidth - 64, data.length * 30);
      const barWidth = Math.max(20, (chartWidth - 40) / data.length - 10);
      const padding = 20;

      const chartData = data.map((item, index) => ({
        ...item,
        x: padding + index * (barWidth + 10) + barWidth / 2,
        height: (item.amount / roundedMax) * (height - 60),
        day: item.day.padStart(2, '0'),
      }));

      // Generate grid lines
      const gridLines = [];
      for (let i = 0; i <= 4; i++) {
        const y = height - 20 - (i / 4) * (height - 60);
        const value = (roundedMax / 4) * i;
        gridLines.push({ y, value });
      }

      return { maxValue: roundedMax, chartData, gridLines };
    }, [data, height]);

    const formatValue = (value: number) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toString();
    };

    if (isLoading || !data || data.length === 0) {
      return (
        <View style={styles.container}>
          <TextView size="title" family="semiBold" style={styles.title}>
            {translate('dashboardScreen.dailySpending')}
          </TextView>
          <View style={styles.emptyChart}>
            <TextView size="body" style={styles.emptyText}>
              {translate('dashboardScreen.noData')}
            </TextView>
          </View>
        </View>
      );
    }

    const chartWidth = Math.max(screenWidth - 64, data.length * 30);

    return (
      <View style={styles.container}>
        <TextView size="title" family="semiBold" style={styles.title}>
          {translate('dashboardScreen.dailySpending')}
        </TextView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={[styles.chartContainer, { width: chartWidth }]}>
            <Svg height={height} width={chartWidth}>
              {/* Grid lines */}
              {gridLines.map((line, index) => (
                <React.Fragment key={index}>
                  <Line
                    x1={20}
                    y1={line.y}
                    x2={chartWidth - 20}
                    y2={line.y}
                    stroke="#E5E7EB"
                    strokeWidth={1}
                    strokeDasharray={index === 0 ? '0' : '2,2'}
                  />
                  <SvgText
                    x={10}
                    y={line.y + 4}
                    fontSize={10}
                    fill="#9CA3AF"
                    textAnchor="end"
                  >
                    {formatValue(line.value)}
                  </SvgText>
                </React.Fragment>
              ))}

              {/* Bars */}
              {chartData.map((item, index) => (
                <React.Fragment key={index}>
                  <Rect
                    x={item.x - 10}
                    y={height - 20 - item.height}
                    width={20}
                    height={item.height}
                    fill="#8B5CF6"
                    rx={2}
                  />
                  <SvgText
                    x={item.x}
                    y={height - 5}
                    fontSize={10}
                    fill="#6B7280"
                    textAnchor="middle"
                  >
                    {item.day}
                  </SvgText>
                </React.Fragment>
              ))}
            </Svg>
          </View>
        </ScrollView>
      </View>
    );
  },
);

DailyBarChart.displayName = 'DailyBarChart';

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
  scrollView: {
    marginHorizontal: -theme.spacing.md,
  },
  chartContainer: {
    paddingHorizontal: theme.spacing.md,
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
