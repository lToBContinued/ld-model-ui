import request from '@/utils/request.ts'
import {
  AddSchemeApiRes,
  AddSchemeApiSend,
  GetSchemeListApiRes,
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
    url: '/api/schemeManage/addScheme',
    method: 'post',
    data,
  })
}

/**
 * @description 删除方案
 * @param { string } id 方案id
 */
export const removeSchemeApi = (id: number) => {
  return request<any, ResponseData>({
    url: '/api/schemeManage/removeScheme',
    method: 'post',
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
export const updateSchemeApi = (data: UpdateSchemeApiSend) => {
  return request<any, ResponseData>({
    url: '/api/schemeManage/updateScheme',
    method: 'post',
    data,
  })
}

/**
 * @description 获取方案列表
 */
export const getSchemeListApi = () => {
  return request<any, ResponseData<GetSchemeListApiRes[]>>({
    url: '/api/schemeManage/getSchemeList',
  })
}

export const getSchemeDetailApi = (id: number) => {
  return request({
    url: '/api/schemeManage/getSchemeDetail',
    params: {
      id,
    },
  })
}
