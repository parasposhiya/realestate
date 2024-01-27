import express from 'express';
import asyncHandler from 'express-async-handler';
import dealcompleteCtrl from '../controllers/dealcomplete.controller.js';
const router = express.Router();
export default router;

router.route('/')
  .post(asyncHandler(dealcompleteCtrl.insert))

router.route('/:Id')
  .patch(asyncHandler(dealcompleteCtrl.patch))
  .delete(asyncHandler(remove))
  .get(asyncHandler(findbyId))

router.route('/filter')
  .post(asyncHandler(findcount), asyncHandler(filter))


async function findbyId(req, res) {
  let member = await dealcompleteCtrl.findbyId(req.params.Id);
  res.json(member);
}

async function remove(req, res) {
  let member = await dealcompleteCtrl.remove(req.params.Id, req);
  res.json(member);
}

async function findcount(req, res, next) {
  if (req.body.size) {
    await dealcompleteCtrl.findcount(req);
    res.header("access-control-expose-headers", "error, totalPages, totalCount");
    res.setHeader("error", req.header.error);
    res.setHeader("totalPages", req.header.totalPages);
    res.setHeader("totalCount", req.header.totalCount);
    next();
  }
  else next()
}

async function filter(req, res, next) {
  let members = [];
  req.body.pagination = true;

  members = await dealcompleteCtrl.filter(req.body);

  res.json(members);
}
