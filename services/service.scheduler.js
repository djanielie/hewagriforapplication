const schedule = require('node-schedule');
const { Souscriptions } = require('../models/model.souscriptions');
const { onOneCallForWeather } = require('./service.weather');
const { Agriculteurs } = require('../models/model.agriculteurs');
const { Champs } = require('../models/model.champs');
const { onSendSMS } = require('./services.messages');
const { completeCodeCountryToPhoneNumber } = require('../helpers/helper.fillphone');
const { generateMessageTemplate } = require('../helpers/helper.random');
const { Pendingpaiements } = require('../models/model.pendingpaiement');
const moment = require("moment");
const { onCheckTransactionState } = require('./service.paiement');
const { sendMail, onSendMail } = require('./service.mail');
const { Ambassadeurs } = require('../models/model.ambassadeurs');
const { nowInUnix } = require('../helpers/helper.moment');
const { Op } = require("sequelize");
const { Langues } = require('../models/model.langues');
const { CustomizedSMS } = require('../models/model.cutsomizedsms');
const { Services } = require('./services.all');
const { DicoCodeWeather } = require('../models/model.dicocodeweather');
// const { Ambassadeurs } = require('../models/model.ambassadeurs');

const scheduleJobForWeather = async ({ executeeachon , cb }) => {
    // each 42 muns => 42 * * * *
    // each 2 munis => */2 * * * *
    cb = cb && typeof cb === "function" ? cb : () => {}
    schedule.scheduleJob('*/2 * * * *', () => {
        try {
            Champs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Champs, { foreignKey: "idchamps" });
    
            Souscriptions.findAll({
                where: {
                    status: 1
                },
                attributes: ["datedebut", "datefin", "idchamps", "idlangue", "idtypesouscription"],
                include: [
                    {
                        model: Champs,
                        required: true
                    }
                ]
            })
            .then(souscs => {
                console.log(" Data of is =>", souscs);
                cb(undefined, "started")
            })
            .catch(err => {
                console.warn(" Can not Schedule the JOB => ", " An error occured when trying to find all Souscription", err);
                cb("cannot start", undefined)
            })
        } catch (error) {
            cb("cannot start", undefined)
        }
    });
};

const directCall = async () => {
    try {

        Champs.hasOne(Souscriptions, { foreignKey: "id" });
        Souscriptions.belongsTo(Champs, { foreignKey: "idchamps" });

        // Langues.hasOne(Souscriptions, { foreignKey: "id" });
        // Souscriptions.belongsTo(Langues, { foreignKey: "idlangue" });

        Agriculteurs.hasOne(Souscriptions, { foreignKey: "id" });
        Souscriptions.belongsTo(Agriculteurs, { foreignKey: "idagriculteur" });

        const Sous = await Souscriptions.findAll({
            where: {
                status: 1,
                nbmessage: {
                    [Op.gt]: 0
                },
                enddatetimeunix: {
                    [Op.gte]: nowInUnix({ options: {} })
                }
                // dateend: 
            },
            attributes: ["id", "datedebut", "datefin", "idchamps", "idlangue", "idtypesouscription", "idagriculteur", "nbmessage"],
            include: [
                {
                    model: Champs,
                    required: true
                },
                {
                    model: Agriculteurs,
                    required: true
                },
                // {
                //     model: Langues,
                //     required: true
                // }
            ]
        });

        if(Sous){
            const d = Sous;
            try {

                d.forEach(async (i, k) => {

                    const chmp = i && i['__tbl_champ'];
                    const agr = i && i['__tbl_agriculteur'];
                    const solde = i && parseInt(i['nbmessage']);
                    let customizedSMS = ""
                    // console.log(" Associated Agriculteur is => ", agr );
                    // console.log(" Associated Champs is => ", chmp );

                    const SMS = await CustomizedSMS.findOne({
                        where: {
                            idlangue: i && i['idlangue']
                        }
                    });
                
                    if(SMS instanceof CustomizedSMS){ customizedSMS = SMS && SMS['content']; }
                    else customizedSMS = "Bonjour # aujourd'hui il y aura probablement ##, demain il y aura probablement #$#! sur votre champs de #$$#, Solde: #$$$#SMS";

                    i.update({
                        nbmessage: parseInt(i['nbmessage']) - 1
                    })

                    // console.log(" Souscription => ", i.toJSON());
                    onOneCallForWeather({
                        lat: chmp && chmp['latitude'],
                        lon: chmp && chmp['longitude'],
                        cansaveforhistory: true
                    }, (e, we) => {  
                        if(we){

                            const weatTD = we && we['message'];
                            const weatTT = we && we['message'];

                            const weatherToday = weatTD && weatTD['daily'] && weatTD['daily'][0];
                            const weatherTomorrow = weatTT && weatTT['daily'] && weatTT['daily'][1];

                            const todayWeather = weatherToday && weatherToday['weather'][0];
                            const tomorrowWeather = weatherTomorrow && weatherTomorrow['weather'][0];

                            const to = completeCodeCountryToPhoneNumber({ phone: agr && agr['phone'] });

                            console.log(" Weather Message Today ::: => ", todayWeather);
                            console.log(" Weather Message Tomorrow ::: => ", tomorrowWeather);
                            console.log(" The message was sent to this number ::: => ", to);

                            onSendSMS({
                                content: generateMessageTemplate({ 
                                    CustomizedSMS: customizedSMS,
                                    nbmessage: solde - 1,
                                    agriculteur: `${agr && agr['nom']} ${agr && agr['postnom']}`, 
                                    decision: todayWeather && todayWeather['description'],
                                    decisionTomorrow: tomorrowWeather && tomorrowWeather['description'],
                                    champsname: chmp && chmp['champs']
                                }),
                                to,
                            }, (err, done) => {
                                if(done) console.log(" SMS was succesfuly sent => ", done);
                                else console.log(" Can not send the sms => ", err);
                            })
                        }
                    })
                })
                // cb(undefined, "started")
            } catch (error) {
                console.warn(" Can not Schedule the JOB => ", " An error occured when trying to execute Souscription => ", error)
            }
        }else console.warn(" Can not Schedule the JOB => ", " An error occured when trying to find all Souscription => ");

    } catch (error) {
        console.warn(" Can not Schedule the JOB => ", " An error occured when trying to find all Souscription => ", error)
        // cb("cannot start", undefined)
    }
};

const scheduleJobWeatherEveryDayAtSpecificTime = async ({ range: { start, end }, hour, minute }, cb) => {

    cb = cb && typeof cb === "function" ? cb : () => {}
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(parseInt(start), parseInt(end))];
    rule.hour = hour && !isNaN(hour) ? parseInt(hour) : 23;
    rule.minute = minute && !isNaN(minute) ? parseInt(minute) : 0;
    rule.tz = 'Etc/GMT-2'; // ie je prend le temps de l'afrique de l'Est
    // '*/1 * * * *'

    const j = schedule.scheduleJob(rule, async () => {

        try {

            // notifying all customers about `conseils agricoles `
            Services.onNotifyAllCustomersCONSEILSAGRICOLES()
            // ==================

            Champs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Champs, { foreignKey: "idchamps" });
    
            Agriculteurs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Agriculteurs, { foreignKey: "idagriculteur" });
    
            const Sous = await Souscriptions.findAll({
                where: {
                    status: 1,
                    nbmessage: {
                        [Op.gt]: 0
                    },
                    enddatetimeunix: {
                        [Op.gte]: nowInUnix({ options: {} })
                    }
                    // dateend: 
                },
                attributes: ["id", "datedebut", "datefin", "idchamps", "idlangue", "idtypesouscription", "idagriculteur", "nbmessage"],
                include: [
                    {
                        model: Champs,
                        required: true
                    },
                    {
                        model: Agriculteurs,
                        required: true
                    },
                    // {
                    //     model: Langues,
                    //     required: true
                    // }
                ]
            });
    
            if(Sous){
                const d = Sous;
                try {
    
                    d.forEach(async (i, k) => {
    
                        const chmp = i && i['__tbl_champ'];
                        const agr = i && i['__tbl_agriculteur'];
                        const solde = i && parseInt(i['nbmessage']);
                        let customizedSMS = ""
    
                        const SMS = await CustomizedSMS.findOne({
                            where: {
                                idlangue: i && i['idlangue']
                            }
                        });
                
                        if(SMS instanceof CustomizedSMS){ customizedSMS = SMS && SMS['content']; }
                        else customizedSMS = "Bonjour # aujourd'hui il y aura probablement ##, demain il y aura probablement #$#! sur votre champs de #$$#, Solde: #$$$#SMS";
    
                        i.update({
                            nbmessage: parseInt(i['nbmessage']) - 1
                        })
    
                        // console.log(" Souscription => ", i.toJSON());
                        onOneCallForWeather({
                            lat: chmp && chmp['latitude'],
                            lon: chmp && chmp['longitude'],
                            cansaveforhistory: true
                        }, (e, we) => {  
                            if(we){
    
                                const weatTD = we && we['message'];
                                const weatTT = we && we['message'];
    
                                const weatherToday = weatTD && weatTD['daily'] && weatTD['daily'][0];
                                const weatherTomorrow = weatTT && weatTT['daily'] && weatTT['daily'][1];
    
                                const todayWeather = weatherToday && weatherToday['weather'][0];
                                const tomorrowWeather = weatherTomorrow && weatherTomorrow['weather'][0];

                                const dicoToday = DicoCodeWeather.findOne({
                                    where: {
                                        idlangue: i && i['idlangue'],
                                        code: todayWeather['id']
                                    },
                                    attributes: ['description']
                                })

                                const dicoTomorrow = DicoCodeWeather.findOne({
                                    where: {
                                       idlangue: i && i['idlangue'],
                                       code: tomorrowWeather['id']
                                    },
                                    attributes: ['description']
                                })
    
                                const to = completeCodeCountryToPhoneNumber({ phone: agr && agr['phone'] });
    
                                console.log(" Weather Message Today ::: => ", todayWeather);
                                console.log(" Weather Message Tomorrow ::: => ", tomorrowWeather);
                                console.log(" The message was sent to this number ::: => ", to);
    
                                onSendSMS({
                                    content: generateMessageTemplate({ 
                                        CustomizedSMS: customizedSMS,
                                        nbmessage: solde - 1,
                                        agriculteur: `${agr && agr['nom']} ${agr && agr['postnom']}`, 
                                        decision: dicoToday && dicoToday['description'] || todayWeather && todayWeather['description'],
                                        decisionTomorrow: dicoTomorrow && dicoTomorrow['description'] || tomorrowWeather && tomorrowWeather['description'],
                                        champsname: chmp && chmp['champs']
                                    }),
                                    to,
                                }, (err, done) => {
                                    if(done) console.log(" SMS was succesfuly sent => ", done);
                                    else console.log(" Can not send the sms => ", err);
                                })
                            }
                        })
                    })
                    // cb(undefined, "started")
                } catch (error) {
                    console.warn(" Can not Schedule the JOB => ", " An error occured when trying to execute Souscription => ", error)
                }
            }else console.warn(" Can not Schedule the JOB => ", " An error occured when trying to find all Souscription => ");
    
        } catch (error) {
            console.warn(" Can not Schedule the JOB => ", " An error occured when trying to find all Souscription => ", error)
            // cb("cannot start", undefined)
        }
    });
    cb(undefined, { code: 200, message: j.name, data: j })
};

const onNotifyAmbassadeurAndAfriculteur = async ({ souscription }) => {
    const { idagriculteur, idambassadeur } = souscription;

    const agriculteur = await Agriculteurs.findOne({
        where: {
            id: idagriculteur
        }
    });

    const ambassadeur = await Ambassadeurs.findOne({
        where: {
            id: idambassadeur
        }
    });

    if(agriculteur instanceof Agriculteurs){
        onSendSMS({
            content: `Bonjour ${agriculteur && agriculteur['nom']} ${agriculteur && agriculteur['postnom']} votre souscription a réusie avec succès `,
            to: completeCodeCountryToPhoneNumber({ phone: agriculteur && agriculteur['phone'] })
        }, (er, done) => {

        })
    }

    if(ambassadeur instanceof Ambassadeurs){
        onSendSMS({
            content: `Bonjour ${ambassadeur && ambassadeur['nom']} ${ambassadeur && ambassadeur['postnom']} paiment effectué avec succès ! pour la souscription de ${agriculteur && agriculteur['nom']} ${agriculteur && agriculteur['postnom']} `,
            to: completeCodeCountryToPhoneNumber({ phone: ambassadeur && ambassadeur['phone'] })
        }, (er, done) => {

        })
    }
};

const scheduleAJobToBeExecutedOnceTime = async ({ minutes  }) => {

    const rule = new schedule.RecurrenceRule();

    rule.tz = 'Etc/GMT-2';
    rule.year = moment().year();
    rule.month = moment().month();
    rule.date = moment().date();
    rule.hour = moment().hours();
    rule.minute = moment().minutes() + (minutes);
    // rule.second = moment(time).seconds();

    try {
        const j = schedule.scheduleJob(rule, async () => {
            const p = await Pendingpaiements.findAll({
                where: {
                    ispending: 1
                }
            });
    
            p.forEach((_p, _i) => {
                onCheckTransactionState({ 
                    idtransaction: _p && _p['reference']
                }, (err, f) =>  {})
            });
        });
    
        console.log(" Paiement effectué => ", j.name);
    } catch (error) {
        console.log(" Error on paiement => ", error);
        onSendMail({
            to: `developer.david.maene@gmail.com`,
            content: `App is going to crash because of a bad parameter on schedule job in case of : after paiement`
        }, (e, d) => {})
    }
};

const gracefullShutdownAllSchudelJobs = async (cb) => {
    schedule.gracefulShutdown()
    .then(g => cb(undefined, "Shutdown Jobs done"))
    .catch(e => cb(" error occured on shutdow", undefined))
};

module.exports = {
    directCall,
    onNotifyAmbassadeurAndAfriculteur,
    scheduleAJobToBeExecutedOnceTime,
    scheduleJobForWeather,
    gracefullShutdownAllSchudelJobs,
    scheduleJobWeatherEveryDayAtSpecificTime
}