const { randomLongNumber } = require("../helpers/helper.random");
const axios = require("axios");
const dotenv = require('dotenv');
const { loggerSystem } = require("../helpers/helper.logwriterfile");

dotenv.config()

const timeout = 25000;

const Services = {

    onLoginToCollectionServices: async () => {
        const data = {
            username: process.env.APPCRIDENTIALSCOLLECTORPWD,
            password: process.env.APPCRIDENTIALSCOLLECTORUSERNAME,
            parms: randomLongNumber({ length: 7 })
        };

        console.log("-------------------------------------------------------------------");
        console.log("================> Trying to connect to #Collector Services => ", new Date().toLocaleString());
        console.log("-------------------------------------------------------------------");

        await axios({
            method: "POST",
            url: `${process.env.APPCOLLECTORURL}/login`,
            data
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
                        // Response(res, 200, {...d['data']})
                        break;
                    case 201:
                        loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify(data) })
                        // return Response(res, 203, " Error on login to collector service ")
                        break;
                    default:
                        loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify(data) })
                        // return Response(res, 203, " Error on login to collector service ")
                        break;
                }
            }else{
                loggerSystem({ title: `Error on Login to collector service !`, message: JSON.stringify(data) })
                // return Response(res, 203, " Error on login to collector service ")
            }
        })
        .catch(err => {
            console.log("Error on login to Collector server => ", err);
        })
    },

    onNotifyAllCustomersCONSEILSAGRICOLES: async () => {
        try {
            await axios({
                timeout,
                method: "POST",
                url: `${process.env.APPCOLLECTORURL}/conseils/send-to-all`,
                data: {},
                headers: { 
                    'Authorization': `Bearer ${global.token}`, 
                    'Content-Type': 'application/json', 
                    'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
                }
            })
            .then(conseils => {
                loggerSystem({ message: JSON.stringify(conseils && conseils['data']), title: "Notification Conseils agricole" })
            })
            .catch(err => {
                loggerSystem({ message: JSON.stringify(err), title: "Erreur Notification Conseils agricole | ORM" })
            })
        } catch (error) {
            loggerSystem({ message: JSON.stringify(err), title: "Erreur Notification Conseils agricole | Catch" })
        }
    }
};

module.exports = {
    Services
}

