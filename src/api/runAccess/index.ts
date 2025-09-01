import request from '@/utils/request'
import {
  CalculateAssessDataRes,
  GetIndicatorConfigBySchemeApiRes,
  GetRunAssessIdApiSend,
  GetTrainCompanyApiRes,
  SaveEnterAssessDataApiSend,
} from '@/api/runAccess/types.ts'

/**
 * @description 获取参训单位
 */
export const getTrainCompanyApi = () => {
  return request<any, ResponseData<GetTrainCompanyApiRes>>({
    url: '/departments/page',
  })
}

/**
 * @description 根据方案获取指标列表配置
 * @param { number } schemeId 方案id
 */
export const getIndicatorConfigBySchemeApi = (schemeId: number) => {
  return request<any, ResponseData<GetIndicatorConfigBySchemeApiRes>>({
    url: `/subtrees/getIndicatorConfigBySubtree/${schemeId}`,
  })
}

/**
 * @description 获取本次评估运行id
 * @param {GetRunAssessIdApiSend} data
 * @param {string} data.title 评估标题
 * @param {number} data.schemeId 方案id
 */
export const getRunAssessIdApi = (data: GetRunAssessIdApiSend) => {
  return request<any, { id: number }>({
    url: `/subtrees/${data.schemeId}/runs`,
    method: 'POST',
    data: {
      title: data.title,
    },
  })
}

/**
 * @description 保存录入的评估数据
 * @param {} data
 */
export const saveEnterAssessDataApi = (data: SaveEnterAssessDataApiSend) => {
  return request<any, any>({
    url: `/subtree-runs/${data.runId}/values`,
    method: 'PUT',
    data: data.enterData,
  })
}

export const calculateAssessData = (runId: number) => {
  return request<any, ResponseData<CalculateAssessDataRes>>({
    url: `/subtree-runs/${runId}/evaluate`,
    method: 'POST',
  })
}
