import { evaluateTypeMap } from '@/views/evaluateResult/configs/map.ts'

export const evaluateResultFormConfig = [
  {
    prop: 'name',
    label: '姓名',
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
    prop: 'evaluateType',
    label: '评估类型',
    type: 'select',
    config: {
      options: Object.entries(evaluateTypeMap).map(([key, value]) => ({
        label: value,
        value: Number(key),
      })),
    },
  },
]
