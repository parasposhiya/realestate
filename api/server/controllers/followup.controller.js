import Followup from '../models/followup.model.js';

export default {
  insert,
  patch,
  remove,
  filter,
  findcount,
  findbyId,
}

async function findbyId(Id) {
  return await Followup.findById(Id);
}

async function insert(req, res) {

  let seller = {
    customerid: req.body.customerid,
    userid: req.body.userid,
    followupdate: req.body.followupdate,
    property: req.body.property,
    status: req.body.status,
  }

  let savedSeller = await new Followup(seller).save(req);

  res.json(savedSeller);
}

async function patch(req, res) {

  let seller = await Followup.findById(req.params.Id);
  seller._original = seller.toObject();

  if (req.body.userid) seller.userid = req.body.userid;
  if (req.body.followupdate) seller.followupdate = req.body.followupdate;
  if (req.body.property) seller.property = req.body.property;
  if (req.body.status) seller.status = req.body.status;

  let patchedSeller = await seller.save(req);
  res.json(patchedSeller);
}

async function remove(Id, req) {
  return await Followup.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await Followup.getbyfilter(params)
}

async function findcount(req) {
  return await Followup.findcount(req)
}
