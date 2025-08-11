export interface addCompanyFormDataType {
  company: string
  companyNumber: string
  department: string
  code: string
}

export interface UserInfo {
  id: string
  username: string
  password: string
  phone: string
  createTime: string
  updateTime: string
  delFlag: number
}

export interface UserListTable {
  totalData: UserInfo[]
  total: number
  currentPage: number
  pageSize: number
}

export interface SearchUserFormData {
  username: string
}

export interface UserFormData {
  id?: string
  username?: string
  password?: string
  phone?: string
}
