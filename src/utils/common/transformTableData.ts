/**
 * 将表格数据的键名从prop转换为label
 * @param rawData 原始表格数据
 * @param columns 表格列配置
 * @returns 转换后的表格数据
 */
export default function transformTableData(rawData: any[], columns: any[]) {
  // 创建prop到label的映射关系
  const propToLabelMap = columns.reduce(
    (map, column) => {
      if (column.prop && column.label) {
        map[column.prop] = column.label
      }
      return map
    },
    {} as Record<string, string>,
  )

  // 转换数据
  return rawData.map((item) => {
    const transformedItem: Record<string, any> = {}

    // 遍历原始数据项
    Object.entries(item).forEach(([key, value]) => {
      // 跳过id字段
      if (key === 'id') return

      // 根据映射关系转换键名
      const labelKey = propToLabelMap[key]
      if (labelKey) {
        transformedItem[labelKey] = value
      }
    })

    return transformedItem
  })
}
