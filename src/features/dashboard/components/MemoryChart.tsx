import ReactECharts from 'echarts-for-react';
import { CHART_COLORS, METRIC_LABELS } from '../constants/dashboardConstants';
import type { ChartData } from '../types/dashboardTypes';

interface MemoryChartProps {
  data: ChartData[];
}

export const MemoryChart = ({ data }: MemoryChartProps) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: METRIC_LABELS.MEMORY,
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: 500,
      },
      left: 16,
      top: 8,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: CHART_COLORS.MEMORY,
      borderWidth: 1,
      textStyle: {
        color: '#f8fafc',
      },
      formatter: (params: any) => {
        const point = params[0];
        return `${point.axisValue}<br/>${point.seriesName}: ${point.value.toFixed(1)}%`;
      },
    },
    grid: {
      left: 50,
      right: 20,
      top: 50,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.time),
      axisLine: {
        lineStyle: { color: '#475569' },
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        interval: 'auto',
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: { color: '#475569' },
      },
      axisLabel: {
        color: '#94a3b8',
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: { color: '#334155', type: 'dashed' },
      },
    },
    series: [
      {
        name: 'Memory',
        type: 'line',
        data: data.map((d) => d.value),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: CHART_COLORS.MEMORY,
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0.02)' },
            ],
          },
        },
        animationDuration: 500,
      },
    ],
  };

  return (
    <div className="chart-container">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
