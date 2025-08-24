import express from 'express'
import {
  addScheme,
  getSchemeDetail,
  getSchemeList,
  removeScheme,
  updateScheme,
} from '../router_handler/schemeManageHandler.js'

const router = express.Router()

router.post('/addScheme', addScheme)
router.get('/getSchemeDetail', getSchemeDetail)
router.post('/removeScheme', removeScheme)
router.get('/getSchemeList', getSchemeList)
router.post('/updateScheme', updateScheme)

export default router
