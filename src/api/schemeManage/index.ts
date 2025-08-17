import request from '@/utils/request.ts'

export const getSchemeDetailApi = (id: string) => {
  return request({
    url: '/api/schemeManage/getSchemeDetail',
    method: 'get',
    params: {
      schemeId: id,
    },
  })
}
