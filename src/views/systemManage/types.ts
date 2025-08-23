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

export interface SchemeListItem {
  id: number
  schemeName: string
}

export interface SchemeIndicatorConfigItem {
  indicatorId?: UndefinedType<number>
  indicatorName?: string
  level?: number
  indicatorDesc?: string
  enabled?: boolean
  weight?: number
  formula?: string
  children?: SchemeIndicatorConfigItem[]
}

export interface SelectedScheme {
  config?: string
  id?: number
  indicatorSystem?: number
  schemeDesc?: string
  schemeName?: string
}
export interface AddOneCompanyFormData {
  companyName: string
  companyCode: string
  department: string
  byword: string
}
