export const addSchemeFormConfig = [
  {
    prop: 'schemeName',
    label: '方案名称',
    type: 'input',
    rules: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
  },
  {
    prop: 'indicatorId',
    label: '指标体系',
    type: 'select',
    rules: [{ required: true, message: '请选择指标体系', trigger: 'change' }],
    config: {
      options: [
        {
          label: 'ld指标体系',
          value: 'ld',
        },
        {
          label: 'fx指标体系',
          value: 'fx',
        },
      ],
    },
  },
  {
    prop: 'schemeDesc',
    label: '方案描述',
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

export const addSecondIndicatorFormConfig = [
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
