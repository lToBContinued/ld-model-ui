import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORE_NAMES } from '@/stores/storeNames'

const useSettingStore = defineStore(STORE_NAMES.SETTING, () => {
  const isCollapse = ref(false)

  // 菜单折叠
  const changeMenuCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    changeMenuCollapse,
  }
})

export default useSettingStore
