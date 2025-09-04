import request from '@/utils/request.ts'
import {
  GetAssessResultListApiRes,
  GetAssessResultListApiSend,
  GetIndicatorSystemApiRes,
  GetSchemeByIndicatorSysApiRes,
} from '@/api/evaluateResult/types.ts'

/**
 * @description 获取指标体系列表
 */
export const getIndicatorSystemApi = () => {
  return request<any, ResponseData<GetIndicatorSystemApiRes>>({
    url: '/subtrees/getIndicatorSystem',
  })
}

/**
 * @description 获取对应评估体系下的方案
 * @param {number} indicatorId 评估体系id
 */
export const getSchemeByIndicatorSysApi = (indicatorId: number) => {
  return request<any, ResponseData<GetSchemeByIndicatorSysApiRes>>({
    url: `/subtrees/getSubtreeIdByIndicator/${indicatorId}`,
  })
}

/**
 * @description 获取评估结果列表
 * @param {number} params.departmentId 参训单位id
 * @param {Date} params.endDate 开始日期
 * @param {number} params.pageNum 页码
 * @param {number} params.pageSize 每页条数
 * @param {Date} params.startDate 开始日期
 * @param {number[]} params.subject 评估科目
 * @param {number} params.subtreeId
 */
export const getAssessResultListApi = (params: GetAssessResultListApiSend) => {
  console.log('>>>>> file: index.ts ~ method: getAssessResultListApi <<<<<\n', params) // TODO: 删除
  return request<any, ResponseData<GetAssessResultListApiRes>>({
    url: `/subtrees/runs`,
    params: params,
  })
}

/**
 * @description 获取记录详情
 * @param {number} runId
 */
export const getRecordDetailApi = (runId: number) => {
  return request<ResponseData>({
    url: `/subtree-runs/${runId}`,
  })
}
