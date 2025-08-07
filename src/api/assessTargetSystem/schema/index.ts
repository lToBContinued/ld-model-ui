import request from '@/utils/request.ts'

export const getParticipateUnitsSelectOptionsApi = () => {
  return request({
    url: 'api/formConfig/participateUnitsSelectOptions',
  })
}
