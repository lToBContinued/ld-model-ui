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

export const indicatorOptions = [
  {
    label: 'ld指标',
    value: 'ld-1',
  },
  {
    label: 'fx指标',
    value: 'ld-2',
  },
]

export const addSecondLevelFormConfig = [
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    rules: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  },
  {
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
]

export const addChildIndicatorFormConfig = [
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    rules: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  },
  {
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
]
