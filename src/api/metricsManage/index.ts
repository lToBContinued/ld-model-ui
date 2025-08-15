import request from '@/utils/request.ts'

export const getMetricOptionsApi = () => {
  return request({
    url: '/api/metricsManage/metricOptions',
  })
}
