const axios = require('axios');
const dotenv = require("dotenv");
const { completeCodeCountryToPhoneNumber } = require('../helpers/helper.fillphone');

dotenv.config();

const onSendSMSWithKECCEL = async ({ to, content }, cb) => {
    try {
        await axios({
            method: "POST",
            url: 'https://api.keccel.com/sms/v2/message.asp',
            data: 
            {
                "to": completeCodeCountryToPhoneNumber({ phone: to }),
                "message": content,
                "from": process.env.SENDERID,
                "token": "GHPK3A29WFG6Q4K"
            }
        })
        .then(sms => {
            console.log('====================================');
            console.log(" Message sent with KECCEL => ", sms['data']);
            console.log('====================================');
            cb(undefined, sms['data'])
        })
        .catch(er => {
            cb(er, undefined)
        })
    } catch (error) {
        cb(error, undefined)
    }
};

const onSendSMSWithLWS = async ({ content, to }, cb) => {
    try {
        await axios({
            method: "POST",
            url: process.env.APPLWSURLAPI,
            params: {
                action: "send-sms",
                api_key: process.env.SMSAPIKEYLWS,
                to: completeCodeCountryToPhoneNumber({ phone: to }),
                from: process.env.SENDERID,
                sms: content
            }
        })
        .then(sms => {
            console.log('====================================');
            console.log(" Message sent with LWS => ", sms['data']);
            console.log('====================================');
            cb(undefined, sms)
        })
        .catch(er => {
            cb(er, undefined)
        })
    } catch (error) {
        cb(error, undefined)
    }
};

const onSendSMSWithOrange = async ({ content, to }, cb) => {
    axios.post(
        `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${process.env.APPCOUNTRYSENDERNUMBER}/requests`,
        {
            'outboundSMSMessageRequest': {
                'address': `tel:+${to}`,
                'senderAddress': `tel:+${process.env.APPCOUNTRYSENDERNUMBER}`,
                // "senderName": `${process.env.APPNAME} | Kivu Green`,
                'outboundSMSTextMessage': {
                    'message': content
                }
            }
        },
        {
            headers: {
                'Authorization': `Bearer ${global && global.token ? global.token : "URcUGnrD0zQcRNsPZCrf2Nrjamb5"}`,
                'Content-Type': 'application/json'
            }
        }
    )
    .then(rep => {
        const d = rep && rep['data'];
        if(d && d.hasOwnProperty("code") && d['code'] === 41){
            onRefreshToken({
                oldtoken: process.env.APPDEFAULTORANGEBEARERTOKEN
            }, (ftoken, dtoken) => {
                if(dtoken) onSendSMSWithoutFeedBack({ content, to })
                else cb(undefined, { code: 500, message: "Error on execution ...!", data: {...ftoken} })
            })
        }
        if(d && d.hasOwnProperty("code") && d['code'] === 42){
            onRefreshToken({
                oldtoken: process.env.APPDEFAULTORANGEBEARERTOKEN
            }, (ftoken, dtoken) => {
                if(dtoken) onSendSMSWithoutFeedBack({ content, to })
                else cb(undefined, { code: 500, message: "Error on execution ...!", data: {...ftoken} })
            })
        }
        else if(d && d.hasOwnProperty("outboundSMSMessageRequest")){ 
            cb(undefined,  { code: 200, message: "success execution", data: {...d} });
        }else{ 
            console.log("debut 2 Une erreur =========================================> ");
            console.log(d.requestError);
            console.log("fin 2 Une erreur =========================================> ");
            return cb(undefined, { code: 500, message: "Error on execution ...!", data: {...d} })
        }
    })
    .catch(er => {
        console.log(" Refreshing error ... => ", er);
        return cb(undefined, { code: 500, message: "Error on execution !", data: er })
    })
};

const onRefreshToken = async ({ oldtoken }, cb) => {
    console.log(" Session of Token expired  ", " Refreshing Token ... ");
    oldtoken = oldtoken ? oldtoken : `URcUGnrD0zQcRNsPZCrf2Nrjamb5`;
    axios.post(
        process.env.APPREFRESHTOKENORANGEURL,
        new URLSearchParams(
            {
                'grant_type': 'client_credentials'
            }
        ),
        {
            headers: {
                'Authorization': `Basic ${oldtoken}`,
                'Accept': 'application/json'
            }
        }
    )
    .then(response => {
        if(response && response['status'] === 200){
            const r = response && response['data'];
            if(r && r.hasOwnProperty("access_token")){
                global.token = r && r['access_token'];
                console.log("New Token is =>", global.token);
                console.log(" Fetching Token succeded! ");
                return cb(undefined, { code: 200, ...response && response['data'], message: "Fetching done !" });
            }else{
                console.log(" Fetching Token error ! ");
                return cb(undefined, { code: 500, message: "Error on fetching Token from server !", data: {} });
            }
        }else{
            console.log(" Fetching Token error ");
            return cb(undefined, { code: 500, message: "Error on fetching Token from server !", data: {} });
        }
    })
    .catch(err => {
        console.log(" Fetching Token error ");
        return cb(undefined, { code: 500, message: "Error on fetching Token from server !", data: err });
    })
};

const onSendSMSWithoutFeedBack = async ({ content, to }) => {

        axios.post(
            `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${process.env.APPCOUNTRYSENDERNUMBER}/requests`,
            {
                'outboundSMSMessageRequest': {
                    'address': `tel:+${to}`,
                    'senderAddress': `tel:+${process.env.APPCOUNTRYSENDERNUMBER}`,
                    // "senderName": `${process.env.APPNAME} | Kivu Green`,
                    'outboundSMSTextMessage': {
                        'message': content
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${global && global.token ? global.token : "URcUGnrD0zQcRNsPZCrf2Nrjamb5"}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(rep => {
            const d = rep && rep['data'];
            console.log(" send SMS without feedback: => ", d);
        })
        .catch(er => {
            console.log(" send SMS without feedback: => ", er);
        })
};

const onSendSMS = async ({ content, to }, cb) => {

    const providerID = global.providerid ? parseInt(global.providerid) : 1
    console.log("+++++++++++++++++++++++++ Content => ", content );
    console.log("+++++++++++++++++++++++++ To => ", to );
    console.log("+++++++++++++++++++++++++ With Provider => ", providerID );
    
    cb = typeof cb === "function" ? cb : () => {}; 

    try {
        switch (providerID) {
            case 1:
                onSendSMSWithKECCEL({
                    content,
                    to
                }, (er, done) => {
                    cb(er, done)
                })
                break;
            case 3:
                onSendSMSWithLWS({ 
                    content,
                    to
                }, (e, r) => {
                    cb(e, r)
                })
                break;
            case 2:
                onSendSMSWithOrange({
                    content,
                    to
                }, (err, done) => {
                    cb(err, done)
                })
                break;
            default:
                onSendSMSWithKECCEL({
                    content,
                    to
                }, (er, done) => {
                    cb(er, done)
                })
                break;
        }

        return cb(undefined, { code: 200, message: "Nothing to render", data: {} })
    } catch (error) {
        return cb(undefined, { code: 500, message: "Error on execution !", data: er })
    }
};

const onCheckingBalance = async ({ options }, cb) => {
    cb = typeof(cb) === "function" ? cb : () => {}
    try {
        await axios(
            {
                method: 'get',
                url: 'https://api.orange.com/sms/admin/v1/contracts',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${global && global.token ? global.token : "URcUGnrD0zQcRNsPZCrf2Nrjamb5"}`
                }
            }
        )
        .then(rep => {
            const d = rep && rep['data'];
            if(( d && d.hasOwnProperty("code")) || d['code'] === 41 || d['code'] === 42 ){
                onRefreshToken({ oldtoken: process.env.APPDEFAULTORANGEBEARERTOKEN }, (err, done) => {
                    if(done) onCheckingBalance({ options: {} }, cb(undefined, d))
                    else cb(" Error => ", undefined)
                })
            }else{
                return cb(undefined, d)
            }
        })
        .catch(err => {
            cb(err, undefined)
        })
    } catch (error) {
        cb(error, undefined)
    }
};

module.exports = 
{
    onSendSMSWithKECCEL,
    onSendSMSWithLWS,
    onSendSMSWithoutFeedBack,
    onCheckingBalance,
    onSendSMS,
    onRefreshToken
}