import Buyer from '../models/buyer.model.js';

export default {
  insert,
  patch,
  remove,
  filter,
  findcount,
  findbyId,
}

async function findbyId(Id) {
  return await Buyer.findById(Id);
}

async function insert(req, res) {

  let buyer = {
    customerid: req.body.customerid,
    property: req.body.property,
    status: req.body.status,
  }

  let savedBuyer = await new Buyer(buyer).save(req);

  res.json(savedBuyer);
}

async function patch(req, res) {

  let buyer = await Buyer.findById(req.params.Id);
  buyer._original = buyer.toObject();

  if (req.body.property) buyer.property = req.body.property;
  if (req.body.status) buyer.status = req.body.status;

  let patchedBuyer = await buyer.save(req);
  res.json(patchedBuyer);
}

async function remove(Id, req) {
  return await Buyer.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await Buyer.getbyfilter(params)
}

async function findcount(req) {
  return await Buyer.findcount(req)
}
