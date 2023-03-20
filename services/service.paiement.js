const axios = require("axios");
const dotenv = require("dotenv");
const { fillphone, completeCodeCountryToPhoneNumber } = require("../helpers/helper.fillphone");
const { loggerSystem } = require("../helpers/helper.logwriterfile");
const { Pendingpaiements } = require("../models/model.pendingpaiement");
const { Souscriptions } = require("../models/model.souscriptions");
const { onSendMail } = require("./service.mail");
const { onNotifyAmbassadeurAndAfriculteur } = require("./service.scheduler");

dotenv.config();

axios.interceptors.request.use(
    config => {
        // config.headers.apikey = "$2b$10$AS6GbX37SkQS6skhMOYjveDOuUUgvGz9dvsrCbeylWl/SwMkDDp2G";
        // config.headers.apikeyaccess = "kivugreen@api2022";
        return config;
    }, 
    rejected => {
        return new Promise.reject(rejected)
    }
);

axios.interceptors.response.use(
    (resposne) => {
        return resposne;
    }
    , error => {
        const er = error.response ? error.response : undefined;
        return er ? er : new Promise.reject(error)
    }
);

const timeout = 25000;

const onMakePaiement = async ({ phone, amount, currency }, cb) => {
    try {
        await axios({
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "x-access-token": `Bearer ${global && global['access']
                ? global['access']
                : '874154df45e72f0f4f9745a16819461b:bafdd0c28582cf562502e3ed7a8579de:bbc4b90429488f26e958a3ef97d348ad6530c5c0dc58d95b43f06c65b3f7569af8a18107643025d4d440e762c362d7782c29e526e3b361bfa388a76f8e93808706195d083fed4e9ab1d49824d5a778738cec87abcaa83f5fbf82a047bd2271b225047b95d86097e3880e9773ca4e731eb7208264605901835835d829f449557f852a3f7727fcac257be2615b9de0e004d1b73b749c1988dea09aa0a04ad7ac8b143c1c8ce34a2c1712ec2872796c528bedc0b705094b1625b31de3db1c905b7e'}`
            },
            "url": `${process.env.APPBASEURLFORPAYEMENT}/green/deposit`,
            "data": {
                currency: currency ? parseInt(currency) : 1,
                phone: `+${completeCodeCountryToPhoneNumber({ phone })}`,
                amount: parseFloat(amount)
            }
        })
        .then(r => {
            console.log(" Response from making paiement => ", r && r['data']);
            loggerSystem({ title: "Pending paiement ",message: JSON.stringify({ phone, amount, currency })})
            cb(undefined,  r && r['data']);
        })
        .catch(err => {
            console.log(" Une erreur vient de se produire on making paiement => ", err);
            loggerSystem({ title:  "Error on paiement ", message: JSON.stringify({ phone, amount, currency })})
            cb(err, undefined);
        })
    } catch (error) {
        loggerSystem({ title:  "Error on paiement ", message: JSON.stringify({ phone, amount, currency })})
        console.log(" Une erreur vient de se produire on making paiement => ", error);
        cb(error, undefined);
    }
};

const onRefreshToken = async ({ refresh }) => {
    cb = typeof(cb) === "function" ? cb : () => {};
    if(!refresh) return cb("refresh missed !", undefined)
    try {
        await axios({
            method: "POST",
            url: `${process.env.APPBASEURLFORPAYEMENT}/auth/refresh`,
            timeout,
            data: {
                token
            }
        })
        .then(res => {
            cb(undefined, res && res['data'])
        })
        .catch(err => {
            cb(undefined, err)
        })
    } catch (error) {
        cb(error, undefined)
    }
};

const onAuthentification = async ({ card, password }, cb) => {
    cb = typeof(cb) === "function" ? cb : () => {};
    console.log("Cridentials for login are => ", card, password);
    if(!card || !password) return cb("card or password missed !", undefined)
    try {
        await axios({
            method: "POST",
            timeout,
            url: `${process.env.APPBASEURLFORPAYEMENT}/auth`,
            data: {
                card,
                password
            }
        })
        .then(res => {
           const d = res && res['data'];
           if(d.data.hasOwnProperty("access")){//&& d['status'] === 200
                const data = d && d['data'];
                global.access = data && data['access'];
                global.refresh = data && data['refresh'];
                cb(undefined, data && data['data']);
            }else cb(d, undefined)
        })
        .catch(err => {
            cb(err, undefined)
        })
    } catch (error) {
        cb(error, undefined)
    }
};

const onCheckTransactionState = async ({ idtransaction }, cb) => {
    
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(" Checking transaction for ID >>>> ", idtransaction);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    await axios({
        method: "POST",
        timeout,
        headers: {
            "Content-Type": "application/json",
            "x-access-token": `Bearer ${global && global['access'] 
            ? global['access']
            : '874154df45e72f0f4f9745a16819461b:bafdd0c28582cf562502e3ed7a8579de:bbc4b90429488f26e958a3ef97d348ad6530c5c0dc58d95b43f06c65b3f7569af8a18107643025d4d440e762c362d7782c29e526e3b361bfa388a76f8e93808706195d083fed4e9ab1d49824d5a778738cec87abcaa83f5fbf82a047bd2271b225047b95d86097e3880e9773ca4e731eb7208264605901835835d829f449557f852a3f7727fcac257be2615b9de0e004d1b73b749c1988dea09aa0a04ad7ac8b143c1c8ce34a2c1712ec2872796c528bedc0b705094b1625b31de3db1c905b7e'}`
        },
        url: `${process.env.APPBASEURLFORPAYEMENT}/green/check`,
        data: {
            "telecom" : 2,
            "trans_id": idtransaction
        }
    })
    .then(chk => {
        console.log(" Donnees check transactions => ", chk && chk['data']);
        if(chk && chk.hasOwnProperty("trans_id") && chk.hasOwnProperty("currency")){
            try {

                Souscriptions.update(
                    {
                        status: 1
                    }, {
                        where: {
                          ref: `${idtransaction}`
                        }
                    }
                )
                .then(_ => {
                    onNotifyAmbassadeurAndAfriculteur({ souscription: _ });
                    console.log(" Updating pending oper success =>  ", _);
                    Pendingpaiements.update(
                        { ispending: 0 },
                        { where: { 
                                reference: `${idtransaction}`
                            } 
                    })
                    .success(_s => {
                        console.log(" Updating pending oper =>  ", _s);
                        cb(undefined, _s)
                    })
                    .error(_e => {
                        onSendMail({
                            to: `developer.david.maene@gmail.com`,
                            content: `Bonjour, une erreur vient de se produire lors de l'activation d'une souscription id transaction : ${idtransaction}`
                        }, (_, __) => {})
                        cb(_e, undefined)
                    })
                })
                .catch(__ => {
                    console.log(" Updating pending oper error =>  ", __);
                    onSendMail({
                        to: `developer.david.maene@gmail.com`,
                        content: `Bonjour, une erreur vient de se produire lors de l'activation d'une souscription id transaction : ${idtransaction}`
                    }, (_, __) => {})
                    cb(__, undefined)
                });

            } catch (error) {
                onSendMail({
                    to: `developer.david.maene@gmail.com`,
                    content: `Bonjour, une erreur vient de se produire lors de l'activation d'une souscription id transaction : ${idtransaction}`
                }, (_, __) => {})
                cb(error, undefined)
            }
        }else cb(undefined, chk['data'])
    })
    .catch(err => {
        console.log(" Error => ", err)
        onSendMail({
            to: `developer.david.maene@gmail.com`,
            content: `Bonjour, une erreur vient de se produire lors de l'activation d'une souscription id transaction : ${idtransaction}`
        }, (_, __) => {})
    })
};

module.exports = {

    onAuthentification,
    onCheckTransactionState,
    onMakePaiement,
    onRefreshToken
    
};