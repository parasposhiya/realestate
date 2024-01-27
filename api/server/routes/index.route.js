import express from 'express';
const router = express.Router();

import authRoutes from './auth.route.js';
import memberRoutes from './member.route.js';
import userRoutes from './user.route.js';
import lookupRoutes from './lookup.route.js';
import sellerRoutes from './seller.route.js';
import buyerRoutes from './buyer.route.js';
import commonRoutes from './common.route.js';
import followupRoutes from './followup.route.js';
import dealcompleteRoutes from './dealcomplete.route.js';

import User from '../models/user.model.js';

import common from '../helpers/common.js';


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use(async function (req, res, next) {

  let url = req.originalUrl.toString().trim();
  let method = req.method.toString().trim();
  console.log('-----------------------------------------');
  console.log("url", method, "--", url); // API show in Command Prompt

  let userid = null;
  let authtoken = req.headers && req.headers.authorization ? req.headers.authorization : req.query.authorization ? req.query.authorization : null;

  if (authtoken) {
    let token = await common.verifytoken(authtoken);
    if (token && token.error) {
      return res.status(401).send({ message: "Token is expired !", status: "token expired" });
    } else {
      userid = token.userid;
    }
  }


  if (url.startsWith("/api/auth")) {
    next();
  } else if (userid) {
    let loginuser = await User.findOne({ _id: userid });
    if (loginuser) {
      req.body.authkey = loginuser._id ? loginuser._id : userid;
      next();
    } else {
      return res.json({ message: "You do not have permission", Error: 403, status: "permission denied" })
    }
  } else {
    return res.json({ message: "You do not have permission", Error: 403, status: "permission denied" })
  }
});

router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/users', userRoutes);
router.use('/lookups', lookupRoutes);
router.use('/sellers', sellerRoutes);
router.use('/buyers', buyerRoutes);
router.use('/common', commonRoutes);
router.use('/followups', followupRoutes);
router.use('/dealcompletes', dealcompleteRoutes);



export default router;
