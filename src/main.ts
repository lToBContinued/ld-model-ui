import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import pinia from './stores/index.ts'
import 'virtual:svg-icons-register'
import Particles from 'particles.vue3'
// import '/mock/index.ts'
import registerDirectives from '@/directives/index.ts'
import 'ant-design-vue/dist/reset.css'
// import './permission.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pinia)
app.use(Particles)
registerDirectives(app)

app.mount('#app')

document.documentElement.className = 'dark'
const env = import.meta.env
console.info(
  `%c🚀 当前运行环境：${env.MODE}`,
  `font-size: 12px;
   color: #fff;
   background: linear-gradient(90deg,#EE82EE 0%,#00D1FF 100%);
   padding: 4px 10px;
   border-radius: 4px;
   font-weight: 700;
   text-shadow: 1px 1px 2px rgba(0,0,0,.4);`,
)
