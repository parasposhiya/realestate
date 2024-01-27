import Lookup from '../models/lookup.model.js';

export default {
  insert,
  patch,
  filter,
  findbyId,
  findcount,
}

async function findbyId(Id) {
  return await Lookup.findById(Id);
}

async function patch(Id, req) {
  var lookup = await Lookup.findById(Id);
  lookup._original = lookup.toObject();
  if (req.body.data) lookup.data = req.body.data;
  if (req.body.object) lookup.data.push(req.body.object);

  return await new Lookup(lookup).save(req);
}
async function insert(req) {
  let lookup = {
    lookup: req.body.lookup,
    property: req.body.property,
    data: req.body.data
  }
  return await new Lookup(lookup).save(req);
}

async function filter(req) {
  return await Lookup.getbyfilter(req)
}

async function findcount(params) {
  return await Lookup.findcount(params)
}

