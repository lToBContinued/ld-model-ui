import { SchemeListItem } from '@/api/schemeManage/types.ts'

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
  name: string
  isLeaf: number
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

export interface SchemeIndicatorConfigItem {
  id?: number
  children?: SchemeIndicatorConfigItem[]
  parentId?: number
  hasChildren?: boolean
  hasSon?: boolean
  refIndicatorId?: number
  subtreeId?: number
  orderIndex?: number
  name?: string
  description?: string
  formula?: string
  enabled?: number
  weight?: number
}

export interface AddSecondIndicatorFormConfig {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string; disabled?: boolean }>
    type?: string
  }
}

export interface AddSecondIndicatorFormConfigItem {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string; disabled?: boolean }>
    type?: string
  }
}

export interface AddChildNodeFormData {
  name: string
  description: string
  systemId: string
}

export interface AddChildrenIndicatorFormData {
  indicatorId: UndefinedType<number>
  description: string
}

export type ConfirmAdd = (
  tree: SchemeIndicatorConfigItem[],
  newNode: AddChildrenIndicatorFormData & {
    indicatorName: string
    children: any[]
  },
) => void
