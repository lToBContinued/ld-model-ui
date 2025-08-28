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

export interface SchemeListItem {
  createAt: string
  description: string
  id: number
  name: string
  rootNodeId: number
  systemId: number
  updateAt: string
  parentId: number
}

export interface ListState {
  total: number
  totalData: SchemeListItem[]
  page: number
  size: number
}

export interface AddSecondIndicatorFormData {
  indicatorId: UndefinedType<number>
  description: string
}

export interface AddSchemeFormData {
  name: string
  systemId: UndefinedType<number>
  description: string
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
  systemId?: number
  description?: string
  name?: string
  refIndicatorId: number
  children: SchemeIndicatorConfigItem[]
}

export interface SchemeIndicatorConfigItem {
  id?: UndefinedType<number>
  name?: string
  level?: number
  description?: string
  enabled: number
  formula: string
  weight: string
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
