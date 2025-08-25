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
  role: number
  department: string
  status: number
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
  role: UndefinedType<number>
  status: UndefinedType<number>
}

export interface UserFormData {
  id?: string
  username?: string
  password?: string
  role?: number
  department?: string
  status?: number
}

export interface SchemeListItem {
  id: number
  schemeName: string
}

export interface SchemeIndicatorConfigItem {
  id: number
  refIndicatorId: number
  name: string
  description?: string
  formula?: string
  enabled: number
  weight?: number
  children: SchemeIndicatorConfigItem[]
}

export interface SelectedScheme {
  createdAt?: string
  description?: string
  id?: number
  name?: string
  rootNodeId?: number
  systemId?: number
  updatedAt?: string
}

export interface CompanyFormData {
  id?: number
  companyName: string
  companyCode: string
  department: string
  byword: string
}

export interface CompanyTableStateList {
  id?: number
  companyName: string
  companyCode: string
  department: string
  byword: string
}

export interface CompanyTableState {
  totalData: CompanyTableStateList[]
  total: number
  currentPage: number
  pageSize: number
}
