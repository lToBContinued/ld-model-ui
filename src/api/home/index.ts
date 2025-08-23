import request from '@/utils/request.ts'

export const getRecentRecordsApi = () => {
  return request({
    url: '/home/recentRecords',
  })
}
