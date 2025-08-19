import express from 'express'
import {
  getIndicatorList,
  addIndicator,
  removeIndicator,
  getIndicatorDetail,
  updateIndicatorDetail,
} from '../router_handler/indicatorManageHandler.js'

const router = express.Router()

router.post('/addIndicator', addIndicator)
router.get('/getIndicatorList', getIndicatorList)
router.post('/removeIndicator', removeIndicator)
router.get('/getIndicatorDetail', getIndicatorDetail)
router.post('/updateIndicatorDetail', updateIndicatorDetail)

export default router
