import request from '@/utils/request.ts'
import { UserInfo } from '@/views/systemManage/types.ts'

export const getUserListApi = () => {
  return request<any, ResponseData<UserInfo[]>>({
    url: '/api/getUserList',
  })
}
