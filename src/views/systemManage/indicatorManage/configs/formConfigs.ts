export const indicatorConfigFormCofnig = [
  {
    prop: 'parentName',
    label: '父级指标',
    type: 'input',
    config: {
      disabled: true,
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    rules: [{ required: true, message: '请输入指标名称', trigger: ['blur'] }],
    config: {
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
  {
    prop: 'isLeaf',
    label: '节点类型',
    type: 'radio',
    config: {
      options: [
        { label: '计算节点', value: 0 },
        { label: '录入节点', value: 1 },
      ],
    },
  },
  {
    prop: 'config',
    label: '指标配置',
    type: 'jsonEditor',
  },
]

export const addRootFormConfig = [
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
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
export const addChildNodeFormConfig = [
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    rules: [{ required: true, message: '请输入指标名称', trigger: ['blur'] }],
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
