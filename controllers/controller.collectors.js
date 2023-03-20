const { Response } = require("../helpers/helper.message");
const axios = require('axios');
const { randomLongNumber } = require("../helpers/helper.random");
const dotenv = require('dotenv');
const { loggerSystem } = require("../helpers/helper.logwriterfile");
const { fillphone, completeCodeCountryToPhoneNumber } = require("../helpers/helper.fillphone");

dotenv.config();

const timeout = 25000;

const CollectorController = {

    signin: async (req, res, next) => {

        const { username, password } = req.body;
        if(!username || !password) return Response(res, 401, "This request must have at least ! username, password ");

        try {
            await axios({
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/login`,
                data: {
                    username,
                    password,
                    parms: randomLongNumber({ length: 7 })
                }
            })
            .then(log => {
                if(log && log['status'] === 200){
                    const d = log['data'];
                    switch (d && d['status']) {
                        case 200:
                            global.token = d['token'];
                            delete d['message'];
                            delete d['status'];
                            delete d['token'];
                            Response(res, 200, {...d['data']})
                            break;
                        case 201:
                            loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify({ username, password }) })
                            return Response(res, 203, " Error on login to collector service ")
                            break;
                        default:
                            loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify({ username, password }) })
                            return Response(res, 203, " Error on login to collector service ")
                            break;
                    }
                }else{
                    loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify({ username, password }) })
                    return Response(res, 203, " Error on login to collector service ")
                }
            })
            .catch(err => {
                console.log("Error on login to Collector server => ", err);
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    loadMarketsPacketsProducts: async (req, res, next) => {
        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/abonnement/load-infos`,
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp &&( resp['status'] === 200)){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data'])
                    }else return Response(res, 400, {})
                }else{
                    return Response(res, 400, {})
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    loadInitProducts: async (req, res, next) => {
        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/produit/collecte/init`,
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp &&( resp['status'] === 200)){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data'])
                    }else return Response(res, 400, {})
                }else{
                    return Response(res, 400, {})
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    collection: async (req, res, next) => {
        const {
            produit,
            unity,
            price,
            currency,
            comments,
            parms                              
        } = req.body;
        if(!produit || !unity || !price || !currency) return Response(res, 401, " This request must have at least !produit || !unity || !price || !currency");

        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/produit/collecte/create`,
                data: {
                    "produit": produit,
                    "unite": unity,
                    "prix": price,
                    "devise": currency,
                    "commentaire": comments,
                    "parms": randomLongNumber({ length: 7})                               
                },
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp &&( resp['status'] === 200)){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data'])
                    }else return Response(res, 400, {})
                }else{
                    return Response(res, 400, resp['data'])
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    souscription: async (req, res, next) => {
        const { phone, market, language, selectedproducts, packet } = req.body;
        if(!phone || !market || !language || !selectedproducts || !packet )
        return Response(res, 401, " This request must have at least !phone || !market || !language || !selectedproducts || !packet")

        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/abonnement/create`,
                data: {
                    "phone": `+${completeCodeCountryToPhoneNumber({ phone: fillphone({ phone }) })}`,
                    "marche": [
                        ...market
                    ],
                    "langue": language,
                    "produit": [
                        ...selectedproducts
                    ],
                    "packet": packet,
                    "parms": randomLongNumber({ length: 7 })
                },
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp && ( resp['status'] === 200 )){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data']);
                    }else return Response(res, 400, {})
                }else{
                    return Response(res, 400, resp['data'])
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    souscriptionconseilagricole: async (req, res, next) => {

        const { phone, language, products } = req.body;
        if(!phone || !language || !products) return Response(res, 401, "This requet must have at least !phone || !language || !product");
        const parms = randomLongNumber({ length: 7 });
        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/conseil/create-abonnement`,
                data: {
                    "phone": `+${completeCodeCountryToPhoneNumber({ phone })}`,
                    "langue": language,
                    "produit": [
                        ...products
                    ],
                    parms
                },
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp && ( resp['status'] === 200 )){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data']);
                    }else return Response(res, 400, {});
                }else{
                    return Response(res, 400, resp['data'])
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    listecollections: async (req, res, next) => {
        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/produit/collecte/liste/by-collecteur`,
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(resp => {
                if(resp &&( resp['status'] === 200)){
                    if(resp && (resp['data']['status'] === 200)){
                        const d = resp['data'];
                        delete d['message'];
                        delete d['status'];
                        return Response(res, 200, d['data'])
                    }else return Response(res, 400, {})
                }else{
                    return Response(res, 400, {})
                }
            })
            .catch(err => {
                return Response(res, 400, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    }
}

module.exports = {
    CollectorController
}