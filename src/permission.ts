import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index.ts'
import SETTING from '@/setting/index.ts'
import { GET_TOKEN } from '@/utils/common/token.ts'
import useUserStore from '@/stores/modules/user.ts'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const username = userStore.username
  NProgress.start()
  document.title = `${SETTING.SYSTEM_NAME}-${to.meta.title}`
  const token: NullType<string> = GET_TOKEN()
  if (token) {
    // 有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        // 如果前往的页面不是登录页面，并且获取到了用户信息
        next()
      } else {
        // 如果没有获取到用户信息，则获取用户信息和路由
        try {
          await userStore.getUserInfo()
          next({ ...to, replace: true })
        } catch (e) {
          // 获取用户信息失败（token失效或被修改的情况），移除token，跳转到登录页
          await userStore.logout()
          next({ path: '/login' })
          console.log(e)
        }
      }
    }
  } else {
    userStore.clearUserInfo()
    // 没有token
    if (to.path === '/login') {
      next()
    } else {
      ElMessage.error('请先登录')
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
