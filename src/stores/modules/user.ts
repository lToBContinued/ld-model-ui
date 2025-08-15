import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORE_NAMES } from '@/stores/storeNames'
import { getUserInfoApi, loginApi, logoutApi } from '@/api/login'
import { LoginFormData } from '@/views/login/types'
import { REMOVE_TOKEN, SET_TOKEN } from '@/utils/common/token.ts'
import useMenuStore from '@/stores/modules/menu.ts'

const useUserStore = defineStore(STORE_NAMES.USER, () => {
  const userId = ref(localStorage.getItem('userId'))
  const username = ref('')
  const phone = ref('')
  const delFlag = ref<number>()
  const role = ref<number>()
  const menuStore = useMenuStore()

  // 登录
  const login = async (loginInfo: LoginFormData) => {
    console.log('>>>>> file: user.ts ~ method: login <<<<<\n', loginInfo) // TODO: 删除
    const res = await loginApi(loginInfo)
    if (res.status === 200) {
      userId.value = res.data!.id!
      localStorage.setItem('userId', res.data!.id!)
      SET_TOKEN(res.token!)
      await getUserInfo()
      return Promise.resolve('ok')
    } else {
      ElMessage.error('登录失败，请重试')
      return Promise.reject(`登录失败，错误码：${res.status}，错误信息：${res.msg}`)
    }
  }
  // 获取用户信息
  const getUserInfo = async () => {
    const res = await getUserInfoApi(userId.value!)
    if (res.status === 200) {
      username.value = res.data!.username! || '用户'
      phone.value = res.data!.phone!
      delFlag.value = res.data!.delFlag!
      role.value = res.data!.role!
      return Promise.resolve('ok')
    } else {
      ElMessage.error('获取用户信息失败，请重试')
      return Promise.reject(`获取用户信息失败，错误码：${res.status}，错误信息：${res.msg}`)
    }
  }
  // 退出登录
  const logout = async () => {
    const res = await logoutApi({ id: userId.value })
    if (res.status === 200) {
      clearUserInfo()
      REMOVE_TOKEN()
      menuStore.removeRoutes()
      return 'ok'
    }
  }
  const clearUserInfo = () => {
    userId.value = ''
    localStorage.removeItem('userId')
    username.value = ''
    phone.value = ''
    delFlag.value = undefined
  }

  return {
    userId,
    username,
    phone,
    delFlag,
    role,
    login,
    getUserInfo,
    logout,
    clearUserInfo,
  }
})

export default useUserStore
