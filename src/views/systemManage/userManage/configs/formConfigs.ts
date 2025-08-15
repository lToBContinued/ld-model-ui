export const searchUserFormConfig = [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    config: {
      placeholder: '请输入用户名',
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
    prop: 'phone',
    label: '手机号',
    type: 'input',
    config: {
      placeholder: '请输入手机号',
    },
  },
]
