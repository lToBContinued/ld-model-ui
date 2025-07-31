import request from '@/utils/request.ts'

export const testApi = () => {
  return request({
    url: '/demo/getInfo',
  })
}
