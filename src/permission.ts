import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index.ts'
import SETTING from '@/setting/index.ts'
import { GET_TOKEN } from '@/utils/common/token.ts'
import useUserStore from '@/stores/modules/user.ts'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
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
        next()
      } else {
        // 获取用户信息
        next()
      }
    }
  } else {
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
