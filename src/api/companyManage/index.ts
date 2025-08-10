import request from '@/utils/request.ts'

export const getAssessCompanyListApi = () => {
  return request({
    url: '/api/companyManage/assessCompanyList',
  })
}
