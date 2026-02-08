import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/dashboardConstants';

interface MetricPieChartProps {
  cpuPercent: number;
  memoryPercent: number;
}

export const MetricPieChart = ({ cpuPercent, memoryPercent }: MetricPieChartProps) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: 'Resource Usage',
      textStyle: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: 500,
      },
      left: 16,
      top: 8,
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#f8fafc',
      },
      formatter: (params: any) => {
        return `${params.name}: ${params.value.toFixed(1)}%`;
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: { color: '#94a3b8' },
    },
    series: [
      {
        name: 'Resource Usage',
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'rgba(30, 41, 59, 0.8)',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            const total = ((cpuPercent + memoryPercent) / 2).toFixed(0);
            return `{value|${total}%}\n{label|Average}`;
          },
          rich: {
            value: {
              fontSize: 28,
              fontWeight: 'bold',
              color: '#f8fafc',
              lineHeight: 36,
            },
            label: {
              fontSize: 12,
              color: '#94a3b8',
            },
          },
        },
        labelLine: { show: false },
        data: [
          {
            value: cpuPercent,
            name: 'CPU',
            itemStyle: { color: CHART_COLORS.CPU },
          },
          {
            value: memoryPercent,
            name: 'Memory',
            itemStyle: { color: CHART_COLORS.MEMORY },
          },
          {
            value: Math.max(0, 100 - Math.max(cpuPercent, memoryPercent)),
            name: 'Free',
            itemStyle: { color: '#334155' },
          },
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 800,
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
