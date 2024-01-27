import Dealcomplete from '../models/dealcomplete.model.js';
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
  return await Dealcomplete.findById(Id);
}

async function insert(req, res) {

  let deals = {
    sellerid: req.body.sellerid,
    buyerid: req.body.buyerid,
    property: req.body.property,
    status: req.body.status,
  }

  let savedDeals = await new Dealcomplete(deals).save(req);

  res.json(savedDeals);
}

async function patch(req, res) {

  let deals = await Dealcomplete.findById(req.params.Id);
  deals._original = deals.toObject();

  if (req.body.property) deals.property = req.body.property;
  if (req.body.status) deals.status = req.body.status;

  let patchedDeals = await deals.save(req);
  res.json(patchedDeals);
}

async function remove(Id, req) {
  return await Dealcomplete.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await Dealcomplete.getbyfilter(params)
}

async function findcount(req) {
  return await Dealcomplete.findcount(req)
}
