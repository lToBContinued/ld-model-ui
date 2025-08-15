import request from '@/utils/request.ts'

export const getIndicatorTree = (params: { nodeId: string }) => {
  return request({
    url: '/api/getIndicatorTree',
    method: 'get',
    params,
  })
}

export const getIndicatorDetail = (params: { nodeId: string }) => {
  return request({
    url: '/api/getIndicatorDetail',
    method: 'get',
    params,
  })
}
