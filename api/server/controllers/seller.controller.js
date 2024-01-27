import Seller from '../models/seller.model.js';
import { ObjectId } from 'mongodb';

export default {
  insert,
  patch,
  remove,
  filter,
  findcount,
  findbyId,
}

async function findbyId(Id) {
  return await Seller.findById(Id);
}

async function insert(req, res) {

  let seller = {
    customerid: req.body.customerid,
    title: req.body.title,
    property: req.body.property,
    status: req.body.status,
  }

  let savedSeller = await new Seller(seller).save(req);

  res.json(savedSeller);
}

async function patch(req, res) {

  let seller = await Seller.findById(req.params.Id);
  seller._original = seller.toObject();

  if (req.body.title) seller.title = req.body.title;
  if (req.body.property) seller.property = req.body.property;
  if (req.body.status) seller.status = req.body.status;

  let patchedSeller = await seller.save(req);
  res.json(patchedSeller);
}

async function remove(Id, req) {
  return await Seller.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await Seller.getbyfilter(params)
}

async function findcount(req) {
  return await Seller.findcount(req)
}
