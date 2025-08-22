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

export interface BuildSchemeTreeItem {
  schemeId?: string
  config?: string
}

export interface AddSecondIndicatorFormData {
  indicatorId: UndefinedType<number>
  indicatorDesc: string
}

export interface AddSchemeFormData {
  schemeName: string
  indicatorSystem: UndefinedType<number>
  schemeDesc: string
}

export interface IndicatorConfigFormData {
  config?: any
  id?: number
  description?: string
  name?: string
  isLeaf?: number
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

export interface SelectedScheme {
  config?: string
  id?: number
  indicatorSystem?: number
  schemeDesc?: string
  schemeName?: string
}

export interface SchemeIndicatorConfigItem {
  indicatorId?: UndefinedType<number>
  indicatorName?: string
  level?: number
  indicatorDesc?: string
  children?: SchemeIndicatorConfigItem[]
}

export interface AddSecondIndicatorFormConfig {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string }>
    type?: string
  }
}

export interface AddSecondIndicatorFormConfigItem {
  prop: string
  label: string
  type: string
  rules?: Record<string, any>[]
  config?: {
    options?: Array<{ label: string; value: number | string }>
    type?: string
  }
}

export interface AddChildNodeFormData {
  name: string
  description: string
  systemId: string
}
