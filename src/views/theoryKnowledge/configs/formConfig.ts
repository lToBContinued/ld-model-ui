export const theoryKnowledgeFormConfig = [
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'employeeNumber',
    label: '员工编号',
  },
  {
    prop: 'department',
    label: '部门',
  },
  {
    prop: 'position',
    label: '职位',
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
