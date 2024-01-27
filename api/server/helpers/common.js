import jwt from 'jsonwebtoken';
import moment from 'moment';
import 'moment-timezone';
import { ObjectId } from 'mongodb';
import config from '../config/config.js';
const jwtsecret = config.JWT_SECRET;

export default {
  verifytoken,
  generatetoken,
  generatequery,
    generateselect,
    generateselect2,
    generateNumber
}


async function generatetoken(jwtsign) {
  try {
    const token = await jwt.sign(jwtsign, jwtsecret, { expiresIn: '24h' });
    return token;
  } catch (e) {
    return null;
  }
}

async function verifytoken(token) {
  let details;
  await jwt.verify(token, jwtsecret, function (err, decoded) {
    if (err) {
      details = { error: 'token is expired' };

    } else {
      details = decoded;
    }
  });
  return details;
}

async function generateNumber(req, res, next) {
    let chars = "0123456789";
    let randomnumber = '';
    for (let i = 0; i < 7; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      randomnumber += chars.substring(rnum, rnum + 1);
    }
    req.body.memberno = randomnumber;
    next();
  }

function generatequery(params) {

  var query = {};

  var branch = params.authkey ? params.authkey.branchid : undefined;
  var search, permissions, formname, formtype;
  var orarray = [];
  var andarray = [];

  if (params !== null && typeof params === 'object' && params.formname) {
      formname = params.formname;
      formtype = params.formtype;
  }
  if (params !== null && typeof params === 'object' && params.search) {
      search = params.search;
  }
  else {
      search = params;
  }
  var isbranchfield = false;
  if (search && Array.isArray(search)) {

      search.forEach(function (element) {
          var criteria = element.criteria;
          var datatype = element.datatype;
          var searchvalue = element.searchvalue;
          if (element.searchfield == "branchid") {
              isbranchfield = true;
          }

          if (searchvalue && searchvalue.toString().startsWith("@")) {
              element.searchvalue = getformulavalue(searchvalue, params, branch)
              query[element.searchfield] = element.searchvalue
          }

          if (typeof element.searchvalue === 'object' && element.datatype !== "Date" && element.searchvalue.constructor === Object) {
              if (element.searchvalue.id) {
                  element.searchvalue = element.searchvalue.id;
              }
              else if (element.searchvalue.name) {
                  element.searchvalue = element.searchvalue.name;
              }
          }

          if (element.cond && datatype == "Date" && element.cond == "and") {
              var newobj = {}
              var date = convertolocaltime(params, element.searchvalue);

              if (datatype == "Date" && criteria == "gte") {
                  newobj[element.searchfield] = { $gte: date };
              } else if (datatype == "Date" && criteria == "lte") {
                  newobj[element.searchfield] = { $lte: date };
              } else if (datatype == "Date" && criteria == "eq") {
                  newobj[element.searchfield] = date;
              }
              andarray.push(newobj)
              return;
          }
          else if (element.cond && element.cond == "and" && datatype != "Date") {
              var newobj = {}

              if (datatype == "Boolean" && criteria == "exists") {
                  newobj[element.searchfield] = { $exists: element.searchvalue };
              } else if (datatype == "text" && criteria == "ne") {
                  newobj[element.searchfield] = { $ne: element.searchvalue };
              } else if (datatype == "text" && criteria == "nin") {
                  newobj[element.searchfield] = { $nin: element.searchvalue };
              } else if (datatype == "text") {
                  newobj[element.searchfield] = element.searchvalue;
              }
              andarray.push(newobj)
              return;
          }

          if (element.cond && element.cond == "or") {

              var newobj = {}
              if ((element.datatype == "ObjectID" || element.datatype == "ObjectId" || element.datatype == "form") && element.criteria == "eq") {
                  newobj[element.searchfield] = new ObjectId(element.searchvalue);
              }
              else if ((element.datatype == "ObjectID" || element.datatype == "ObjectId" || element.datatype == "form") && element.criteria == "ne") {
                  newobj[element.searchfield] = { $ne: new ObjectId(element.searchvalue) };
              }
              else if ((element.datatype == "ObjectID" || element.datatype == "ObjectId" || element.datatype == "form") && element.criteria == "in") {
                  if (Array.isArray(element.searchvalue)) {
                      var newarr = [];
                      element.searchvalue.forEach(function (el) {
                          newarr.push(new ObjectId(el))
                      })
                      newobj[element.searchfield] = { $in: newarr };
                  }
                  else {
                      newobj[element.searchfield] = { $in: [new ObjectId(element.searchvalue)] };
                  }
              }
              else if (element.datatype == "boolean" && element.criteria == "exists") {
                  newobj[element.searchfield] = { $exists: element.searchvalue };
              }
              else {
                  newobj[element.searchfield] = element.searchvalue;
              }

              orarray.push(newobj)
              return;
          }

          if (datatype == "Date" && criteria == "eq") {
              for (const prop in element.searchvalue) {
                  if (prop == "$gte" || prop == "$gt" || prop == "$lte" || prop == "$lt") {
                      var date = convertolocaltime(params, element.searchvalue[prop]);
                      element.searchvalue[prop] = date;
                  }
              }
              query[element.searchfield] = element.searchvalue;
              return;
          }

          if (datatype == "Date" && element.criteria == "fullday") {

              var startday = convertolocaltime(params, element.searchvalue);
              var newobj = {}
              newobj[element.searchfield] = { $gte: startday };
              andarray.push(newobj);

              var newobj = {}
              var endday = convertolocaltime(params, startday);
              endday.setUTCDate(endday.getUTCDate() + 1)
              newobj[element.searchfield] = { $lt: endday };
              andarray.push(newobj);
              return;
          }

          if (datatype == "Date" && criteria != "eq") {
              if (criteria == "gte") {
                  var startday = convertolocaltime(params, element.searchvalue);
                  query[element.searchfield] = { $gte: startday };
              }
              if (criteria == "lte") {
                  var endday = convertolocaltime(params, element.searchvalue);
                  query[element.searchfield] = { $lte: endday };
              }
              if (criteria == "ne") {
                  query[element.searchfield] = { "$ne": null }
              }
              return;
          }


          if (element.searchvalue == "ALL") {
              return;
          }
          if (datatype && (datatype.toLowerCase() == "objectid" || element.datatype == "form")) {
              if (Array.isArray(searchvalue)) {
                  var searchvalue1 = [];
                  searchvalue.forEach(function (e) {
                      searchvalue1.push(new ObjectId(e))
                  })
                  element.searchvalue = searchvalue1;
              }
              else {
                  element.searchvalue = new ObjectId(element.searchvalue);
              }
          }

          if (criteria == "eq") {
              query[element.searchfield] = element.searchvalue;
          }
          else if (criteria == "lk") {
              query[element.searchfield] = { $regex: new RegExp(".*" + element.searchvalue.toLowerCase() + ".*", "i") };
          }
          else if (criteria == "gt") {
              query[element.searchfield] = { $gt: element.searchvalue };
          }
          else if (criteria == "gte") {
              query[element.searchfield] = { $gte: element.searchvalue };
          }
          else if (criteria == "lt") {
              query[element.searchfield] = { $lt: element.searchvalue };
          }
          else if (criteria == "lte") {
              query[element.searchfield] = { $lte: element.searchvalue };
          }
          else if (criteria == "ne") {
              query[element.searchfield] = { $ne: element.searchvalue };
          }
          else if (criteria == "in") {
              query[element.searchfield] = { $in: element.searchvalue };
          }
          else if (criteria == "exists") {
              query[element.searchfield] = { $exists: element.searchvalue };
          }
          else if (criteria == "size") {
              query[element.searchfield] = { $size: element.searchvalue };
          }
          else if (criteria == "nin") {
              query[element.searchfield] = { $nin: element.searchvalue };
          }
      }, this);
  }

  var viewallpermission = false;

  if (params.authkey && formname && !formtype) {
      // console.log("formpermission", formname)
      permissions = params.authkey.role.permissions;
      var formper = permissions.filter(per => per.formname == formname);
      if (formper && formper.length > 0 && formper[0].recordpermission && formper[0].recordpermission.length > 0) {
          formper = formper[0].recordpermission;
          var viewper = formper.filter(per => per.type == "view");
          if (viewper.length > 0 && viewper[0].datapermission !== "All") {
              if (viewper[0].datapermission === "My" && (formname == "user" || formname == "member")) {
                  query["_id"] = new ObjectId(params.authkey._id);
              }
              else if (viewper[0].datapermission === "My") {
                  query["addedby"] = params.authkey._id;
              }

              if (formname == "branchid" && viewper[0].datapermission === "My Branch" && params.authkey.branchid._id) {
                  if (!query["_id"])
                      query["_id"] = new ObjectId(params.authkey.branchid._id);
              }
              else if (viewper[0].datapermission === "My Branch" && params.authkey.branchid._id) {

                  if (query["$or"]) {
                      query["$or"].forEach(element => {
                          if (!element.hasOwnProperty('branchid')) {
                              query["$or"].push({ branchid: params.authkey ? new ObjectId(params.authkey.branchid._id) : null })
                              query["$or"].push({ branchid: { "$exists": false } })
                          }
                      });

                  }
              }
          }
          else {
              viewallpermission = true;
          }
      }
      else if (formper && formper.length == 0 && formname != "form" && formname != "langresource" && formname != "dashboard"
          && formname != "organization" && formname != "menu" && formname != "menupermission" && formname != "inventory"
          && formname != "formfield" && formname != "formfieldoption" && formname != "formlist" && formname != "paymentterm"
          && formname != "quickform" && formname != "history" && formname != "lookup" && formname != "formdata" && formname != "document"
          && formname != "folder" && formname != "activity" && formname != "disposition" && formname != "template") {
          if (formname = "user" || formname == "member") {
          }
          else {
              query["_id"] = null;
          }
          return { _id: null };
      }
  }
  if (andarray && andarray.length != 0) {
      query["$and"] = andarray;
  }
  if (!query.hasOwnProperty('status')) {
      query['status'] = { "$ne": "deleted" }
  }

  return query;

}

function convertolocaltime(body, date) {
  var branch = (body.authkey && body.authkey.branchid) ? body.authkey.branchid : body;
  date = new Date(date);
  var now = moment();
  var localOffset = branch ? now.tz(branch.timezone).utcOffset() : 0;
  date.setUTCHours(0, 0, 0, 0);
  if (localOffset >= 0) {
      date.setUTCDate(date.getUTCDate() + 1);
  }
  date.setUTCMinutes(date.getUTCMinutes() - localOffset);
  return date;
}

function generateselect(select, docfields) {
  if (!select || select.length == 0) return [];
  var fields = {};

  if (select) {

      select.forEach(function (element) {
          if (!element) { return };
          if (element && element.fieldname) {
              var field = element.fieldname.split(".");
              if (field[1] && field[0] != "property" && (element.value == 1 || element.display)) {
                  fields[field[0]] = element.value ? element.value : element.display
              }
              else if (field[1] && field[0] == "property" && (element.value == 1 || element.display)) {
                  fields[element.fieldname] = element.value ? element.value : element.display
              }
              else if (!field[1] && (element.value == 1 || element.display)) {
                  fields[field[0]] = element.value ? element.value : element.display
              }
          }

      }, this);
  }
  if (docfields) adddocfields(fields, docfields);
  return fields;
}

function generateselect2(select, docfields) {
  if (!select || select.length == 0) return [];
  var fields = {};

  if (select) {

      select.forEach(function (element) {
          if (!element) return;
          fields[element.fieldname] = element.value
      }, this);
  }
  if (docfields) adddocfields(fields, docfields);
  //console.log(fields)
  return fields;
}

function adddocfields(fields, docfields) {

  var docfield;
  for (var prop in fields) {
      if (prop == "docnumber") {
          docfield = prop;
      }
  }

  if (docfield) {
      docfields.forEach(element => {
          fields[element] = 1;
      });
  }

}


function getformulavalue(formula, params, branch) {

  var now = moment();
  var clientOffset = now.tz(branch.timezone).utcOffset();

  //console.log("options", options)
  switch (formula) {

      case "@ALL":
      case "@All":

          var firstday = new Date(-8640000000000000);
          var lastday = new Date(8640000000000000);

          return { $gte: firstday, $lte: lastday }
          break;

      case "@TODAY":
          var firstday = new Date();
          firstday.setHours(0, 0, 0, 0);
          firstday.setMinutes(firstday.getMinutes() - clientOffset)
          //console.log("db_fieldValue 2", db_fieldValue)
          var lastday = new Date();
          lastday.setHours(0, 0, 0, 0);
          lastday.setMinutes(lastday.getMinutes() - clientOffset)
          // db_fieldValue = new Intl.DateTimeFormat("en-US", options).format(lastday);
          // lastday = new Date(db_fieldValue);

          lastday.setDate(lastday.getDate() + 1)
          lastday.setSeconds(lastday.getSeconds() - 1)
          // console.log("firstday", firstday, lastday)
          //////console.log("##########")
          return { $gte: firstday, $lte: lastday }
          break;

      case "@EXACTYESTERDAY":
          var firstday = new Date();
          firstday.setHours(0, 0, 0, 0);

          firstday.setDate(firstday.getDate() - 1)
          firstday.setHours(23, 59, 0, 0);

          return firstday
          break;
      case "@YESTERDAY":
      case "@Yesterday":
          var firstday = new Date();
          firstday.setDate(firstday.getDate() - 1)
          firstday.setHours(0, 0, 0, 0);
          //////console.log("firstday", firstday)
          //////console.log("----------------")
          var lastday = new Date();
          lastday.setDate(lastday.getDate() - 1)
          firstday.setHours(23, 59, 0, 0);

          ////console.log("lastday", {$gte: firstday, $lte: lastday})
          return { $gte: firstday, $lte: lastday }
          break;

      case "@TOMORROW":
          var firstday = new Date();
          firstday.setHours(0, 0, 0, 0);
          firstday.setDate(firstday.getDate() + 1)
          //////console.log("firstday", firstday)
          //////console.log("----------------")
          var lastday = new Date();
          lastday.setDate(lastday.getDate() + 1)
          lastday.setHours(23, 59, 0, 0);

          //////console.log("lastday", lastday)
          return { $gte: firstday, $lte: lastday }
          break;

      case "@MINDATE":

          var firstday = new Date("1970-01-01");
          firstday.setHours(0, 0, 0, 0);
          return firstday
          break;

      case "@EXACTTODAY":

          var firstday = new Date();
          firstday.setHours(23, 59, 0, 0);
          return firstday
          break;

      case "@WEEK":

          var curr = new Date; // get current date
          /* Note :: following logic not satisfied for different months
           var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
           // var last = first + 6; // last day is the first day + 6
    
           // var firstday = new Date(curr.setDate(first)).toUTCString();
           // var lastday = new Date(curr.setDate(last)).toUTCString();
           */
          /*Reference link : https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-week-in-javascript/13190874#13190874
           */
          var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
          var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));

          return { $gte: firstday, $lte: lastday }
          break;

      case "@EXACTWEEK":
          var curr = new Date; // get current date
          var first = curr.getDate() - curr.getDay() + 1;
          var firstday = new Date(curr.setDate(first));
          firstday.setHours(0, 0, 0, 0);
          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);

          return { $gte: firstday, $lte: lastday }
          break;

      case "@THISWEEK":


          var curr = new Date; // get current date
          var first = curr.getDate() + 1;
          var firstday = new Date(curr.setDate(first));
          firstday.setHours(0, 0, 0, 0);


          var curr = new Date; // get current date
          var last = curr.getDate() + 7 - curr.getDay();
          var lastday = new Date(curr.setDate(last));
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@STARTOFMONTH":
          //from tomorrow till the end day of this Monthss

          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var curr = new Date; // get current date
          var first = 1;
          var firstday = new Date(curr.setDate(first));
          firstday.setHours(0, 0, 0, 0);
          return firstday
          break;

      case "@ENDOFMONTH":
          //from tomorrow till the end day of this Monthss

          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var lastday = new Date(y, m + 1, 0, 23, 59, 59)

          return lastday
          break;

      case "@THISMONTH":
          //from tomorrow till the end day of this Monthss

          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var curr = new Date; // get current date
          var first = 1;
          var firstday = new Date(curr.setDate(first));
          firstday.setHours(0, 0, 0, 0);
          firstday.setMinutes(firstday.getMinutes() - clientOffset)

          var lastday = new Date(y, m + 1, 0, 23, 59, 59)
          lastday.setMinutes(lastday.getMinutes() - clientOffset)
          return { $gte: firstday, $lte: lastday }
          break;

      case "@MONTH":
          var date = new Date(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y, m, 1);
          var lastday = new Date(y, m + 1, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@YEAR":

          var firstday = new Date(new Date().getFullYear(), 0, 1);
          var lastday = new Date(new Date().getFullYear(), 11, 31);

          return { $gte: firstday, $lte: lastday }
          break;

      //sdsssscff
      case "@LASTWEEK":
      case "@LastWeek":

          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y, m, d - 7);

          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@LASTMONTH":
      case "@LastMonth":

          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y, m, d - 30);

          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@LAST3MONTH":
      case "@Last3Months":

          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y, m - 3, d);

          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@LAST6MONTH":
      case "@Last6Months":

          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y, m - 6, d);

          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@LASTYEAR":
      case "@LastYear":

          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var firstday = new Date(y - 1, m, d);

          var lastday = new Date();
          lastday.setHours(23, 59, 0, 0);
          return { $gte: firstday, $lte: lastday }
          break;

      case "@OVERDUE":
      case "@OverDue":
          var firstday = new Date(-8600000);
          firstday.setHours(0, 0, 0, 0);
          firstday.setMinutes(firstday.getMinutes() - clientOffset)

          var lastday = new Date();
          lastday.setHours(0, 0, 0, 0);
          lastday.setMinutes(lastday.getMinutes() - clientOffset)

          return { $gte: firstday, $lte: lastday }
          break;

      case "@DUEIN7DAY":
      case "@Due7Days":

          var firstday = new Date();
          firstday.setHours(0, 0, 0, 0);
          firstday.setMinutes(firstday.getMinutes() - clientOffset)

          var lastday = new Date();
          lastday.setHours(0, 0, 0, 0);
          lastday.setMinutes(lastday.getMinutes() - clientOffset)

          lastday.setDate(lastday.getDate() + 7)
          lastday.setSeconds(lastday.getSeconds() - 1)

          // var firstday = new Date();
          // firstday.setHours(0, 0, 0, 0);
          // //firstday = firstday.getUTCDate();
          // //////console.log("firstday", firstday);
          // var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          // var lastday = new Date(y, m, d + 7);
          //console.log({ $gte: firstday, $lte: lastday })
          return { $gte: firstday, $lte: lastday }
          break;

      case "@Due15Days":
      case "@DUEIN15DAY":
          var firstday = new Date();
          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var lastday = new Date(y, m, d + 15);

          return { $gte: firstday, $lte: lastday }
          break;

      case "@DUEIN30DAY":
      case "@Due30Days":
          var firstday = new Date();
          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var lastday = new Date(y, m, d + 30);

          return { $gte: firstday, $lte: lastday }
          break;

      case "@DUEIN60DAY":
      case "@Due60Days":
          var firstday = new Date();
          var date = new Date(), d = date.getDate(), y = date.getFullYear(), m = date.getMonth();
          var lastday = new Date(y, m, d + 60);

          return { $gte: firstday, $lte: lastday }
          break;

      case "@MONTHNUMBER":
          var firstday = new Date();
          var m = firstday.getMonth() + 1;
          return m;
          break;

      case "@DAYNUMBER":
          var firstday = new Date();
          var d = firstday.getDate();
          return d;
          break;

      case "@GTETOMORROW":
          var firstday = new Date();
          firstday.setDate(firstday.getDate());
          return { $gte: firstday };
          break;

      case "@GTETODAY":
          return { $gte: new Date() };
          break;

      case "@USERID":
          var d = params.authkey._id
          return d;
          break;

  }

}
