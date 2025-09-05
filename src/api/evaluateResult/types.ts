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

interface GetRecordDetailApiResChildren {
  id: number
  children: GetRecordDetailApiResChildren[]
  parentId?: any
  hasChildren?: any
  hasSon: number
  refIndicatorId: number
  subtreeId: number
  name: string
  description: string
  formConfig?: any
  paramId?: any
  score: number
  result?: any
  formula: string
}

export interface GetRecordDetailApiRes {
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
  indicatorSystemId: number
  indicatorSystemName: string
  subtreeName: string
  children: GetRecordDetailApiResChildren[]
}
