import Config from "./config.js";

export default {
    loginurl: `${Config.apiurl}/api/auth/login`,
    logouturl: `${Config.apiurl}/api/auth/logout`,
    customerurl: `${Config.apiurl}/api/members/`,
    customerdatafilterurl: `${Config.apiurl}/api/members/filter`,
    dashboardurl: `${Config.apiurl}/api/common/dynamicdashboard`,
    sellerurl: `${Config.apiurl}/api/sellers/`,
    sellerdatafilterurl: `${Config.apiurl}/api/sellers/filter`,
    lookupurl: `${Config.apiurl}/api/lookups/`,
    lookupfilterurl: `${Config.apiurl}/api/lookups/filter`,
    buyerurl: `${Config.apiurl}/api/buyers/`,
    buyerfilterurl: `${Config.apiurl}/api/buyers/filter`,
    followupurl: `${Config.apiurl}/api/followups/`,
    followupfilterurl: `${Config.apiurl}/api/followups/filter`,
    dealcompleteurl: `${Config.apiurl}/api/dealcompletes/`,
    dealcompletefilterurl: `${Config.apiurl}/api/dealcompletes/filter`,
    userurl: `${Config.apiurl}/api/users/`,
    userfilterurl: `${Config.apiurl}/api/users/filter`,
}