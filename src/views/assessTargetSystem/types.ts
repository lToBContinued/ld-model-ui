export interface SchemaBasicAssessFormData {
  participateUnits: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  experts: string
  subject: string
}

export interface AssessFormData {
  target: UndefinedType<number>
  comprehensive: UndefinedType<number>
  accuracy: UndefinedType<number>
  supportive: UndefinedType<number>
  remark: string
}

export interface ResultFilterFormData {
  company: string
  experts: string
  startDate: NullType<Date>
  endDate: NullType<Date>
}

export interface BaseFormData {
  company: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  expert: string
}

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

export interface SchemeListItem {
  createAt: string
  description: string
  id: number
  name: string
  rootNodeId: number
  systemId: number
  updateAt: string
}

export interface ListState {
  total: number
  totalData: SchemeListItem[]
  page: number
  size: number
}

export interface AddSecondIndicatorFormData {
  indicatorId: UndefinedType<number>
  indicatorDesc: string
}

export interface AddSchemeFormData {
  schemeName: string
  indicatorSystem: UndefinedType<number>
  schemeDesc: string
}

export interface IndicatorConfigFormData {
  config?: any
  id?: number
  description?: string
  name?: string
  isLeaf?: number
  level?: number
  parentId?: number
  parentName?: string
}

export interface AddSchemeFormItem {
  prop: string
  label: string
  type: string
  rules?: any[]
  config?: {
    options?: Array<{ label: string; value: number }>
    type?: string
  }
}

export interface SelectedScheme {
  config?: string
  id?: number
  indicatorSystem?: number
  schemeDesc?: string
  schemeName?: string
}

export interface SchemeIndicatorConfigItem {
  indicatorId?: UndefinedType<number>
  indicatorName?: string
  level?: number
  indicatorDesc?: string
  children?: SchemeIndicatorConfigItem[]
}

export interface AddSecondIndicatorFormConfig {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string }>
    type?: string
  }
}

export interface AddSecondIndicatorFormConfigItem {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string }>
    type?: string
  }
}

export interface AddChildNodeFormData {
  name: string
  description: string
  systemId: string
}
