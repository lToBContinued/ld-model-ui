import { Search } from '@element-plus/icons-vue'

export const searchUserFormConfig = [
  {
    prop: 'username',
    type: 'input',
    config: {
      prefixIcon: Search,
      placeholder: '请输入用户名',
      width: '200px',
    },
  },
  {
    prop: 'role',
    type: 'select',
    config: {
      emptyValues: [undefined],
      options: [
        {
          label: '所有角色',
          value: '',
        },
        {
          label: '管理员',
          value: 0,
        },
        {
          label: '普通用户',
          value: 1,
        },
      ],
      valueOnClear: undefined,
      width: '200px',
    },
  },
  {
    prop: 'status',
    type: 'select',
    config: {
      emptyValues: [undefined],
      options: [
        {
          label: '所有状态',
          value: '',
        },
        {
          label: '激活',
          value: 0,
        },
        {
          label: '未激活',
          value: 1,
        },
        {
          label: '锁定',
          value: 2,
        },
      ],
      valueOnClear: undefined,
      width: '200px',
    },
  },
]

export const userFormConfig = [
  {
    prop: 'id',
    label: 'id',
    type: 'input',
    config: {
      disabled: true,
      placeholder: '用户id为系统生成，无需手动输入',
    },
  },
  {
    prop: 'username',
    label: '姓名',
    type: 'input',
    config: {
      placeholder: '请输入姓名',
    },
  },
  {
    prop: 'password',
    label: '密码',
    type: 'input',
    config: {
      placeholder: '请输入密码',
    },
  },
  {
    prop: 'role',
    label: '角色',
    type: 'select',
    config: {
      options: [
        {
          label: '管理员',
          value: 0,
        },
        {
          label: '普通用户',
          value: 1,
        },
      ],
    },
  },
  {
    prop: 'department',
    label: '部门',
    type: 'input',
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    config: {
      options: [
        {
          label: '激活',
          value: 0,
        },
        {
          label: '未激活',
          value: 1,
        },
      ],
    },
  },
]
