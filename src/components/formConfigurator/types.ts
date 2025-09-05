export interface DefineProps {
  modelValue: string
  indicatorId: number
}

export interface NumberInputFormData {
  min: number
  max: number
  step: number
  value: NullType<number>
}

export interface SelectFormDataItem {
  id?: string
  label: string
  value: number | null
}

export interface SelectConfig {
  prop: string
  type: 'select'
  value: NullType<number>
  config: {
    options: SelectFormDataItem[]
  }
}

export interface NumberInputConfig {
  prop: string
  type: 'numberInput'
  value: NullType<number>
  config: NumberInputFormData
}

export type CreateNumberInputConfig = () => {
  type: string
  value: NullType<number>
  config: NumberInputFormData
}
