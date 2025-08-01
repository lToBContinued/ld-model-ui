export const abilityChartOptions: EChartsOption = {
  series: [
    {
      name: 'Capacity distribution analysis',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: '张三',
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: '李四',
        },
      ],
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
      { name: '攻击', max: 6500 },
      { name: '防御', max: 16000 },
      { name: '速度', max: 30000 },
      { name: '灵巧', max: 38000 },
      { name: '旋转', max: 52000 },
      { name: '法术', max: 25000 },
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
    data: ['1月', '2月', '3月', '4月', '5月'],
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
    data: ['1月', '2月', '3月', '4月', '5月'],
  },
  yAxis: {
    type: 'value',
    min: 0,
  },
  series: [
    {
      name: '1月',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '2月',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '3月',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '4月',
      type: 'line',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: '5月',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
}
