import express from 'express';
import asyncHandler from 'express-async-handler';
import lookupCtrl from '../controllers/lookup.controller.js';
const router = express.Router();
export default router;

router.route('/')
  .post(asyncHandler(insert))

router.route('/:Id')
  .patch(asyncHandler(patch))
  .get(asyncHandler(findbyId))

router.route('/filter')
  .post(asyncHandler(findcount), asyncHandler(filter))

async function findbyId(req, res) {
  let lookup = await lookupCtrl.findbyId(req.params.Id);
  res.json(lookup);
}

async function insert(req, res) {
  let lookup = await lookupCtrl.insert(req);
  res.json(lookup);
}

async function patch(req, res) {
  let lookup = await lookupCtrl.patch(req.params.Id, req);
  res.json(lookup);
}


async function findcount(req, res, next) {
  if (req.body.size) {    
      await lookupCtrl.findcount(req);
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
  let lookups = [];

  lookups = await lookupCtrl.filter(req.body);
  res.json(lookups);
}