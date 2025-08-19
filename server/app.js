import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import indicatorManageRouter from './router/indicatorManage.js'
import schemeManageRouter from './router/schemeManage.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log('请求路径：', req.originalUrl)
  next()
})

app.use('/indicatorManage', indicatorManageRouter)
app.use('/schemeManage', schemeManageRouter)

// 错误处理中间件
app.use((err, req, res, next) => {
  const { status = 500, message = '服务器错误' } = err
  console.log('服务器错误：', message)
  res.status(status).send({
    code: 500,
    message,
  })
})

app.listen('3000', () => {
  console.log('http://localhost:3000')
})
