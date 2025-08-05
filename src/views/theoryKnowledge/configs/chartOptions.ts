export const theoryKnowledgeResultChartOptions: EChartsOption = {
  title: {
    text: '得分',
  },
  xAxis: {
    type: 'category',
    data: ['成果针对性', '成果全面性', '成果准确性', '成果支撑性'],
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
  },
  series: [
    {
      data: [20, 40, 60, 80],
      type: 'bar',
    },
  ],
}
