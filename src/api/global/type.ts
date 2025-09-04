export interface GetTraineesListSend {
  pageNum: number
  pageSize: number
}

export interface GetTraineesListRes {
  records: {
    id: number
    departmentName: string
    departmentId: string
    createdAt?: any
    updatedAt?: any
    delFlag: number
  }[]
  total: number
  size: number
  current: number
  pages: number
}
