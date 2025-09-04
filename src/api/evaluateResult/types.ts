export type GetIndicatorSystemApiRes = {
  name: string
  id: number
}[]

export type GetSchemeByIndicatorSysApiRes = {
  name: string
  id: number
}[]

export interface GetAssessResultListApiSend {
  departmentId?: number
  endDate?: Date
  pageNum: number
  pageSize: number
  startDate?: Date
  subject?: number[]
  subtreeId?: number
}

export interface GetAssessResultListRecords {
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
}

export interface GetAssessResultListApiRes {
  records: GetAssessResultListRecords[]
  total: number
  size: number
  current: number
  pages: number
}
