import { App } from 'vue'

const HIGHLIGHT_COLOR = '#e3edff'

export default function (app: App) {
  app.directive('highlight', {
    mounted(el: HTMLElement) {
      const childrenList: HTMLCollection = el.parentElement?.children as HTMLCollection
      const handelClick = () => {
        for (let i = 0; i < childrenList.length; i++) {
          ;(childrenList[i] as HTMLElement).style.backgroundColor = '#fff'
        }
        el.style.backgroundColor = HIGHLIGHT_COLOR
      }
      ;(el as any)._handelClick = handelClick
      el.addEventListener('click', handelClick)
    },
    unmounted(el: HTMLElement) {
      const handelClick = (el as any)._handelClick
      if (handelClick) {
        el.removeEventListener('click', handelClick)
        delete (el as any)._handelClick
      }
    },
  })
}
