import { dayjs } from 'element-plus'
import { evaluateTypeMap } from '@/views/evaluateResult/configs/map.ts'

export const evaluateResultTableConfig = [
  {
    prop: 'name',
    label: '姓名',
    width: '150px',
  },
  {
    prop: 'evaluateType',
    label: '评估类型',
    render: ({ evaluateType }: { evaluateType: number }) => {
      return evaluateTypeMap[evaluateType]
    },
  },
  {
    prop: 'evaluateTime',
    label: '评估时间',
    width: '300px',
    render: ({ evaluateTime }: { evaluateTime: Date[] }) => {
      return evaluateTime
        .map((item: Date) => {
          return dayjs(item).format('YYYY-MM-DD HH:mm')
        })
        .join(' 至 ')
    },
  },
  {
    prop: 'score',
    label: '综合得分',
    width: '150px',
  },
  {
    prop: 'level',
    label: '评估等级',
    slot: 'level',
    width: '100px',
  },
  {
    label: '操作',
    slot: 'operation',
    width: '300px',
  },
]
