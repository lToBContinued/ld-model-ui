export interface LoginFormData {
  username: string
  password: string
}

export interface UserInfo {
  id?: string
  username?: string
  password?: string
  phone?: string
  createTime?: Date
  updateTime?: Date
  delFlag?: number
  role?: number
}
