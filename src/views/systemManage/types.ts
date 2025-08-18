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
  id?: string | number
  schemeName?: string
  schemeDesc?: string
  indicatorId?: string
}

export interface BuildSchemeTreeItem {
  indicatorId?: string
  indicatorName?: string
  indicatorDesc?: string
  level?: number
  children?: BuildSchemeTreeItem[]
}

export interface AddSecondIndicatorFormData {
  indicatorName: string
  indicatorDesc: string
}

export interface AddSchemeFormData {
  schemeName: string
  indicatorId: string
  schemeDesc: string
}

export interface RootTreeItem {
  id?: number
  indicatorName?: string
  indicatorDesc?: string
  parentId?: number
  level?: number
  isLeaf?: number
  children?: RootTreeItem[]
}

export interface IndicatorConfigFormData {
  config?: any
  id?: number
  indicatorDesc?: string
  indicatorName?: string
  isLeaf?: number
  level?: number
  parentId?: number
  parentName?: string
}
