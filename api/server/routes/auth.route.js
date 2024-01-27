import express from 'express';
import asyncHandler from 'express-async-handler';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();
export default router;


router.route('/login')
  .post(asyncHandler(authCtrl.login));


router.route('/logout')
  .post(asyncHandler(authCtrl.logout));
