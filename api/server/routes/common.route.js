import express from 'express';
import asyncHandler from 'express-async-handler';
import commonCtrl from '../controllers/common.controller.js';
const router = express.Router();
export default router;

router.route('/dynamicdashboard')
  .get(asyncHandler(commonCtrl.getDynamicDashboard))