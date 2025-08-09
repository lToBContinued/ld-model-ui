import request from '@/utils/request.ts'
import { LoginFormData, UserInfo } from '@/views/login/types'

export const loginApi = (data: LoginFormData) => {
  return request<any, ResponseData<UserInfo>>({
    url: 'api/login',
    method: 'post',
    data,
  })
}
