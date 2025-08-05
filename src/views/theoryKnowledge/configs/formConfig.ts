export const theoryKnowledgeAssessFormConfig = [
  {
    prop: 'company',
    label: '评估单位',
  },
  {
    prop: 'companyNumber',
    label: '单位编号',
  },
  {
    prop: 'targeted',
    label: '成果针对性 (0-20)',
    type: 'numberInput',
  },
  {
    prop: 'comprehensive',
    label: '成果全面性 (0-20)',
    type: 'numberInput',
  },
  {
    prop: 'accuracy',
    label: '成果准确性 (0-20)',
    type: 'numberInput',
  },
  {
    prop: 'supportive',
    label: '专业知识(0-100)',
    type: 'numberInput',
  },
  {
    prop: 'remark',
    label: '备注',
    config: {
      type: 'textarea',
    },
  },
]

export const theoryKnowledgeSearchFormConfig = [
  {
    prop: 'company',
    label: '评估单位',
    type: 'select',
    config: {
      options: [
        {
          label: '单位1',
          value: '1',
        },
        {
          label: '单位2',
          value: '2',
        },
        {
          label: '单位3',
          value: '3',
        },
      ],
    },
  },
  {
    prop: 'startDate',
    label: '开始日期',
    type: 'datePicker',
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'datePicker',
  },
]
