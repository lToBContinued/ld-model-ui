export const schemaBasicAssessFormConfig = [
  {
    prop: 'participateUnits',
    label: '参训单位',
    type: 'select',
    config: {
      options: [],
    },
  },
  {
    prop: 'trainingTime',
    label: '训练时间',
    type: 'datePicker',
    config: {
      type: 'date',
      placeholder: '请选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: '',
    },
  },
  {
    prop: 'assessTime',
    label: '评估时间',
    type: 'datePicker',
    config: {
      type: 'date',
      placeholder: '请选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: '',
    },
  },
  {
    prop: 'experts',
    label: '专家',
    type: 'input',
  },
  {
    prop: 'subject',
    label: '评估科目',
    type: 'select',
    config: {
      options: [
        {
          label: '科目1',
          value: '1',
        },
        {
          label: '科目2',
          value: '2',
        },
        {
          label: '科目3',
          value: '3',
        },
      ],
      placeholder: '请输入评估科目',
    },
  },
]

export const assessFormConfig = [
  {
    prop: 'target',
    label: '成果针对性',
    type: 'select',
    config: {
      options: [
        {
          label: '5',
          value: 5,
        },
        {
          label: '10',
          value: 10,
        },
        {
          label: '15',
          value: 15,
        },
        {
          label: '20',
          value: 20,
        },
      ],
    },
  },
  {
    prop: 'comprehensive',
    label: '成果全面性',
    type: 'select',
    config: {
      options: [
        {
          label: '5',
          value: 5,
        },
        {
          label: '10',
          value: 10,
        },
        {
          label: '15',
          value: 15,
        },
        {
          label: '20',
          value: 20,
        },
      ],
    },
  },
  {
    prop: 'accuracy',
    label: '成果准确性',
    type: 'select',
    config: {
      options: [
        {
          label: '5',
          value: 5,
        },
        {
          label: '10',
          value: 10,
        },
        {
          label: '15',
          value: 15,
        },
        {
          label: '20',
          value: 20,
        },
      ],
    },
  },
  {
    prop: 'supportive',
    label: '成果支撑性',
    type: 'select',
    config: {
      options: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '20',
          value: 20,
        },
        {
          label: '30',
          value: 30,
        },
        {
          label: '40',
          value: 40,
        },
      ],
    },
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
]
