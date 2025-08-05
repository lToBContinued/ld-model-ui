import Mock from 'mockjs'

Mock.mock('api/companyManage/assessCompanyList', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    total: 20,
    currentPage: 1,
    pageSize: 10,
    'data|20': [
      {
        // 单位名称（随机中文企业名称）
        company: '@ctitle(3, 6)@pick(["有限公司", "股份有限公司", "集团", "企业", "研究所"])',
        // 单位编号（格式：前缀+6位数字）
        companyNumber: 'CP' + Mock.Random.integer(100000, 999999),
        // 部门（从常见部门中随机选择）
        'department|1': ['技术部', '财务部', '人力资源部', '市场部', '销售部', '行政部', '研发中心', '生产部'],
        // 代号（2位大写字母+3位数字）
        code: () => {
          const letters = Mock.Random.string('upper', 2)
          const numbers = Mock.Random.integer(100, 999)
          return `${letters}${numbers}`
        },
      },
    ],
  })
})
