import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORE_NAMES } from '@/stores/storeNames'
import { loginApi } from '@/api/login'
import { LoginFormData } from '@/views/login/types'
import { SET_TOKEN } from '@/utils/common/token.ts'

const useUserStore = defineStore(STORE_NAMES.USER, () => {
  const userId = ref('')
  const username = ref('')
  const phone = ref('')
  const delFlag = ref<number>()

  // 登录
  const login = async (loginInfo: LoginFormData) => {
    const res = await loginApi(loginInfo)
    if (res.status === 200) {
      userId.value = res.data.id
      username.value = res.data.username
      phone.value = res.data.phone
      delFlag.value = res.data.delFlag
      SET_TOKEN(res.token!)
    }
  }
  // 获取用户信息
  const getUserInfo = () => {}
  // 退出登录
  const logout = () => {}

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
