import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORE_NAMES } from '@/stores/storeNames'
import { getUserInfoApi, loginApi, logoutApi } from '@/api/login'
import { LoginFormData } from '@/views/login/types'
import { REMOVE_TOKEN, SET_TOKEN } from '@/utils/common/token.ts'

const useUserStore = defineStore(STORE_NAMES.USER, () => {
  const userId = ref('')
  const username = ref('')
  const phone = ref('')
  const delFlag = ref<number>()

  // 登录
  const login = async (loginInfo: LoginFormData) => {
    const res = await loginApi(loginInfo)
    if (res.status === 200) {
      userId.value = res.data!.id!
      username.value = res.data!.username!
      phone.value = res.data!.phone!
      delFlag.value = res.data!.delFlag!
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
    const res = await getUserInfoApi()
    if (res.status === 200) {
      username.value = res.data!.username!
      phone.value = res.data!.phone!
      delFlag.value = res.data!.delFlag!
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
      return 'ok'
    }
  }
  const clearUserInfo = () => {
    userId.value = ''
    username.value = ''
    phone.value = ''
    delFlag.value = undefined
  }

  return {
    userId,
    username,
    phone,
    delFlag,
    login,
    getUserInfo,
    logout,
  }
})

export default useUserStore
