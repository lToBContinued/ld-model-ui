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
