export const addSchemeGroupFormConfig = [
  {
    prop: 'schemeName',
    label: '方案组名称',
    type: 'input',
    rules: [{ required: true, message: '请输入方案组名称', trigger: 'blur' }],
  },
  {
    prop: 'schemeDesc',
    label: '方案组描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
]
