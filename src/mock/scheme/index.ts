import Mock from 'mockjs'

Mock.mock('/api/schema/participateUnitsSelectOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: [
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: '公司1',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: '公司2',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: '公司3',
      },
    ],
  })
})

Mock.mock('/api/schema/getAssessSubjectOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: [
      {
        id: /^[a-z0-9]{8}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '科目1',
      },
      {
        id: /^[a-z0-9]{8}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '科目2',
      },
      {
        id: /^[a-z0-9]{8}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '科目3',
      },
    ],
  })
})

Mock.mock('api/schema/getAssessResult', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: [
      {
        subject: '成果针对性',
        score: '@integer(0, 100)',
        level: '@pick(["A", "B", "C",])',
      },
      {
        subject: '成果全面性',
        score: '@integer(0, 100)',
        level: '@pick(["A", "B", "C",])',
      },
      {
        subject: '成果准确性',
        score: '@integer(0, 100)',
        level: '@pick(["A", "B", "C",])',
      },
      {
        subject: '成果支撑性',
        score: '@integer(0, 100)',
        level: '@pick(["A", "B", "C",])',
      },
    ],
  })
})
