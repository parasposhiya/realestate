import { Schema, model } from 'mongoose';
import mongooseautopopulate from 'mongoose-autopopulate';
import Common from '../helpers/common.js';
import mongoosebcrypt from 'mongoose-bcrypt';

const UserSchema = new Schema({
  username: String,
  password: String,
  fullname: String,
  property: Object,
  profilepic: String,
  status: { type: String, default: "active" }
}, {
  versionKey: false,
  timestamps: true
});

UserSchema.plugin(mongooseautopopulate);

UserSchema.options.selectPopulatedPaths = false;

UserSchema.plugin(mongoosebcrypt);

UserSchema.statics = {


  getbyfilter(params) {
    let query = Common.generatequery(params);
    let fields = Common.generateselect(params.select);
    let pageNo = parseInt(params.pageNo);
    let size = parseInt(params.size);
    let limit, skip;

    let sort = params.sort;
    if (!sort) {
      sort = {
        "updatedAt": -1,
        "createdAt": -1
      }
    }

    if (pageNo < 0 || pageNo === 0) {
      return { "error": true, "message": "invalid page number, should start with 1" };
    }

    skip = size * (pageNo - 1)
    limit = size;
    if (params.searchtext && !Array.isArray(params.searchtext)) {
      skip = 0;
      limit = 0;
    }
    //console.log("query", query)
    return this.find(query)
      .select(fields)
      // .select(reffields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true, autopopulate: { maxDepth: 2 } })
      .exec()
      .then((users) => {
        //console.log('users =>', users);
        return users;
      })
      .catch((e) => console.log(e))

  },

  findcount(req) {

    let params = req.body;
    let size = parseInt(params.size);
    let query = Common.generatequery(params);
    return this.countDocuments(query).exec().then((totalCount) => {
      let totalPages = Math.ceil(totalCount / size)
      req.header = { "error": false, "totalCount": totalCount, "totalPages": totalPages };
    })

  },

  exportdata(params) {

    let query = Common.generatequery(params);
    let fields = Common.generateselect(params.select);
    let sort = params.sort;
    if (!sort) {
      sort = {
        "updatedAt": -1,
        "createdAt": -1
      }
    }

    return this.find(query)
      .select(fields)
      .sort(sort)
      .lean({ virtuals: true, autopopulate: { maxDepth: 2 } })
      .exec()
      .then((users) => {
        return users;
      })

  },

  getLastUser(query) {
    return this.findOne(query)
      .sort({ username: -1 })
      .exec()
      .then((user) => {
        if (user) {
          return user.username;
        } else return; //"return STARTINGNUMBER";
      });
  },

  getbyUsername(query) {

    return this.findOne(query)
      .then(async (user) => {
        if (user) {
          return user;
        } else {
          return null;
        }
      });
  },

  validateuserpassword(userid, pwd) {
    ////console.log(userid);
    return this.findOne({ username: userid, status: "active" })
      .exec()
      .then((user) => {
        if (user) {
          // Verify password synchronously => Invalid (sync)
          // ////console.log(member);
          ////console.log(user);
          let valid = user.verifyPasswordSync(pwd);

          if (valid) {
            ////console.log('Valid (sync)');
            return user;
          } else {
            throw Error("Invalid login");
          }
        }
        else throw Error("Invalid login");

      });
  }

}


export default model('User', UserSchema);
