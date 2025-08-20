export interface SchemaBasicAssessFormData {
  participateUnits: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  experts: string
  subject: string
}

export interface AssessFormData {
  target: UndefinedType<number>
  comprehensive: UndefinedType<number>
  accuracy: UndefinedType<number>
  supportive: UndefinedType<number>
  remark: string
}

export interface ResultFilterFormData {
  company: string
  experts: string
  startDate: NullType<Date>
  endDate: NullType<Date>
}

export interface BaseFormData {
  company: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  expert: string
}

export interface BaseFormConfigItem {
  prop: string
  label: string
  type: string
  config?: {
    type?: string
    options?: Record<string, any>
    format?: string
  }
}

export interface IndicatorListItem {
  indicatorId: number
  indicatorName: string
  indicatorDesc: string
  level: number
  formConfig: {
    prop: string
    type: string
    value: NullType<number | string>
    result: NullType<number | string>
    config?: {
      min?: number
      max?: number
      step?: number
    }
  }
  children: IndicatorListItem[]
}
