import express from 'express'
import {
  getIndicatorList,
  addIndicator,
  removeIndicator,
  getIndicatorDetail,
  updateIndicatorDetail,
  getIndicatorSystemList,
  getIndicatorAndDescendants,
} from '../router_handler/indicatorManageHandler.js'

const router = express.Router()

router.post('/addIndicator', addIndicator)
router.get('/getIndicatorList', getIndicatorList)
router.post('/removeIndicator', removeIndicator)
router.get('/getIndicatorDetail', getIndicatorDetail)
router.post('/updateIndicatorDetail', updateIndicatorDetail)
router.get('/getIndicatorSystemList', getIndicatorSystemList)
router.get('/getIndicatorAndDescendants', getIndicatorAndDescendants)

export default router
