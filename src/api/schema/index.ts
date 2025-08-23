import request from '@/utils/request.ts'

/**
 * @description 获取参训单位下拉选项
 */
export const getParticipateUnitsSelectOptionsApi = () => {
  return request({
    url: '/api/schema/participateUnitsSelectOptions',
  })
}

/**
 * @description 获取评估科目下拉选项
 */
export const getAssessSubjectOptionsApi = () => {
  return request({
    url: '/api/schema/getAssessSubjectOptions',
  })
}

/**
 * @description 获得评估结果表格
 */
export const getAssessResultApi = () => {
  return request({
    url: '/api/schema/getAssessResult',
  })
}
