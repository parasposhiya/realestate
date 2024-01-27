import User from '../models/user.model.js';

export default {
  insert,
  remove,
  patch,
  filter,
  findcount,
  findbyId,
  updateuserpassword
}

async function findbyId(req, res) {
  let user = await User.findById(req.params.Id);
  res.json(user);
}

async function patch(Id, req) {

  var user = await User.findById(Id);
  user._original = user.toObject();
  if (user.firsttimelogin && req.body.firsttimelogin) {
    user._original.firsttimelogin = false;
  }
  if (req.body.attachments) user.attachments = req.body.attachments;
  if (req.body.servicecharges) user.servicecharges = req.body.servicecharges;
  if (req.body.profilepic) user.profilepic = req.body.profilepic;
  if (req.body.status) user.status = req.body.status;
  if (req.body.firsttimelogin) user.firsttimelogin = req.body.firsttimelogin;
  if (req.body.forcelogin) user.forcelogin = req.body.forcelogin;
  if (req.body.newpassword) user.password = req.body.newpassword;
  if (req.body.password) user.password = req.body.password;
  if (req.body.wallets) user.wallets = req.body.wallets;
  if (req.body.property) user.property = req.body.property;
  if (req.body.salarycomponents) user.salarycomponents = req.body.salarycomponents;
  if (req.body.salarycomponent) user.salarycomponents.push(req.body.salarycomponent);
  if (req.body.salaryexceptioncomponents) user.salaryexceptioncomponents = req.body.salaryexceptioncomponents;
  if (req.body.leavecomponents) user.leavecomponents = req.body.leavecomponents;
  if (req.body.leavecomponent) user.leavecomponents.push(req.body.leavecomponent);
  if (req.body.hourlyrate) user.hourlyrate = req.body.hourlyrate;
  if (req.body.availability) user.availability = req.body.availability;
  if (req.body.useravailability) user.useravailability = req.body.useravailability;
  if (req.body.addonpermissions) user.addonpermissions = req.body.addonpermissions;
  if (req.body.breaktime) user.breaktime = req.body.breaktime;
  if (req.body.duration) user.duration = req.body.duration;
  if (req.body.manager) user.manager = req.body.manager;
  if (req.body.wfstatus) user.wfstatus = req.body.wfstatus
  if (req.body.functionpermissions) user.functionpermissions = req.body.functionpermissions;
  if (req.body.role) user.role = req.body.role;
  if (req.body.property && req.body.property.branchid) {
    user.branchid = req.body.property.branchid
  }
  convertobjectId(user.property);
  if (req.body.iosdevice) {

    var deviceid = user.iosdevices.find((device) => {
      return device.deviceid == req.body.iosdevice.deviceid;
    })
    if (deviceid) {
      deviceid.registrationid = req.body.iosdevice.registrationid;
    }
    else {
      user.iosdevices.push(req.body.iosdevice);
    }
  }
  if (req.body.anroiddevice) {

    var deviceid = user.anroiddevices.find((device) => {
      return device.deviceid == req.body.anroiddevice.deviceid;
    })
    if (deviceid) {
      deviceid.registrationid = req.body.anroiddevice.registrationid;
    }
    else {
      user.anroiddevices.push(req.body.anroiddevice);
    }

  }

  return await user.save(req);
}

async function insert(req) {
  if (req.body.profilepic && Array.isArray(req.body.profilepic)) {
    req.body.profilepic = req.body.profilepic[0] ? req.body.profilepic[0].attachment : undefined
  }
  var user = {
    username: req.body.username,
    password: req.body.password,
    profilepic: req.body.profilepic,
    role: req.body.role ? req.body.role : req.body.property.role ? req.body.property.role.toString() : null,
    branchid: req.body.branchid ? req.body.branchid : req.body.property.branchid ? req.body.property.branchid : req.body.authkey.branchid._id ? req.body.authkey.branchid._id.toString() : undefined,
    property: req.body.property,
    wfstatus: req.body.wfstatus,
    availability: req.body.availability,
    useravailability: req.body.useravailability,
    addonpermissions: req.body.addonpermissions,
    salarycomponents: req.body.salarycomponents,
    servicecharges: req.body.servicecharges,
    functionpermissions: req.body.functionpermissions
  }
  convertobjectId(user.property);
  let { value } = await userSchema.validate(user, { abortEarly: false });
  return await new User(value).save(req);
}

async function remove(Id, req) {
  return await User.findByIdAndUpdate(Id, { status: 'deleted' }, { new: true });
}

async function filter(params) {
  return await User.getbyfilter(params)
}

async function findcount(req) {
  return await User.findcount(req)
}

async function updateuserpassword(req, res, next) {

  User.validateuserpassword(req.body.username, req.body.currentpassword)
    .then((user) => {
      if (user) {
        user._original = user.toObject();
        user.password = req.body.password;
        //console.log(user)
        user.save(req)
          .then(savedUser => res.json(savedUser))
      }
    })
    .catch(e => next(e));
}
