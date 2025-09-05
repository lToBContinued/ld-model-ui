import { dayjs } from 'element-plus'

/**
 * @description 表格格式化等级
 * @param {string} level 等级
 */
export function formatLevel(level: string): { type: string; text: string } | undefined {
  if (level === 'A') {
    return {
      type: 'success',
      text: '优秀',
    }
  }
  if (level === 'B') {
    return {
      type: 'warning',
      text: '一般',
    }
  }
  if (level === 'C') {
    return {
      type: 'danger',
      text: '差',
    }
  }
}

/**
 * @description 格式化日期
 * @param {string} date 日期
 * @param {string} formatType 格式
 * @returns {string} 格式化后的日期
 */
export function formatDate(date: string, formatType: string = 'YYYY-MM-DD') {
  return dayjs(new Date(date)).format(formatType)
}
