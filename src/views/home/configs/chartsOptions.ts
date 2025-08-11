export const abilityChartOptions: EChartsOption = {
  series: [
    {
      type: 'radar',
      data: [],
      tooltip: {
        trigger: 'item',
      },
      areaStyle: {},
    },
  ],
  title: {
    text: '能力分布雷达图',
    left: 0,
    top: '45%',
  },
  legend: {
    data: ['张三', '李四'],
    left: 'right',
    top: 'center',
    orient: 'vertical',
  },
  radar: {
    indicator: [
      { name: '理论研究成果', max: 100 },
      { name: '典型目标TC与区域JS', max: 100 },
      { name: 'ZZ统筹', max: 100 },
      { name: '任务规划', max: 100 },
      { name: '动态CG', max: 100 },
      { name: '综合FH', max: 100 },
      { name: '综合YL', max: 100 },
    ],
    center: ['50%', '50%'],
    radius: '80%',
  },
  tooltip: {
    trigger: 'axis',
  },
}

export const trendChartOptions: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['平均得分'],
    left: 'center',
    top: 'top',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
  },
  yAxis: {
    type: 'value',
    min: 0,
  },
  series: [
    {
      name: '平均得分',
      type: 'line',
      data: [80, 92, 91, 94, 75, 82, 96],
    },
  ],
}
