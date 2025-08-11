import request from '@/utils/request.ts'
import { LoginFormData, UserInfo } from '@/views/login/types'

export const loginApi = (data: LoginFormData) => {
  return request<any, ResponseData<UserInfo>>({
    url: '/api/login',
    method: 'post',
    data,
  })
}

export const logoutApi = (data: any) => {
  return request<any, ResponseData>({
    url: '/api/logout',
    method: 'post',
    data,
  })
}

export const getUserInfoApi = (id: string) => {
  return request<any, ResponseData<UserInfo>>({
    url: `/api/getUserInfo`,
    params: {
      id,
    },
  })
}

export const getRouterApi = (role: number) => {
  return request<any, ResponseData<Record<string, any>>>({
    url: `/api/getRouter`,
    params: {
      role,
    },
  })
}
