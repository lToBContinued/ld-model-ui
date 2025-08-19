import request from '@/utils/request.ts'
import {
  AddIndicatorApiRes,
  AddIndicatorApiSend,
  GetIndicatorDetailRes,
  GetIndicatorListApiRes,
  UpdateIndicatorDetailRes,
  UpdateIndicatorDetailSend,
} from '@/api/indicatorManage/types.ts'

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

/**
 * @description 获取指标详情
 * @param { number } params.id 指标id
 */
export const getIndicatorDetailApi = (params: { id: number }) => {
  return request<any, ResponseData<GetIndicatorDetailRes>>({
    url: '/api/indicatorManage/getIndicatorDetail',
    method: 'get',
    params,
  })
}

/**
 * @description 更新指标详情
 * @param { string } data.config 指标配置
 * @param { number } data.id 指标id
 * @param { string } data.indicatorDesc 指标描述
 * @param { string } data.indicatorName 指标名称
 * @param { boolean } data.isLeaf 是否叶子节点
 * @param { string } data.parentName 父指标名称
 */
export const updateIndicatorDetailApi = (data: UpdateIndicatorDetailSend) => {
  return request<any, ResponseData<UpdateIndicatorDetailRes>>({
    url: '/api/indicatorManage/updateIndicatorDetail',
    method: 'post',
    data,
  })
}
