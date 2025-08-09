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
    data: userInfo,
    token: 'Bearer ' + Mock.Random.string('lower', 64),
  })
})
