export const getRunAssessConfig = () => {
  return Promise.resolve({
    status: 200,
    msg: 'success',
    data: [
      {
        indicatorId: 15,
        indicatorName: '数学',
        indicatorDesc: '一门计算学科',
        level: 1,
        formConfig: {
          prop: 'math',
          type: 'numberInput',
          value: null,
          result: null,
          config: {
            min: 0,
            max: 100,
            step: 0.01,
          },
        },
        children: [],
      },
      {
        indicatorId: 16,
        indicatorName: '语文',
        indicatorDesc: '一门语言学科',
        level: 1,
        formConfig: {
          prop: 'math',
          type: 'numberInput',
          value: null,
          result: null,
          config: {
            min: 0,
            max: 100,
            step: 0.01,
          },
        },
        children: [
          {
            indicatorId: 17,
            indicatorName: '阅读理解',
            indicatorDesc: '大阅读',
            level: 2,
            formConfig: {
              prop: 'math',
              type: 'numberInput',
              value: null,
              result: null,
              config: {
                min: 0,
                max: 100,
                step: 0.01,
              },
            },
            children: [
              {
                indicatorId: 18,
                indicatorName: '选择',
                indicatorDesc: '选择',
                level: 3,
                formConfig: {
                  prop: 'math',
                  type: 'numberInput',
                  value: null,
                  result: null,
                  config: {
                    min: 0,
                    max: 100,
                    step: 0.01,
                  },
                },
              },
              {
                indicatorId: 19,
                indicatorName: '简答',
                indicatorDesc: '简答',
                level: 3,
                formConfig: {
                  prop: 'math',
                  type: 'numberInput',
                  value: null,
                  result: null,
                  config: {
                    min: 0,
                    max: 100,
                    step: 0.01,
                  },
                },
              },
              {
                indicatorId: 20,
                indicatorName: '判断',
                indicatorDesc: '判断',
                level: 3,
                formConfig: {
                  prop: 'math',
                  type: 'numberInput',
                  value: null,
                  result: null,
                  config: {
                    min: 0,
                    max: 100,
                    step: 0.01,
                  },
                },
              },
              {
                indicatorId: 21,
                indicatorName: '判断',
                indicatorDesc: '判断',
                level: 3,
                formConfig: {
                  prop: 'math',
                  type: 'numberInput',
                  value: null,
                  result: null,
                  config: {
                    min: 0,
                    max: 100,
                    step: 0.01,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  })
}
