import Mock from 'mockjs'

Mock.mock('/api/schema/participateUnitsSelectOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: [
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: 'xxxx旅',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: 'xxxx旅',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: 'xxxx旅',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: 'xxxx旅',
      },
      {
        id: /^[a-z0-9]{8}$/,
        companyCode: /^[a-z0-9]{8}$/,
        companyName: 'xxxx旅',
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
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '理论研究成果',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '典型目标TC与区域JS',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: 'ZZ统筹',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '任务规划',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '动态CG',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '综合FH',
      },
      {
        id: /^[a-z0-9]{4}$/,
        subjectCode: /^[a-z0-9]{8}$/,
        subjectName: '综合YL',
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
