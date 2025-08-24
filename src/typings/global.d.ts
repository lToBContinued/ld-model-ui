import { PropType as propType } from 'vue'
import * as echarts from 'echarts'
import { FormRules } from 'element-plus'

declare global {
  /** 颜色类型 */
  type ElColorType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

  /** 空类型 */
  type NullType<T> = T | null
  type UndefinedType<T> = T | undefined

  /** 属性类型 */
  type PropType<T> = propType<T>

  /** echarts配置类型 */
  type EChartsOption = echarts.EChartsOption

  /** 表单校验类型 */
  type ValidFormRules<T = any> = FormRules<T>

  /** 响应参数 */
  type ResponseData<T = any> = {
    status: number
    msg: string
    total?: number
    currentPage?: number
    pageSize?: number
    token?: string
    data?: T
  }

  /** 分页请求参数 */
  interface PaginationParams {
    /** 当前页码 */
    currentPage: number
    /** 每页显示条数 */
    pageSize: number
  }
}
