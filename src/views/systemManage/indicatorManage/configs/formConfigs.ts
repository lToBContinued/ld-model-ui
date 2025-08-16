export const indicatorConfigFormCofnig = [
  {
    prop: 'parent',
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
    config: {
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'description',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
  {
    prop: 'type',
    label: '节点类型',
    type: 'radio',
    config: {
      options: [
        { label: '录入节点', value: '0' },
        { label: '计算节点', value: '1' },
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
    prop: 'description',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
]
