interface CollapseConfigs {
  id: string
  label: string
  level?: string
  formConfig?: Record<string, any>[]
  children?: CollapseConfigs[]
}

export const collapseConfig: CollapseConfigs[] = [
  {
    id: '1',
    label: '1',
    level: '1',
    children: [
      {
        id: '1-1',
        label: '1-1',
        level: '2',
        formConfig: [
          {
            prop: '1-1',
            label: '1-1指标',
            type: 'numberInput',
          },
        ],
      },
      {
        id: '1-2',
        label: '1-2',
        level: '2',
        children: [
          {
            id: '1-2-1',
            label: '1-2-1',
            level: '3',
            formConfig: [
              {
                prop: '1-2-1',
                label: '1-2-1指标',
                type: 'numberInput',
              },
            ],
          },
          {
            id: '1-2-2',
            label: '1-2-2',
            level: '3',
            formConfig: [
              {
                prop: '1-2-2',
                label: '1-2-2指标',
                type: 'numberInput',
              },
            ],
          },
        ],
      },
      {
        id: '1-3',
        label: '1-3',
        level: '2',
        formConfig: [
          {
            prop: '1-3',
            label: '1-3指标',
            type: 'numberInput',
          },
        ],
      },
      {
        id: '1-4',
        label: '1-4',
        level: '2',
        formConfig: [
          {
            prop: '1-4',
            label: '1-4指标',
            type: 'numberInput',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: '2',
    level: '1',
    children: [
      {
        id: '2-1',
        label: '2-1',
        level: '2',
      },
      {
        id: '2-2',
        label: '2-2',
        level: '2',
      },
      {
        id: '2-3',
        label: '2-3',
        level: '2',
      },
      {
        id: '2-4',
        label: '2-4',
        level: '2',
      },
    ],
  },
]
