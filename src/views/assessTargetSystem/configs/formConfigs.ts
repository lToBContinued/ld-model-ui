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
