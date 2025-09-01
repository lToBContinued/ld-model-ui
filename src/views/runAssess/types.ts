export interface BaseFormConfigItem {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    type?: string
    options?: Record<string, any>
    format?: string
  }
}

export interface BaseFormData {
  company: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  expert: string
}

export interface IndicatorListItem {
  children: IndicatorListItem[]
  description: string
  formConfig: {
    config?: {
      max?: number
      min?: number
      options?: { label: string; value: string | number }[]
      step?: number
    }
    prop: string
    result: NullType<number | string>
    rules?: Record<string, any>[]
    type: string
    value: NullType<number | string>
  }
  id: number
  name: string
  parentId?: any
  refIndicatorId: number
  subtreeId: number
}

export interface RootObject {
  id: number
  parentId?: any
  refIndicatorId: number
  subtreeId: number
  name: string
  description?: any
  children: any[]
  formConfig: string
}

export interface schemeListOptionsItem {
  label: string
  value: number
}
