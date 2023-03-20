const { Response } = require("../helpers/helper.message.js")
const dotenv = require("dotenv");
const { checkCookiesValidities } = require("./ware.cookies.js");
dotenv.config();

const accessValidator = (req, res, next) => {
    const headers = req && req['headers'];

    if(headers){
        if(
            headers 
            && headers.hasOwnProperty("apikey") 
            // && headers.hasOwnProperty("accesskey")
        )
        {
            const { apikey, accesskey } = headers;
            if(
                apikey === process.env.APPAPIKEY 
                // && accesskey === process.env.APPACCESKEY
            ){
                // checkCookiesValidities(req, res, next)
                return next()
            }else return Response(res, 403, "You don't have access to this ressource !")
        }else return Response(res, 403, "You don't have access to this ressource !")
    }else return Response(res, 403, "You don't have access to this ressource !")
}

module.exports = {
    accessValidator
}