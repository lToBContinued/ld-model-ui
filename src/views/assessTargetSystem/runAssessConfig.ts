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
          type: 'radio',
          value: null,
          result: null,
          config: {
            options: [
              {
                label: '满分',
                value: 1,
              },
              {
                label: '不得分',
                value: 0,
              },
            ],
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
            step: 0.000005,
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
              type: 'select',
              value: null,
              result: null,
              config: {
                options: [
                  {
                    label: '优秀',
                    value: 100,
                  },
                  {
                    label: '良好',
                    value: 80,
                  },
                  {
                    label: '及格',
                    value: 60,
                  },
                  {
                    label: '不及格',
                    value: 0,
                  },
                ],
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
