import { evaluateTypeMap } from '@/views/evaluateResult/configs/map.ts'

export const evaluateResultFormConfig = [
  {
    prop: 'companyName',
    label: '公司名称',
    type: 'select',
  },
  {
    prop: 'startDate',
    label: '开始日期',
    type: 'datePicker',
    config: {
      type: 'datetime',
      format: 'YYYY/MM/DD HH:mm',
    },
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'datePicker',
    config: {
      type: 'datetime',
      format: 'YYYY/MM/DD HH:mm',
    },
  },
  {
    prop: 'subject',
    label: '评估科目',
    type: 'select',
    config: {
      options: Object.entries(evaluateTypeMap).map(([key, value]) => ({
        label: value,
        value: Number(key),
      })),
    },
  },
]
