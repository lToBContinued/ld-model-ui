import Mock from 'mockjs'

Mock.mock('api/home/recentRecords', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    total: 20,
    currentPage: 1,
    pageSize: 10,
    'data|20': [
      {
        id: /^[a-z0-9]{8}$/, // 8位随机字符串ID
        company: '@ctitle(3, 6)@pick(["有限公司", "股份有限公司", "集团", "企业", "研究所"])', // 5-10字中文公司名称
        date: '@date("yyyy-MM-dd")', // 格式化为YYYY-MM-DD的日期
        assessType: '@pick(["年度评估", "季度评估", "月度评估", "专项评估"])', // 从数组中随机选择评估类型
        score: '@integer(0, 100)', // 0-100的随机整数得分
        level: '@pick(["A", "B", "C"])', // 随机评估等级A/B/C
      },
    ],
  })
})
