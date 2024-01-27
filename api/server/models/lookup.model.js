import { Schema, model } from 'mongoose';
import Common from '../helpers/common.js';

const LookupSchema = new Schema({
  lookup: String,
  property: Object,
  data: [Object],
  status: { type: String, default: "active" }
}, {
  versionKey: false
});

LookupSchema.statics = {

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
    return this.find(query)
      //.select(fields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true, autopopulate: { maxDepth: 2 } })
      .exec()
      .then((users) => {
        return users;
      })

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

}

export default model('Lookup', LookupSchema);
