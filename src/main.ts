import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import pinia from './stores/index.ts'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'
import Particles from 'particles.vue3'
import '/mock/index.ts'
import registerDirectives from '@/directives/index.ts'
// import './permission.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(Particles)
registerDirectives(app)

app.mount('#app')
