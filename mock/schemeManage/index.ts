import Mock from 'mockjs'
import getQuery from '../getQuery'

const indicatorList = [
  {
    indicatorId: '1',
    indicatorName: 'ld-指标1',
    indicatorDesc: '指标1的描述',
    level: 1,
    children: [
      {
        indicatorId: '1-1',
        indicatorName: 'ld-指标1-1',
        indicatorDesc: '指标1-1的描述',
        level: 2,
        children: [],
      },
      {
        indicatorId: '1-2',
        indicatorName: 'ld-指标1-2',
        indicatorDesc: '指标1-2的描述',
        level: 2,
        children: [],
      },
      {
        indicatorId: '1-3',
        indicatorName: 'ld-指标1-3',
        indicatorDesc: '指标1-3的描述',
        level: 2,
        children: [],
      },
    ],
  },
  {
    indicatorId: '2',
    indicatorName: 'ld-指标2',
    indicatorDesc: '指标2的描述',
    level: 1,
    children: [
      {
        indicatorId: '2-1',
        indicatorName: 'ld-指标2-1',
        indicatorDesc: '指标2-1的描述',
        level: 2,
        children: [],
      },
      {
        indicatorId: '2-2',
        indicatorName: 'ld-指标2-2',
        indicatorDesc: '指标2-2的描述',
        level: 2,
        children: [],
      },
    ],
  },
]
const schemeIndicatorDetail = [
  {
    indicatorId: '1',
    indicatorName: 'fx-指标1',
    indicatorDesc: '指标1的描述',
    level: 1,
    children: [
      {
        indicatorId: '1-1',
        indicatorName: 'fx-指标1-1',
        indicatorDesc: '指标1-1的描述',
        level: 2,
        children: [],
      },
    ],
  },
]

Mock.mock(/\/api\/schemeManage\/getSchemeDetail/, 'get', (req) => {
  const schemeId = getQuery(req.url, 'schemeId')
  if (schemeId === 'ld-scheme-1') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        schemeId: 'ld-scheme-1',
        schemeName: '方案1',
        schemeDesc: '方案1的描述',
        indicatorList: indicatorList,
      },
    })
  } else if (schemeId === 'fx-scheme-1') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        schemeId: 'fx-scheme-1',
        schemeName: '方案1',
        schemeDesc: '方案1的描述',
        indicatorList: schemeIndicatorDetail,
      },
    })
  }
})
