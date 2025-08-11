export default [
  {
    path: '/',
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
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/theoryKnowledge',
        name: 'theoryKnowledge',
        component: () => import('@/views/theoryKnowledge/index.vue'),
        meta: {
          title: '理论研究成果',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
]
