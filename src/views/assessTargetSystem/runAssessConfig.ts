export const getRunAssessConfig = () => {
  return Promise.resolve({
    status: 200,
    msg: 'success',
    data: [
      {
        id: 15,
        name: '数学',
        description: '一门计算学科',
        children: [],
      },
      {
        id: 16,
        name: '语文',
        description: '一门语言学科',
        children: [
          {
            id: 17,
            name: '阅读理解',
            description: '大阅读',
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
                id: 18,
                name: '选择',
                description: '选择',
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
                id: 19,
                name: '简答',
                description: '简答',
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
