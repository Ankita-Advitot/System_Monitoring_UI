import ReactECharts from 'echarts-for-react';
import { CHART_COLORS, METRIC_LABELS } from '../constants/dashboardConstants';
import type { NetworkChartData } from '../types/dashboardTypes';

interface NetworkChartProps {
  data: NetworkChartData[];
}

export const NetworkChart = ({ data }: NetworkChartProps) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: 'Network Traffic',
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
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#f8fafc',
      },
    },
    legend: {
      data: [METRIC_LABELS.NETWORK_IN, METRIC_LABELS.NETWORK_OUT],
      textStyle: { color: '#94a3b8' },
      right: 20,
      top: 8,
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
      axisLine: {
        lineStyle: { color: '#475569' },
      },
      axisLabel: {
        color: '#94a3b8',
        formatter: '{value} KB',
      },
      splitLine: {
        lineStyle: { color: '#334155', type: 'dashed' },
      },
    },
    series: [
      {
        name: METRIC_LABELS.NETWORK_IN,
        type: 'line',
        data: data.map((d) => d.networkIn),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: CHART_COLORS.NETWORK_IN,
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
              { offset: 0, color: 'rgba(34, 197, 94, 0.2)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0.02)' },
            ],
          },
        },
        animationDuration: 500,
      },
      {
        name: METRIC_LABELS.NETWORK_OUT,
        type: 'line',
        data: data.map((d) => d.networkOut),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: CHART_COLORS.NETWORK_OUT,
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
              { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
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
