import webpartCtrl from "../helpers/webpart.js"
import Member from "../models/member.model.js"
import User from "../models/user.model.js";

export default {
    getDynamicDashboard,
}

async function getDynamicDashboard(req, res) {

    let data = [];

    for (let webpart of webpartCtrl.webparts) {

        let schemaname = webpart.schemaname;
        let query = webpart.query;

        let docs = await mongoaggregation(schemaname, query);

        let item = {
            title: webpart.title,
            total: docs[0].total,
        };
        
        data.push(item);
    }

    res.json(data);

}

async function mongoaggregation(schemaname, query) {

    try {
        let result = [];

        switch (schemaname) {
            case 'members':
                return result = await Member.aggregate(query);
                break;
            case 'users':
                return result = await User.aggregate(query);
                break;
            default:
                return result = [];
                break;

        }

    } catch (error) {
        return [];
    }

}