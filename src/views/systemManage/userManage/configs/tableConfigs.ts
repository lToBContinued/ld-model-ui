export const userManageTableColumns = [
  {
    type: 'index',
  },
  {
    prop: 'username',
    label: '姓名',
  },
  {
    prop: 'phone',
    label: '手机号',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'updateTime',
    label: '更新时间',
  },
  {
    prop: 'delFlag',
    label: '状态',
    slot: 'delFlag',
  },
  {
    slot: 'operation',
    label: '操作',
    width: '200px',
  },
]
