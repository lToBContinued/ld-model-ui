import Mock from 'mockjs'
import getQuery from '@/mock/getQuery.ts'

const userInfo = {
  id: 123456789,
  username: '张三',
  phone: '13800000000',
  createTime: new Date(),
  updateTime: new Date(),
  delFlag: 1,
}

const router = [
  {
    path: '/',
    component: 'layout/index',
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: 'home/index',
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
    name: 'assessTargetSystem',
    component: 'layout/index',
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
        component: 'assessTargetSystem/library/index',
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
        component: 'assessTargetSystem/scheme/index',
        meta: {
          title: '评估方案',
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
    component: 'layout/index',
    children: [
      {
        path: '/theoryKnowledge',
        name: 'theoryKnowledge',
        component: 'theoryKnowledge/index',
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
  {
    path: '/',
    component: 'layout/index',
    children: [
      {
        path: '/TCAndJS',
        name: 'TCAndJS',
        component: 'TCAndJS/index',
        meta: {
          title: '典型目标TC与区域JS',
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
    component: 'layout/index',
    children: [
      {
        path: '/ZZOverallPlan',
        name: 'ZZOverallPlan',
        component: 'ZZOverallPlan/index',
        meta: {
          title: 'ZZ统筹',
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
    component: 'layout/index',
    children: [
      {
        path: '/missionPlanning',
        name: 'missionPlanning',
        component: 'missionPlanning/index',
        meta: {
          title: '任务规划',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '/CG',
    name: 'CG',
    component: 'layout/index',
    redirect: 'JDAndYCAndYZ',
    meta: {
      title: '动态CG',
      icon: '',
      hidden: false,
      disabled: false,
      iconShow: false,
    },
    children: [
      {
        path: '/CG/JDAndYCAndYZ',
        name: 'JDAndYCAndYZ',
        component: 'CG/JDAndYCAndYZ/index',
        meta: {
          title: 'JD、YC力量YZ与运用',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/CG/ZW',
        name: 'ZW',
        component: 'CG/ZW/index',
        meta: {
          title: '动态ZW',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/CG/ZHSAndJTZH',
        name: 'ZHSAndJTZH',
        component: 'CG/ZHSAndJTZH/index',
        meta: {
          title: 'ZHS开发与JTZH',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/CG/ZC',
        name: 'ZC',
        component: 'CG/ZC/index',
        meta: {
          title: 'ZC抢修',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '/FH',
    name: 'FH',
    component: 'layout/index',
    redirect: 'DCMW',
    meta: {
      title: '综合FH',
      icon: '',
      hidden: false,
      disabled: false,
      iconShow: false,
    },
    children: [
      {
        path: '/FH/DCMW',
        name: 'DCMW',
        component: 'FH/DCMW/index',
        meta: {
          title: 'DCMW',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/FH/DWFH',
        name: 'DWFH',
        component: 'FH/DWFH/index',
        meta: {
          title: 'DWFH',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
  {
    path: '/YL',
    name: 'YL',
    component: 'layout/index',
    redirect: 'QYLDWKS',
    meta: {
      title: '综合YL',
      icon: '',
      hidden: false,
      disabled: false,
      iconShow: false,
    },
    children: [
      {
        path: '/YL/QYLDWKS',
        name: 'QYLDWKS',
        component: 'YL/QYLDWKS/index',
        meta: {
          title: 'QYLDWKS构建',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/YL/FZCJXMD',
        name: 'FZCJXMD',
        component: 'YL/FZCJXMD/index',
        meta: {
          title: 'FZCJXMD探测',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/YL/TJXQB',
        name: 'TJXQB',
        component: '/YL/TJXQB/index',
        meta: {
          title: '人工TJXQB',
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
    component: 'layout/index',
    children: [
      {
        path: '/evaluateResult',
        name: 'evaluateResult',
        component: 'evaluateResult/index',
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
    name: 'systemManage',
    component: 'layout/index',
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
        component: 'systemManage/companyManage/index',
        meta: {
          title: '评估单位管理',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
      {
        path: '/systemManage/metricsManage',
        name: 'metricsManage',
        component: 'systemManage/metricsManage/index',
        meta: {
          title: '指标管理',
          icon: '',
          hidden: false,
          disabled: false,
          iconShow: false,
        },
      },
    ],
  },
]

Mock.mock('/api/login', 'post', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: {
      id: userInfo.id,
    },
    token: 'Bearer ' + Mock.Random.string('lower', 64),
  })
})

Mock.mock('/api/logout', 'post', () => {
  return Mock.mock({
    status: 200,
    msg: 'success',
  })
})

Mock.mock(/api\/getUserInfo/, 'get', (options) => {
  const id = getQuery(options.url, 'id')
  return Mock.mock({
    status: 200,
    msg: 'success',
    data: userInfo,
  })
})
