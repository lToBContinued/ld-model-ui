import type { MindNode } from '@/components/MindTree.vue'

/**
 * 在MindTree中按 id 深度优先查找，返回命中的节点引用及其父节点引用。
 * - 递归 DFS；命中即提前返回。
 * - 未找到时两者均为 null。
 */
export function findNodeAndParent(
  root: MindNode,
  id: string,
  parent: MindNode | null = null,
): { node: MindNode | null; parent: MindNode | null } {
  if (!root) return { node: null, parent: null } // 空树保护
  if (root.id === id) return { node: root, parent } // 命中根/当前节点

  const children = root.children || []
  for (const c of children) {
    // 递归到子树；把当前节点作为下一层的 parent 传下去
    const r = findNodeAndParent(c, id, root)
    if (r.node) return r // 找到就直接返回（剪枝）
  }
  return { node: null, parent: null } // 整棵子树都没找到
}

/**
 * 将节点的临时 id（前端 uuid）替换为后端下发的自增 id。
 * - 找不到目标节点返回 false；成功替换返回 true。
 * 因为你前端的的节点是临时新增的，id是临时的uuid，当后端真正地自增了一个id之后，用这个函数去替换临时的id
 */
export function replaceNodeId(root: MindNode, tempId: string, serverId: number): boolean {
  const r = findNodeAndParent(root, tempId)
  if (!r.node) return false // 未找到该临时节点
  r.node.id = String(serverId) // 统一成字符串，和树节点 id 类型保持一致
  return true
}
