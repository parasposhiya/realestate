import Member from '../models/member.model.js';

export default {
  insert,
  patch,
  remove,
  filter,
  findcount,
  findbyId,
}

async function findbyId(Id) {
  return await Member.findById(Id);
}

async function insert(req, res) {

  let member = {
    memberno: req.body.memberno,
    fullname: req.body.fullname,
    property: req.body.property,
    profilepic: req.body.profilepic,
    status: req.body.status,
  }

  let savedMember = await new Member(member).save(req);

  res.json(savedMember);
}

async function patch(req, res) {
  let member = await Member.findById(req.params.Id);
  member._original = member.toObject();
  

  if (req.body.fullname) member.fullname = req.body.fullname;
  if (req.body.property) member.property = req.body.property;
  if (req.body.profilepic) member.profilepic = req.body.profilepic;
  if (req.body.status) member.status = req.body.status;


  let patchedMember =  await member.save(req);
  res.json(patchedMember);
}

async function remove(Id, req) {
  return await Member.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await Member.getbyfilter(params)
}

async function findcount(req) {
  return await Member.findcount(req)
}
