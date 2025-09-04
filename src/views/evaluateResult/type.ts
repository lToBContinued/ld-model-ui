export interface EvaluateResultFormType {
  department?: number
  startDate?: Date
  endDate?: Date
  subject?: UndefinedType<number>[]
}

export interface AssessResultTableState {
  totalData: {
    id: number
    subtreeId: number
    title: string
    experts: string
    departmentName: string
    remark?: any
    status: string
    totalScore: number
    createdAt: string
    trainTime: string
    assessTime: string
  }[]
  pageSize: number
  currentPage: number
  total: number
  columns: Record<string, any>[]
}

export interface RecordDetailTableStateChild {
  children: RecordDetailTableStateChild[]
  description: string
  formConfig?: any
  formula: string
  hasChildren?: any
  hasSon: number
  id: number
  name: string
  paramId?: any
  parentId?: any
  refIndicatorId: number
  result?: any
  score: number
  subtreeId: number
}

export interface RecordDetailTableState {
  totalData: RecordDetailTableStateChild[]
  columns: Record<string, any>[]
}

export interface SelectedIndicatorSysDetail {
  assessTime?: string
  experts?: string
  indicatorSystemName?: string
  schemeName?: string
  totalScore?: string
}
