import axios from 'axios'
import router from '@/router/index.js'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    let message
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'Token 过期'
        break
      case 403:
        message = '无权访问'
        router.back()
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
    }
    ElMessage({
      type: 'error',
      message: message,
    })
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default instance
