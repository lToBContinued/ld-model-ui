export interface AddSchemeApiSend {
  systemId: number
  name: string
  description: string
  rootRefIndicatorId: number
}

export interface AddSchemeApiRes {
  id: number
  name: string
  description: string
  systemId: number
  config?: any
}

export interface UpdateSchemeApiSend {
  refIndicatorId: number // 必须，引用的指标ID
  parentId?: number // 可选，父节点ID，顶级节点可为null
}

export interface GetSchemeListApiSend {
  page: number
  size: number
}

export interface SchemeListItem {
  createAt: string
  description: string
  id: number
  name: string
  rootNodeId: number
  systemId: number
  updateAt: string
}

export interface GetSchemeListApiRes {
  current: number
  pages: number
  records: SchemeListItem[]
  size: number
  total: number
}

// 算法配置========================================================================
export interface SchemeDetail {
  id: number
  refIndicatorId: number
  name: string
  description?: string
  formula?: string
  enabled: number
  weight?: number
  children: SchemeDetail[]
}

export type ParamMapEntryDTO = {
  key: string
  value: number
  orderIndex: number
}

export interface CreateParamDTO {
  name: string
  type: 1 | 2
  enabled?: 0 | 1
  minValue?: number | null
  maxValue?: number | null
  defaultValue?: number | null
  mapEntries?: ParamMapEntryDTO[]
}

export type UpdateParamDTO = Partial<CreateParamDTO>

export interface SubtreeNodeUpdateDTO {
  formula?: string | null
  weight?: number | null
  enabled?: 0 | 1
}

export interface SchemeDetailChildren {
  description: string
  enabled: number
  formula: string
  id: number
  name: string
  refIndicatorId: number
  weight: number
}

export interface SchemeDetailInfo {
  children: SchemeDetailChildren[]
  description: string
  enabled: number
  formula: string
  id: number
  name: string
  refIndicatorId: number
  subtreeId: number
  weight: number
  systemId: number
}
