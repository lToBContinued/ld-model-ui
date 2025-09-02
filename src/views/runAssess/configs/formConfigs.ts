import { BaseFormConfigItem } from '@/views/runAssess/types.ts'

export const formConfig: BaseFormConfigItem[] = [
  {
    prop: 'departmentName',
    label: '参训单位',
    type: 'select',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'trainTime',
    label: '参训时间',
    type: 'datePicker',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'assessTime',
    label: '评估时间',
    type: 'datePicker',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'expert',
    label: '专家',
    type: 'input',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
  },
]
