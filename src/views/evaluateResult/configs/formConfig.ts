export const evaluateResultFormConfig: Record<string, any> = [
  {
    prop: 'department',
    label: '公司名称',
    type: 'select',
    config: {
      filterable: true,
      options: [],
    },
  },
  {
    prop: 'startDate',
    label: '开始日期',
    type: 'datePicker',
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'endDate',
    label: '结束日期',
    type: 'datePicker',
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'subject',
    label: '评估科目',
    type: 'cascader',
    config: {
      filterable: true,
      props: {
        checkStrictly: true,
        label: 'name',
        lazy: true,
        value: 'id',
      },
      options: [],
    },
  },
]
