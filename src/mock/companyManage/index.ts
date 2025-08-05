import Mock from 'mockjs'

Mock.mock('api/home/recentRecords', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    'data|20': [
      {
        // 日期：2024年及以后的随机日期
        date: function () {
          const year = Mock.Random.integer(2024, 2026) // 2024-2026年
          const month = Mock.Random.integer(1, 12)
          const day = Mock.Random.integer(1, 28) // 避免月份天数问题

          // 格式化日期为yyyy-MM-dd
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        },
        // 随机用户名（中文姓名）
        name: '@cname',
        // 随机地址
        address: '@county(true)', // 生成省市区完整地址
        // 评估类型（随机选择）
        'assessType|1': ['年度评估', '季度评估', '月度评估', '专项评估', '临时评估'],
        // 0-100之间的随机分数
        'score|0-100': 0,
        // 1-3之间的随机等级
        'level|1-3': 1,
      },
    ],
  })
})
