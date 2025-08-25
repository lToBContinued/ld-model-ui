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
  indicatorId: number
  indicatorName: string
  indicatorDesc: string
  level: number
  formConfig: {
    prop: string
    type: string
    value: NullType<number | string>
    result: NullType<number | string>
    rules?: Record<string, any>[]
    config?: {
      options?: { label: string; value: string | number }[]
      min?: number
      max?: number
      step?: number
    }
  }
  children: IndicatorListItem[]
}
