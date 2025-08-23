export const resultChartOption: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    top: '12px',
    data: ['公司1', '公司2', '公司3', '公司4', '公司5', '公司6', '公司7'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    splitLine: {
      show: true,
      lineStyle: {
        color: '#6e6e6e',
      },
    },
  },
  series: [
    {
      name: '公司1',
      type: 'line',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      name: '公司2',
      type: 'line',
      data: [28, 48, 40, 19, 86, 27, 90],
    },
    {
      name: '公司3',
      type: 'line',
      data: [36, 18, 65, 59, 80, 81, 56],
    },
    {
      name: '公司4',
      type: 'line',
      data: [50, 32, 45, 23, 78, 34, 67],
    },
    {
      name: '公司5',
      type: 'line',
      data: [82, 45, 30, 67, 43, 56, 29],
    },
    {
      name: '公司6',
      type: 'line',
      data: [70, 50, 60, 40, 80, 65, 55],
    },
    {
      name: '公司7',
      type: 'line',
      data: [60, 40, 50, 30, 70, 50, 60],
    },
  ],
}
