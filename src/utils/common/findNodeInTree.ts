/**
 * @description 查找树形结构中匹配指定id的节点（深度优先）
 * @param { Record<string, any>[] } tree - 树形结构（支持单个根节点或根节点数组）
 * @param { string } idField - 用于匹配的id字段名（需与节点结构对应）
 * @param { number | string } targetId - 要查找的目标id（类型与id字段严格一致）
 * @returns { NullType<Record<string, any>> } 匹配的节点（未找到返回null）
 * @example
 * const tree = {
 *   id: 1,
 *   name: 'root',
 *   children: [
 *     { id: 2, name: 'child1' },
 *     { id: 3, name: 'child2' },
 *   ],
 * }
 * findNodeInTree(tree, 'id', 3) // { id: 3, name: 'child2' }
 * findNodeInTree(tree, 'id', 4) // null
 */
export default function findNodeInTree(
  tree: Record<string, any>[],
  idField: string,
  targetId: number | string,
): NullType<Record<string, any>> {
  const nodeList = Array.isArray(tree) ? tree : [tree]
  for (const node of nodeList) {
    if (node[idField] === targetId) {
      return node
    }
    if (node.children?.length) {
      const foundChild = findNodeInTree(node.children, idField, targetId)
      if (foundChild) {
        return foundChild
      }
    }
  }
  return null
}
