/**
 * @description 指标管理
 * @param { number } id 指标ID
 * @param { string } indicatorName 指标名称
 * @param { string } indicatorDesc 指标描述
 * @param { number } parentId 父指标ID
 * @param { number } level 指标等级
 * @param { number } isLeaf 指标是否为叶子节点
 * @param { string } config 指标配置
 */
import db from '../db/index.js'

// 增加指标
export const addIndicator = async (req, res, next) => {
  const { indicatorName, indicatorDesc, parentId } = req.body
  const data = {
    indicatorName,
    indicatorDesc,
    parentId,
  }
  if (!parentId) {
    data.parentId = 0
  }
  let sql = 'SELECT * FROM indicators WHERE id = ?'
  try {
    const [parentNode] = await db.query(sql, [parentId])
    if (!parentNode[0]?.level && parentNode[0]?.level !== 0) {
      data['level'] = 0
    } else {
      data['level'] = parentNode[0]?.level + 1
    }
    data['isLeaf'] = 1
    if (parentNode[0]?.isLeaf === null || parentNode[0]?.isLeaf === 1) {
      sql = 'UPDATE indicators SET isLeaf = 0 WHERE id = ?'
      await db.query(sql, [parentNode[0].id])
      sql = 'INSERT INTO indicators SET ?'
    } else {
      sql = 'INSERT INTO indicators SET ?'
    }
    const [insertResult] = await db.query(sql, [data])
    sql = 'SELECT * FROM indicators WHERE id = ?'
    const [result] = await db.query(sql, [insertResult.insertId])
    res.send({
      status: 200,
      msg: '添加指标成功',
      data: result[0],
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '添加指标失败',
      data: e,
    })
  }
}

// 删除指标
export const removeIndicator = async (req, res, next) => {
  const { id } = req.body
  if (!id) {
    return res.send({
      status: 400,
      msg: '请提供要删除的指标ID',
    })
  }
  try {
    // 开始事务
    await db.query('START TRANSACTION')
    // 1. 递归查询所有需要删除的节点（当前节点及其所有子节点）
    const [nodes] = await db.query(
      `
      WITH RECURSIVE all_nodes AS (
        SELECT id, parentId FROM indicators WHERE id = ?
        UNION ALL
        SELECT c.id, c.parentId FROM indicators c
        INNER JOIN all_nodes p ON c.parentId = p.id
      )
      SELECT id, parentId FROM all_nodes
    `,
      [id],
    )

    if (nodes.length === 0) {
      await db.query('COMMIT')
      return res.send({
        status: 404,
        msg: '未找到要删除的指标',
      })
    }
    // 提取所有要删除的节点ID
    const idsToDelete = nodes.map((node) => node.id)
    // 2. 执行删除操作
    const [deleteResult] = await db.query('DELETE FROM indicators WHERE id IN (?)', [idsToDelete])
    // 3. 找到受影响的父节点，检查是否需要更新isLeaf状态
    // 获取所有唯一的父节点ID（排除顶级节点parentId=0）
    const parentIds = [...new Set(nodes.map((node) => node.parentId).filter((pid) => pid !== 0 && pid !== null))]
    if (parentIds.length > 0) {
      // 检查每个父节点是否还有子节点
      for (const parentId of parentIds) {
        const [children] = await db.query('SELECT id FROM indicators WHERE parentId = ?', [parentId])
        // 如果没有子节点了，更新为叶子节点
        if (children.length === 0) {
          await db.query('UPDATE indicators SET isLeaf = 1 WHERE id = ?', [parentId])
        }
      }
    }
    // 提交事务
    await db.query('COMMIT')
    res.send({
      status: 200,
      msg: '指标及其子节点删除成功',
      data: {
        deletedCount: deleteResult.affectedRows,
        deletedIds: idsToDelete,
      },
    })
  } catch (e) {
    // 发生错误时回滚事务
    await db.query('ROLLBACK')
    console.error('删除指标失败:', e)
    next({ e })
    res.send({
      status: 500,
      msg: '删除指标失败',
      data: e,
    })
  }
}

// 获取指标列表
export const getIndicatorList = async (req, res, next) => {
  const { id } = req.query
  const sql = 'select * from indicators where parentId = ?'
  try {
    let [result] = await db.query(sql, [id])
    res.send({
      status: 200,
      msg: 'success',
      data: result,
    })
  } catch (e) {
    console.error(e)
    next({ e })
  }
}

// 获取指标详情
export const getIndicatorDetail = async (req, res, next) => {
  const { id } = req.query
  // 修改 SQL，通过自连接查询父级指标名称
  const sql = `
    SELECT i.*, p.indicatorName AS parentName
    FROM indicators i
    LEFT JOIN indicators p ON i.parentId = p.id
    WHERE i.id = ?
  `
  try {
    let [result] = await db.query(sql, [id])
    console.log('>>>>> file: indicatorManageHandler.js ~ method: getIndicatorDetail <<<<<\n', result) // TODO: 删除
    res.send({
      status: 200,
      msg: 'success',
      data: result[0],
    })
  } catch (e) {
    console.error(e)
    next({ e })
  }
}
