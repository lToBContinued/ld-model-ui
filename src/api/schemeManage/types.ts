export interface GetSchemeListApiRes {
  id: number
  schemeName: string
}

export interface AddSchemeApiSend {
  schemeName: string
  indicatorSystem: number
  schemeDesc: string
}

export interface AddSchemeApiRes {
  id: number
  schemeName: string
  schemeDesc: string
  indicatorSystem: number
  config?: any
}

export interface UpdateSchemeApiSend {
  id: number
  config: string
}

export interface SchemeListItem {
  id?: number
  schemeName?: string
  schemeDesc?: string
}

// 算法配置========================================================================
export interface SchemeDetail {
  id: number
  schemeName: string
  schemeDesc: string
  config: string
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
