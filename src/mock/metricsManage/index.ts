import Mock from 'mockjs'

Mock.mock('api/metricsManage/metricOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    'data|12': [
      {
        id: /^[a-z0-9]{8}$/,
        code: /^[a-z0-9]{6}$/,
        metricName: '@ctitle(2, 6)@pick(["指标"])',
      },
    ],
  })
})
