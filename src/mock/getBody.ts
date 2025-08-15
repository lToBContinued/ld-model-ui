export default function getBody(paramsStr: string): Record<string, any> {
  // 创建 URLSearchParams 对象解析参数，自动处理 URL 编码
  const params = new URLSearchParams(paramsStr)
  const result: Record<string, any> = {}

  // 遍历所有参数
  for (const [key, value] of params) {
    // 处理重复的键，将其值转换为数组
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      // 如果已经是数组，直接添加新值
      if (Array.isArray(result[key])) {
        result[key].push(value)
      } else {
        // 如果不是数组，先转为数组再添加新值
        result[key] = [result[key], value]
      }
    } else {
      // 第一次出现的键，直接赋值
      result[key] = value
    }
  }

  return result
}
