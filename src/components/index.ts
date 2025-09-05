import type { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ModuleTitle from '@/components/module-title.vue'
import ZkButton from './zk/zk-button.vue'
import ZkCard from './zk/zk-card.vue'
import ZkCheckbox from './zk/zk-checkbox.vue'

const allGlobalComponent: Record<string, Component> = {
  ModuleTitle,
  ZkButton,
  ZkCard,
  ZkCheckbox,
}

// 对外暴露插件对象
export default {
  install(app: App) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
