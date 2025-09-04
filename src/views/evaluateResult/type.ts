export interface EvaluateResultFormType {
  department?: number
  startDate?: Date
  endDate?: Date
  subject?: UndefinedType<number>[]
}

export interface assessResultTableState {
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
}
