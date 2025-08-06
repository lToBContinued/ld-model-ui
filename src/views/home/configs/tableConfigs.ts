export const recentRecordsColumns = [
  {
    prop: 'company',
    label: '评估单位',
    width: 180,
  },
  {
    prop: 'date',
    label: '评估时间',
    width: 180,
  },
  {
    prop: 'assessType',
    label: '评估类型',
    defaultValue: '暂无地址',
  },
  {
    prop: 'score',
    label: '得分',
    defaultValue: '0',
    width: '80',
  },
  {
    prop: 'level',
    label: '评估等级',
    slot: 'level',
  },
  {
    label: '操作',
    slot: 'operation',
  },
]
