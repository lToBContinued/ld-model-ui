import * as echarts from 'echarts'

type EChartsOption = echarts.EChartsOption

export const resultChartOption: EChartsOption = {
  title: {
    text: '评估分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '优秀' },
        { value: 735, name: '良好' },
        { value: 580, name: '合格' },
        { value: 484, name: '基本合格' },
        { value: 300, name: '不合格' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}
