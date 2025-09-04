import { dayjs } from 'element-plus'

export const evaluateResultTableConfig = [
  {
    prop: 'departmentName',
    label: '参训单位',
    width: '150px',
  },
  {
    prop: 'subject',
    label: '评估科目',
  },
  {
    prop: 'assessTime',
    label: '评估时间',
    width: '200px',
    render: ({ assessTime }: { assessTime: string }) => {
      const date = new Date(assessTime)
      return dayjs(date).format('YYYY-MM-DD')
    },
  },
  {
    prop: 'totalScore',
    label: '综合得分',
    width: '100px',
  },
  {
    prop: 'level',
    label: '评估等级',
    slot: 'level',
    width: '100px',
    align: 'center',
    headerAlign: 'center',
  },
  {
    label: '操作',
    slot: 'operation',
    width: '200px',
    align: 'center',
    headerAlign: 'center',
  },
]
