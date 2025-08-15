import { defineStore } from 'pinia'
import { STORE_NAMES } from '@/stores/storeNames'
import { ref } from 'vue'
import { getRouterApi } from '@/api/login'
import router from '@/router/index.ts'

const useMenuStore = defineStore(
  STORE_NAMES.MENU,
  () => {
    const menuData = ref<any[]>([])
    const dynamicRoutes = ref<any[]>([])
    const errorRoutes = {
      name: 'any',
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/404/index.vue'),
      roles: ['all', '0', '1', '2'],
      meta: {
        title: '404',
        icon: '',
        hidden: true,
        disabled: false,
      },
    }

    const addRoutes = async (role: number) => {
      removeRoutes()
      const res = await getRouterApi(role)
      menuData.value = res.data as any[]
      dynamicRoutes.value = formatRoutes(res.data)
      dynamicRoutes.value.forEach((route: any) => {
        router.addRoute(route)
      })
      router.addRoute(errorRoutes)
    }
    // 格式化路由
    const formatRoutes = (routes: any) => {
      const result: any[] = []
      routes.forEach((route: any) => {
        if (!route.children) {
          result.push({
            ...route,
            component: loadComponent(route.component),
          })
        } else {
          result.push({
            ...route,
            component: loadComponent(route.component),
            children: formatRoutes(route.children),
          })
        }
      })
      return result
    }
    // 加载路由模块
    const loadComponent = (url: string) => {
      const layout = import.meta.glob('@/layout/index.vue')
      const views = import.meta.glob('@/views/**/*.vue')
      if (url === 'layout/index') {
        return layout['/src/layout/index.vue']
      } else {
        return views[`/src/views/${url}.vue`]
      }
    }
    const removeRoutes = () => {
      if (dynamicRoutes.value.length === 0) return
      dynamicRoutes.value.forEach((route: any) => {
        router.removeRoute(route.name)
      })
      router.removeRoute('any')
      dynamicRoutes.value = []
      menuData.value = []
    }

    return {
      menuData,
      addRoutes,
      removeRoutes,
    }
  },
  { persist: true },
)

export default useMenuStore
