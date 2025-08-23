import request from '@/utils/request.ts'
import {
  SchemeListItem,
  SchemeDetail,
  ParamMapEntryDTO,
  CreateParamDTO,
  UpdateParamDTO,
  SubtreeNodeUpdateDTO,
} from '@/api/schemeManage/types.ts'

/**
 * @description 获取方案列表
 * @returns {Promise<ResponseData<SchemeListItem[]>>} 方案列表数据
 */
export const getSchemeListApi = () => {
  return request<ResponseData<SchemeListItem[]>>({
    url: '/subtrees/page',
    params: {
      page: 1,
      size: 10,
    },
  })
}

/**
 * @description 获取方案详情
 * @param {number} id - 方案ID
 * @returns {Promise<ResponseData<SchemeDetail>>} 方案详情数据
 */
export const getSchemeDetailApi = (id: number) => {
  return request<ResponseData<SchemeDetail>>({
    url: `/subtrees/${id}/tree`,
  })
}

/**
 * @description 获取子树结构
 * @param {number} id - 子树ID
 * @returns {Promise<ResponseData<any>>} 子树结构数据
 */
export const getSubtreeTree = (id: number) => {
  return request<ResponseData<any>>({
    url: `/subtrees/${id}/tree`,
  })
}

/**
 * @description 获取节点参数列表
 * @param {number} nodeId - 节点ID
 * @returns {Promise<ResponseData<any[]>>} 参数列表数据
 */
export const listParamsByNode = (nodeId: number) => {
  return request<ResponseData<any[]>>({
    url: `/subtrees/nodes/${nodeId}/params`,
  })
}

/**
 * @description 创建参数
 * @param {number} nodeId - 节点ID
 * @param {CreateParamDTO} dto - 创建参数DTO
 * @returns {Promise<ResponseData<number>>} 新创建参数的ID
 */
export const createParam = (nodeId: number, dto: CreateParamDTO) => {
  return request<ResponseData<number>>({
    url: `/subtrees/nodes/${nodeId}/params`,
    method: 'post',
    data: dto,
  })
}

/**
 * @description 更新参数
 * @param {number} paramId - 参数ID
 * @param {UpdateParamDTO} dto - 更新参数DTO
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const updateParam = (paramId: number, dto: UpdateParamDTO) => {
  return request<ResponseData<void>>({
    url: `/subtrees/params/${paramId}`,
    method: 'patch',
    data: dto,
  })
}

/**
 * @description 删除参数
 * @param {number} paramId - 参数ID
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const deleteParam = (paramId: number) => {
  return request<ResponseData<void>>({
    url: `/subtrees/params/${paramId}`,
    method: 'delete',
  })
}

/**
 * @description 获取参数映射条目列表
 * @param {number} paramId - 参数ID
 * @returns {Promise<ResponseData<ParamMapEntryDTO[]>>} 映射条目列表
 */
export const listMapEntries = (paramId: number) => {
  return request<ResponseData<ParamMapEntryDTO[]>>({
    url: `/subtrees/params/${paramId}/map-entries`,
  })
}

/**
 * @description 替换参数映射条目
 * @param {number} paramId - 参数ID
 * @param {ParamMapEntryDTO[]} items - 新的映射条目列表
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const replaceMapEntries = (paramId: number, items: ParamMapEntryDTO[]) => {
  return request<ResponseData<void>>({
    url: `/subtrees/params/${paramId}/map`,
    method: 'post',
    data: items,
  })
}

/**
 * @description 重新排序参数
 * @param {number} nodeId - 节点ID
 * @param {number[]} ids - 参数ID排序数组
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const reorderParams = (nodeId: number, ids: number[]) => {
  return request<ResponseData<void>>({
    url: `/subtrees/nodes/${nodeId}/params/reorder`,
    method: 'post',
    data: { children: ids },
  })
}

/**
 * @description 更新参数启用状态
 * @param {number} paramId - 参数ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const updateParamEnabled = (paramId: number, enabled: boolean) => {
  return request<ResponseData<void>>({
    url: `/subtrees/params/${paramId}/enabled`,
    method: 'put',
    params: { enabled: enabled ? 1 : 0 },
  })
}

/**
 * @description 更新子树节点
 * @param {number} nodeId - 节点ID
 * @param {SubtreeNodeUpdateDTO} dto - 节点更新DTO
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const updateSubtreeNode = (nodeId: number, dto: SubtreeNodeUpdateDTO) => {
  return request<ResponseData<void>>({
    url: `/subtrees/nodes/${nodeId}`,
    method: 'patch',
    data: dto,
  })
}

/**
 * @description 保存方案配置
 * @returns {Promise<ResponseData<void>>} 无返回数据
 */
export const saveSchemeConfigApi = () => {
  return request<ResponseData<void>>({
    url: '/subtrees/save-config',
    method: 'post',
  })
}
