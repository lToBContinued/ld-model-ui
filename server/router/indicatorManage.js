import express from 'express'
import { getIndicatorList, addIndicator, removeIndicator } from '../router_handler/indicatorManageHandler.js'

const router = express.Router()

router.post('/addIndicator', addIndicator)
router.get('/getIndicatorList', getIndicatorList)
router.post('/removeIndicator', removeIndicator)

export default router
