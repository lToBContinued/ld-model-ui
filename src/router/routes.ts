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
    path: '/assessTargetSystem',
    component: () => import('@/layout/index.vue'),
    redirect: 'library',
    meta: {
      title: '评估指标体系',
      icon: '',
      hidden: false,
      disabled: false,
      iconShow: false,
    },
    children: [
      {
        path: '/assessTargetSystem/library',
        name: 'library',
        component: () => import('@/views/assessTargetSystem/library/index.vue'),
        meta: {
          title: '评估指标库列表',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/assessTargetSystem/scheme',
        name: 'scheme',
        component: () => import('@/views/assessTargetSystem/scheme/index.vue'),
        meta: {
          title: '评估方案',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/assessTargetSystem/indicatorManage',
        name: 'indicatorManage',
        component: () => import('@/views/assessTargetSystem/indicatorManage/index.vue'),
        meta: {
          title: '指标体系管理',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/assessTargetSystem/schemeManage',
        name: 'schemeManage',
        component: () => import('@/views/assessTargetSystem/schemeManage/index.vue'),
        meta: {
          title: '评估方案创建',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/assessTargetSystem/indicatorAlgorithm',
        name: 'IndicatorAlgorithm',
        component: () => import('@/views/assessTargetSystem/indicatorAlgorithm/index.vue'),
        meta: {
          title: '算法配置',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/runAssess',
        name: 'runAssess',
        component: () => import('@/views/assessTargetSystem/runAssess/index.vue'),
        meta: {
          title: '评估管理',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/evaluateResult',
        name: 'evaluateResult',
        component: () => import('@/views/evaluateResult/index.vue'),
        meta: {
          title: '评估结果',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '/systemManage',
    component: () => import('@/layout/index.vue'),
    redirect: '/systemManage/index',
    meta: {
      title: '系统管理',
      icon: '',
      hidden: false,
      disabled: false,
      iconShow: false,
    },
    children: [
      {
        path: '/systemManage/companyManage',
        name: 'companyManage',
        component: () => import('@/views/systemManage/companyManage/index.vue'),
        meta: {
          title: '评估单位管理',
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
