import Mock from 'mockjs'

Mock.mock('api/schema/participateUnitsSelectOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    'data|10': [
      {
        id: /^[a-z0-9]{8}$/, // 8位随机字符串ID
        companyCode: /^[a-z0-9]{8}$/, // 8位随机字符串ID
        companyName: '@ctitle(2, 6)@pick(["有限公司", "股份有限公司", "集团", "企业", "研究所"])', // 5-10字中文公司名称
      },
    ],
  })
})

Mock.mock('api/schema/getAssessSubjectOptions', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    'data|10': [
      {
        id: /^[a-z0-9]{8}$/, // 8位随机字符串ID
        subjectCode: /^[a-z0-9]{8}$/, // 8位随机字符串ID
        subjectName: '@ctitle(2, 6)@pick(["科目"])', // 5-10字中文名称
      },
    ],
  })
})
