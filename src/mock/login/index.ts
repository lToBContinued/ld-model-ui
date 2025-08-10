import Mock from 'mockjs'
import getQuery from '@/mock/getQuery.ts'
import { adminUserInfo, UserUserInfo } from '@/mock/data'
import getBody from '@/mock/getBody.ts'

Mock.mock('/api/login', 'post', (req) => {
  const { username, password } = getBody(req.body)
  if (username === 'admin' && password === '123456') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        id: adminUserInfo.id,
      },
      token: 'Bearer ' + Mock.Random.string('lower', 64),
    })
  } else if (username === 'user' && password === '123456') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        id: UserUserInfo.id,
      },
      token: 'Bearer ' + Mock.Random.string('lower', 64),
    })
  } else {
    return Mock.mock({
      status: 400,
      msg: '用户名或密码错误',
    })
  }
})

Mock.mock('/api/logout', 'post', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
  })
})

Mock.mock(/api\/getUserInfo/, 'get', (req) => {
  const id = getQuery(req.url, 'id')
  if (id === 'admin123456') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: adminUserInfo,
    })
  } else if (id === 'user123456') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: UserUserInfo,
    })
  } else {
    return Mock.mock({
      status: 400,
      msg: '用户不存在',
    })
  }
})
