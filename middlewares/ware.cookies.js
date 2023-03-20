const { optionsCookies } = require("../helpers/helper.cookies.js");
const { Response } = require("../helpers/helper.message.js");
const dotenv = require("dotenv");

dotenv.config()

const signinCookies = 
(req, res, next) => {
    res.cookie(process.env.APPCOOKIESNAME, process.env.APPAPIKEY, optionsCookies);
    return next();
};

const checkCookiesValidities = 
(req, res, next) => {
    let { signedCookies } = req;
    signedCookies = JSON.parse(JSON.stringify(signedCookies));
    if(signedCookies && signedCookies.hasOwnProperty(process.env.APPCOOKIESNAME)) signinCookies(req, res, next);
    else{
        // signinCookies(req, res, next)
        return Response(res, 301, "Your session has expired ! Signin again to restore your session")
        // next()
    }
};

module.exports = {
    checkCookiesValidities,
    signinCookies
}