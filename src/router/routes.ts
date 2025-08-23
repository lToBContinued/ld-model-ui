/*export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      icon: '',
      hidden: true,
      disabled: true,
      iconShow: false,
    },
  },
]*/

export default [
  {
    path: '',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页概览',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    name: 'any',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      icon: '',
      hidden: true,
      disabled: false,
    },
  },
]
