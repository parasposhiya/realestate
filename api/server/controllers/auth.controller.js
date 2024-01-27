import config from '../config/config.js';
import User from '../models/user.model.js';
import Common from '../helpers/common.js';

export default {
  login,
  logout,
  verifytoken
}

async function logout(req, res) {

  try {

    let data = {
      logout: true
    }
    res.json(data);
  } catch (e) {

  }

}


async function login(req, res) {
  try {

    let username = req.body.username;
    let password = req.body.password;


    let query = {};
    query["$and"] = [];
    query["status"] = { "$in": ["active"] };

    query["$and"].push({ "$or": [{ "username": username }, { "property.email": username }] });
    query["$and"].push({ "password": password });

    let user = await User.getbyUsername(query);

    if (user) {

      const jwtsign = {
        userid: user._id,
        fullname: user.fullname
      }

      let token = await Common.generatetoken(jwtsign);

      if (token) {
        res.json({
          accesstoken: token,
          user: {
            id: user._id,
            fullname: user.fullname,
            mobile: user.property && user.property.mobile ? user.property.mobile : "",
            email: user.property && user.property.email ? user.property.email : "",
          }
        });
      } else {
        res.json({ message: "User Not Valid" });
      }

    } else {
      res.json({ message: "User Not Valid" })
    }

  } catch (e) {
    console.log('login =>', e);
  }
}



async function verifytoken(req, res) {
  try {

  } catch (e) {
    console.log('verifytoken =>', e);
  }

}
