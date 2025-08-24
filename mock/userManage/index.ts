import Mock from 'mockjs'

Mock.mock('/api/getUserList', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    total: 100,
    currentPage: 1,
    pageSize: 10,
    'data|10': [
      {
        id: '@id', // 8位随机字符串ID
        username: '@cname()',
        phone:
          /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
        password: '@string(6, 10)',
        createTime: '@date("yyyy-MM-dd")',
        updateTime: '@date("yyyy-MM-dd")',
        delFlag: '@pick([0, 1])',
      },
    ],
  })
})
