export const userManageTableColumns = [
  {
    type: 'index',
    label: '序号',
    width: '60px',
    headerAlign: 'center',
    align: 'center',
  },
  {
    prop: 'username',
    label: '姓名',
  },
  {
    prop: 'role',
    label: '角色',
  },
  {
    prop: 'department',
    label: '部门',
  },
  {
    prop: 'delFlag',
    label: '状态',
    slot: 'delFlag',
    width: '100px',
    align: 'center',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    slot: 'operation',
    label: '操作',
    width: '150px',
    align: 'center',
  },
]
