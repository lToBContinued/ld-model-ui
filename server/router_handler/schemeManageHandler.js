/**
 * @description 方案表
 * @param { number } id 方案id
 * @param { string } schemeName 方案名称
 * @param { string } schemeDesc 方案描述
 * @param { number } indicatorSystem 方案绑定的指标体系
 * @param { string } config 方案配置
 * @param { number } status 状态（0-不可用，1-可用）
 */
import db from '../db/index.js'

// 增加方案
export const addScheme = async (req, res, next) => {
  const { schemeName, schemeDesc, indicatorSystem } = req.body
  const data = {
    schemeName,
    schemeDesc,
    indicatorSystem,
    status: 1,
  }
  let sql = 'INSERT INTO schemes SET ?'
  try {
    const [insertResult] = await db.query(sql, [data])
    sql = 'SELECT * FROM schemes WHERE id = ?'
    const [result] = await db.query(sql, [insertResult.insertId])
    res.send({
      status: 200,
      msg: '添加方案成功',
      data: result[0],
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '添加方案失败',
      data: e,
    })
  }
}

// 删除方案
export const removeScheme = async (req, res, next) => {
  const { id } = req.body
  if (!id) {
    return res.send({
      status: 400,
      msg: '请提供要删除的方案ID',
    })
  }
  let sql = 'UPDATE schemes SET status = 0 WHERE id = ?'
  try {
    const [result] = await db.query(sql, [id])
    if (result.affectedRows === 0) {
      return res.send({
        status: 404,
        msg: '未找到要删除的方案',
      })
    }
    res.send({
      status: 200,
      msg: '删除方案成功',
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '删除方案失败',
      data: e,
    })
  }
}

// 保存方案
export const updateScheme = async (req, res, next) => {
  const { id, config } = req.body
  const sql = 'UPDATE schemes SET config = ? WHERE id = ?'
  try {
    await db.query(sql, [config, id])
    res.send({
      status: 200,
      msg: '更新方案成功',
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '更新方案失败',
      data: e,
    })
  }
}

// 获取方案列表
export const getSchemeList = async (req, res, next) => {
  const sql = 'SELECT id, schemeName FROM schemes WHERE status = 1'
  try {
    const [result] = await db.query(sql)
    res.send({
      status: 200,
      msg: '获取方案列表成功',
      data: result,
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '获取方案列表失败',
      data: e,
    })
  }
}

// 获取方案详情
export const getSchemeDetail = async (req, res, next) => {
  const { id } = req.query
  const sql = 'SELECT id, schemeName, schemeDesc, indicatorSystem, config FROM schemes WHERE id = ? AND status = 1'
  try {
    const [result] = await db.query(sql, [id])
    res.send({
      status: 200,
      msg: '获取方案详情成功',
      data: result[0],
    })
  } catch (e) {
    console.error(e)
    next({ e })
    res.send({
      status: 500,
      msg: '获取方案详情失败',
      data: e,
    })
  }
}
