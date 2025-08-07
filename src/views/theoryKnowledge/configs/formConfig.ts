export const theoryKnowledgeFormConfig = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
  },
  {
    prop: 'employeeNumber',
    label: '员工编号',
    type: 'input',
  },
  {
    prop: 'department',
    label: '部门',
    type: 'input',
  },
  {
    prop: 'position',
    label: '职位',
    type: 'input',
  },
  {
    prop: 'basicKnowledge',
    label: '基础知识(0-100)',
    type: 'numberInput',
  },
  {
    prop: 'professionalKnowledge',
    label: '专业知识(0-100)',
    type: 'numberInput',
  },
  {
    prop: 'actualApplication',
    label: '实际应用(0-100)',
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
