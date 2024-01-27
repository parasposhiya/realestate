import express from 'express';
import asyncHandler from 'express-async-handler';
import userCtrl from '../controllers/user.controller.js';
const router = express.Router();

export default router;

router.route('/')
  .post(asyncHandler(insert));

router.route('/:Id')
  .patch(asyncHandler(patch))
  .delete(asyncHandler(remove))
  .get(asyncHandler(userCtrl.findbyId))

router.route('/filter')
  .post(asyncHandler(findcount), asyncHandler(filter))

router.route('/changepassword')
  .post(userCtrl.updateuserpassword)


async function insert(req, res) {

  req.body.role = req.body.property.roleid ? req.body.property.roleid : req.body.role
  req.body.designationid = req.body.property.designationid ? req.body.property.designationid : req.body.designationid

  let user = await userCtrl.insert(req);
  res.json(user);
}

async function patch(req, res, next) {
  let user = await userCtrl.patch(req.params.Id, req);
  res.json(user);
}

async function remove(req, res) {
  let user = await userCtrl.remove(req.params.Id, req);
  res.json(user);
}

async function findcount(req, res, next) {
  if (req.body.size) {
    await userCtrl.findcount(req);
    res.header("access-control-expose-headers", "error, totalPages, totalCount");
    res.setHeader("error", req.header.error);
    res.setHeader("totalPages", req.header.totalPages);
    res.setHeader("totalCount", req.header.totalCount);
    next();
  }
  else next()
}

async function filter(req, res, next) {
  
  req.body.pagination = true;
  let users;

  users = await userCtrl.filter(req.body);

  res.json(users);
}
