import request from '@/utils/request.ts'
import { GetTraineesListRes, GetTraineesListSend } from '@/api/global/type.ts'

/**
 * @description 获取参训单位列表
 * @param {number} params.pageNum
 * @param {number} params.pageSize
 */
export const getTraineesListApi = (params: GetTraineesListSend) => {
  return request<any, ResponseData<GetTraineesListRes>>({
    url: '/departments/page',
    method: 'get',
    params,
  })
}
