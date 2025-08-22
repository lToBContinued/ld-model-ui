import request from '@/utils/request.ts'
import { LoginFormData, UserInfo } from '@/views/login/types'

export const loginApi = (data: LoginFormData) => {
  return request<any, ResponseData<UserInfo>>({
    url: '/login',
    method: 'post',
    data,
  })
}

export const logoutApi = (data: any) => {
  return request<any, ResponseData>({
    url: '/logout',
    method: 'post',
    data,
  })
}

export const getUserInfoApi = (id: string) => {
  return request<any, ResponseData<UserInfo>>({
    url: `/getUserInfo`,
    params: {
      id,
    },
  })
}

export const getRouterApi = (role: number) => {
  return request<any, ResponseData<Record<string, any>>>({
    url: `/getRouter`,
    params: {
      role,
    },
  })
}
