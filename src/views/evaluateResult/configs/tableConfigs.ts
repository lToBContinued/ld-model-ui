import { formatDate } from '@/utils/common/formatData.ts'

export const evaluateResultTableConfig = [
  {
    prop: 'departmentName',
    label: '参训单位',
    width: '150px',
  },
  {
    prop: 'indicatorSystemName',
    label: '评估科目',
  },
  {
    prop: 'assessTime',
    label: '评估时间',
    width: '200px',
    render: ({ assessTime }: { assessTime: string }) => {
      return formatDate(assessTime)
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

export const recordDetailTableColumn = [
  {
    prop: 'name',
    label: '指标名称',
  },
  {
    prop: 'description',
    label: '指标描述',
  },
  {
    prop: 'score',
    label: '指标得分',
    width: '100px',
    align: 'center',
    headerAlign: 'center',
    render({ score }: { score: number }) {
      return score.toFixed(2)
    },
  },
]
