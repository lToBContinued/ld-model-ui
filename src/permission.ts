import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index.ts'
import SETTING from '@/setting/index.ts'
import { GET_TOKEN } from '@/utils/common/token.ts'
import useUserStore from '@/stores/modules/user.ts'
import useMenuStore from '@/stores/modules/menu.ts'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
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
        if (menuStore.menuData.length === 0) {
          await menuStore.addRoutes(userStore.role!)
        }
        if (to.path === '/' || to.matched.length === 0) {
          // 如果访问的是根路径（/）或未匹配的路径，强制跳转到/home
          next('/home')
        } else {
          next() // 其他路径正常访问
        }
      } else {
        // 如果没有获取到用户信息，则获取用户信息和路由
        try {
          await userStore.getUserInfo()
          await menuStore.addRoutes(userStore.role!)
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
      menuStore.removeRoutes()
      ElMessage.error('请先登录')
      next({ path: '/login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
