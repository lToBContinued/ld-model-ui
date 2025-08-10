import request from '@/utils/request.ts'
import { LoginFormData, UserInfo } from '@/views/login/types'

export const loginApi = (data: LoginFormData) => {
  return request<any, ResponseData<UserInfo>>({
    url: 'api/login',
    method: 'post',
    data,
  })
}

export const logoutApi = (data: any) => {
  return request<any, ResponseData>({
    url: 'api/logout',
    method: 'post',
    data,
  })
}

export const getUserInfoApi = () => {
  return request<any, ResponseData<UserInfo>>({
    url: `api/getUserInfo`,
  })
}
