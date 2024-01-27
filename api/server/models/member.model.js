import { Schema, model } from 'mongoose';
import mongooseautopopulate from 'mongoose-autopopulate';
import Common from '../helpers/common.js';
import mongoosebcrypt from 'mongoose-bcrypt';

const MemberSchema = new Schema({
  memberno: String,
  fullname: String,
  profilepic: String,
  property: Object,
  status: { type: String, default: "active" },
}, {
  versionKey: false,
  timestamps: true
});

MemberSchema.plugin(mongooseautopopulate);

MemberSchema.options.selectPopulatedPaths = false;

MemberSchema.plugin(mongoosebcrypt);

MemberSchema.statics = {


  getbyfilter(params) {

    let query = Common.generatequery(params);
    let fields = Common.generateselect(params.select);
    let fields2 = Common.generateselect2(params.select);
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

    return this.find(query)
      .select(fields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true, autopopulate: { maxDepth: 2 } })
      .setOptions(fields2)
      .exec()
      .then((members) => {
        return members;
      })
      .catch((e) => console.log(e))

  },

  getLastMember(query) {
    return this.findOne(query)
      .sort({ membernumber: -1 })
      .exec()
      .then((member) => {
        if (member) {
          return member.membernumber;
        } else return; //"return STARTINGNUMBER";
      });
  },

  findcount(req) {

    let params = req.body;
    let size = parseInt(params.size);
    let query = Common.generatequery(params);
    if (params.searchtext && !Array.isArray(params.searchtext)) {
      query["$text"] = { $search: '"' + params.searchtext + '"' }
    }
    return this.countDocuments(query).exec().then((totalCount) => {
      let totalPages = Math.ceil(totalCount / size)
      req.header = { "error": false, "totalCount": totalCount, "totalPages": totalPages };
    })

  },

};

export default model('Member', MemberSchema);
