import Mock from 'mockjs'

const userInfo = {
  id: 123456789,
  username: '张三',
  phone: '13800000000',
  createTime: new Date(),
  updateTime: new Date(),
  delFlag: 1,
}

Mock.mock('api/login', 'post', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: {
      id: userInfo.id,
    },
    token: 'Bearer ' + Mock.Random.string('lower', 64),
  })
})

Mock.mock('api/logout', 'post', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
  })
})

Mock.mock('api/getUserInfo', 'get', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: userInfo,
  })
})
