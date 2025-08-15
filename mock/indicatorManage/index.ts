import Mock from 'mockjs'
import getQuery from '../getQuery'
import { L1_P1_formConfig, L1_P2_L2_P1_formConfig, L1_P2_L2_P2_formConfig } from './formConfig'

Mock.mock(/api\/getIndicatorTree/, 'get', (req) => {
  const nodeId = getQuery(req.url, 'nodeId')
  if (nodeId === '0') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: [
        {
          id: '1-1',
          label: '一级指标-1',
          isLeaf: 0,
          data: {
            indicatorName: '一级指标-1',
            description: '一级指标-1描述',
            type: '0',
            config: '',
          },
        },
        {
          id: '1-2',
          label: '一级指标-2',
          isLeaf: 1,
          data: {
            indicatorName: '一级指标-2',
            description: '一级指标-2描述',
            type: '1',
            config: '',
          },
        },
      ],
    })
  } else if (nodeId === '1-1') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: [],
    })
  } else if (nodeId === '1-2') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: [
        {
          id: '1-2-1',
          label: '一级指标-2_二级指标-1',
          isLeaf: 0,
          data: {
            indicatorName: '二级指标-1',
            description: '二级指标-1描述',
            type: '1',
            config: '',
          },
        },
        {
          id: '1-2-2',
          label: '一级指标-2_二级指标-2',
          isLeaf: 0,
          data: {
            indicatorName: '二级指标-2',
            description: '二级指标-2描述',
            type: '1',
            config: '',
          },
        },
      ],
    })
  } else if (nodeId === '1-2-1' || nodeId === '1-2-2') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: [],
    })
  }
})

Mock.mock(/api\/getIndicatorDetail/, 'get', (req) => {
  const nodeId = getQuery(req.url, 'nodeId')
  if (nodeId === '1-1') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        indicatorName: '一级指标-1',
        description: '一级指标-1描述',
        type: '0',
        config: '',
        formConfig: JSON.stringify(L1_P1_formConfig, null, 2),
      },
    })
  } else if (nodeId === '1-2') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        indicatorName: '一级指标-2',
        description: '一级指标-2描述',
        type: '1',
        config: '',
        formConfig: null,
      },
    })
  } else if (nodeId === '1-2-1') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        indicatorName: '二级指标-1',
        description: '二级指标-1描述',
        type: '0',
        config: '',
        formConfig: JSON.stringify(L1_P2_L2_P1_formConfig, null, 2),
      },
    })
  } else if (nodeId === '1-2-2') {
    return Mock.mock({
      status: 200,
      msg: 'success',
      data: {
        indicatorName: '二级指标-2',
        description: '二级指标-2描述',
        type: '0',
        config: '',
        formConfig: JSON.stringify(L1_P2_L2_P2_formConfig, null, 2),
      },
    })
  }
})
