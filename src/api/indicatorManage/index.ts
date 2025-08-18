import request from '@/utils/request.ts'
import { AddIndicatorApiRes, AddIndicatorApiSend, GetIndicatorListApiRes } from '@/api/indicatorManage/types.ts'

/**
 * @description 获取指标列表
 * @param { number } params.level 指标父id
 */
export const getIndicatorListApi = (params: { id: number }) => {
  return request<any, ResponseData<GetIndicatorListApiRes[]>>({
    url: '/api/indicatorManage/getIndicatorList',
    method: 'get',
    params,
  })
}

/**
 * @description 添加指标
 * @param { AddIndicatorApiSend } data
 */
export const addIndicatorApi = (data: AddIndicatorApiSend) => {
  return request<any, ResponseData<AddIndicatorApiRes>>({
    url: '/api/indicatorManage/addIndicator',
    method: 'post',
    data,
  })
}

/**
 * @description 删除指标
 * @param { number } data.id 指标id
 */
export const removeIndicatorApi = (data: { id: number }) => {
  return request<any, ResponseData<{ deletedCount: number; deletedIds: number[] }>>({
    url: '/api/indicatorManage/removeIndicator',
    method: 'post',
    data,
  })
}

export const getIndicatorDetail = (params: { nodeId: string }) => {
  return request({
    url: '/api/getIndicatorDetail',
    method: 'get',
    params,
  })
}
