import request from '@/utils/request.ts'

export const getSchemeListApi = () => {
  return request({
    url: '/api/schemeManage/getSchemeList',
  })
}

export const getSchemeDetailApi = (id: string) => {
  return request({
    url: '/api/schemeManage/getSchemeDetail',
    method: 'get',
    params: {
      schemeId: id,
    },
  })
}
