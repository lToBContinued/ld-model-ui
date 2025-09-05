export interface GetIndicatorConfigBySchemeApiRes {
  children: GetIndicatorConfigBySchemeApiRes[]
  description?: any
  formConfig: NullType<string>
  id: number
  name: string
  parentId?: any
  refIndicatorId: number
  subtreeId: number
}

export interface GetTrainCompanyApiRes {
  records: {
    id: number
    departmentName: string
    departmentId: string
    createdAt?: any
    updatedAt?: any
    delFlag: number
  }[]
}

export interface GetRunAssessIdApiSend {
  schemeId: number
  title: string
}

export interface GetRunAssessIdApiRes {
  id: string
}

export interface SaveEnterAssessDataApiSend {
  runId: number
  baseInfo: {
    departmentName: string
    trainTime: Date
    assessTime: Date
    expert: string
  }
  enterData: {
    paramId: number // 指标id
    sourceKey: string // 选择框的label（如果是选择框的话）
    value: number // 填写值
    remark: string // 备注
  }[]
}

export interface CalculateAssessDataRes {
  runId: number
  totalScore: number
  nodes: {
    nodeId: number
    score: number
  }[]
}
