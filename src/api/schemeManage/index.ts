import request from '@/utils/request.ts'
import {
  AddSchemeApiRes,
  AddSchemeApiSend,
  GetSchemeListApiRes,
  GetSchemeListApiSend,
  SchemeDetailInfo,
  UpdateSchemeApiSend,
} from '@/api/schemeManage/types.ts'

/**
 * @description 增加方案
 * @param { string } data.schemeName 方案名称
 * @param { number } data.indicatorSystem 指标体系
 * @param { string } data.schemeDesc 方案描述
 */
export const addSchemeApi = (data: AddSchemeApiSend) => {
  return request<ResponseData<AddSchemeApiRes>>({
    url: '/subtrees',
    method: 'post',
    data,
  })
}

/**
 * @description 删除方案
 * @param { number } id 方案id
 */
export const removeSchemeApi = (id: number) => {
  return request<any, ResponseData>({
    url: `/subtrees/${id}`,
    method: 'delete',
    data: {
      id,
    },
  })
}

/**
 * @description 更新方案
 * @param { number } data.id 方案id
 * @param { string } data.config 方案配置
 */
export const updateSchemeApi = (id: number, data: UpdateSchemeApiSend) => {
  return request<any, ResponseData>({
    url: `/subtrees/${id}/nodes`,
    method: 'post',
    data,
  })
}

/**
 * @description 获取方案列表
 */
export const getSchemeListApi = (params: GetSchemeListApiSend) => {
  return request<any, ResponseData<GetSchemeListApiRes>>({
    url: '/subtrees/page',
    params,
  })
}

/**
 * @description 获取方案子树
 * @param { number } id 方案id
 */
export const getSchemeDetailApi = (id: number) => {
  return request<any, ResponseData<SchemeDetailInfo>>({
    url: `/subtrees/${id}/tree`,
    method: 'get',
  })
}

export const deleteSchemeNode = (nodeId: number) => {
  return request<ResponseData<void>>({
    url: `/subtrees/nodes/${nodeId}`,
    method: 'delete',
  })
}
