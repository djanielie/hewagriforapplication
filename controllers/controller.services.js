const { Response } = require("../helpers/helper.message")
const { scheduleJobForWeather, gracefullShutdownAllSchudelJobs, scheduleJobWeatherEveryDayAtSpecificTime } = require("../services/service.scheduler");
const { onRefreshToken, onSendSMS, onCheckingBalance } = require("../services/services.messages");
const dotenv = require("dotenv");
const { completeCodeCountryToPhoneNumber, fillphone } = require("../helpers/helper.fillphone");
const { returnDayOfTheWeekFromNumber } = require("../helpers/helper.random");
const { _Globals } = require("../models/model.configurations");
const { onSynchronize } = require("../services/service.synchrnonisation");
const { ListeOfJobs } = require("../models/model.listjobs");
const { CustomizedSMS } = require("../models/model.cutsomizedsms");
const readXlsxFile = require("read-excel-file/node");
const { Villages } = require("../models/model.villages");
const { Agriculteurs } = require("../models/model.agriculteurs");
const { Champs } = require("../models/model.champs");
const { Provinces } = require("../models/model.provinces");
const { Territoires } = require("../models/model.territoirs");
const { Cultures } = require("../models/model.cultures");
const { loggerSync } = require("../helpers/helper.logwriterfile");
const { DicoCodeWeather } = require("../models/model.dicocodeweather");

dotenv.config();

const ServicesController = {

    onSynchronizeFromMobileToServer: async (req, res, next) => {
        const { champs, currentuser, agriculteurs } = req.body;
        
        if(!champs || !currentuser || !agriculteurs) return Response(res, 401, "This request must have at !champs || !currentuser || !agriculteurs data as parameter !");
        // const tr = await Configs.transaction();
        try {

            if(champs.length > 0){
                champs.forEach((c, i) => {

                    delete c['id'];
                    delete c['status'];
                    delete c['issynched'];
                    delete c['createdon'];

                    Champs.create({
                        ...c
                    })
                    .then(chmp => {
                        console.log(" Done on inserting champs ", i + 1, chmp);
                    })
                    .catch(err => {
                        loggerSync({
                            model: "Champs",
                            message: `${JSON.stringify(c)}`,
                            raison: JSON.stringify(err)
                        })
                        // console.log(" Error on inserting champs ", i + 1, "");
                    })
                })
            }
            if(agriculteurs.length > 0){

                agriculteurs.forEach((a, i) => {

                    delete a['id'];
                    delete a['status'];
                    delete a['issynched'];
                    delete a['createdon'];

                    Agriculteurs.create({
                        ...a
                    })
                    .then(chmp => {
                        console.log(" Done on inserting champs ", i + 1, chmp);
                    })
                    .catch(err => {
                        loggerSync({
                            model: "Agriculteurs",
                            message: `${JSON.stringify(a)}`,
                            raison: JSON.stringify(err)
                        })
                    })
                })
            }

            return Response(res, 200, "Synchronisation started succefuly !")

        } catch (error) {
            return Response(res, 500, error)
        }
    },

    onSynchronizeFromCollectorMobile: async (req, res, next) => {
        const { collects } = req.body;
        return Response(res, 200, collects)
    },

    onSynchronizeFromServerToMobile: async ( req, res, next ) => {

        const agrs_ = await Agriculteurs.findAll({ where: { status: 1 } });
        const chaps_ = await Champs.findAll({ where: { status: 1 } });
        const prvs_ = await Provinces.findAll({ where: { status: 1 } });
        const terrtr_ = await Territoires.findAll({ where: { status: 1 } });
        const vllgs_ = await Villages.findAll({ where: { status: 1 } });
        const cultures_ = await Cultures.findAll({ where: { status: 1 } });

        if(agrs_ && chaps_ && prvs_ && terrtr_ && vllgs_)
            return Response(res, 200, 
                    { 
                        // villages: JSON.stringify(vllgs_),
                        // agriculteurs: JSON.stringify(agrs_),
                        // champs: JSON.stringify(chaps_),
                        // provinces: JSON.stringify(prvs_),
                        // territoires: JSON.stringify(terrtr_),
                        villages: (vllgs_),
                        agriculteurs: (agrs_),
                        champs: (chaps_),
                        provinces: (prvs_),
                        territoires: (terrtr_),
                        cultures: (cultures_)
                    }
                );
        else Response(res, 400, {})
    },

    onImportDataFromExcelfile: async ( req, res, next ) => {
        
        let filename = null;

        const excelFilter = (file) => {
            if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) return true;
            else return false;
        };

        if (req.files && req.files.file) {
            const img = file = req.files.file;
            if(excelFilter(img)){
                const _ = img.name;
                const ext = _.substring(_.lastIndexOf('.')).toLowerCase();
                filename = `excel-file-hewagri-${new Date().getMilliseconds()}${Math.round(Math.random() * 10)}`.concat(ext);
                img.mv('assets/as_doc/' + filename, (err) => {
                    if (err){ 
                        filename = 'userprofile.png';
                        console.log(" error occured when trying to read this file => ", err);
                    }
                });
            }else{
                return Response(res, 400, "Please provide a file in your request ! EXCEL file required !");
            }

        }else{
            return Response(res, 400, "Please provide a file in your request !")
        }

        try {
            let path = "assets/as_doc/" + filename;
            readXlsxFile(path).then((rows) => {
                // skip header
                // rows.shift();
                let created = [];
                rows.forEach((row, i) => {
                    let Line = {
                        id: row[0],
                        nomvillage: row[2],
                        latitude: row[5],
                        longitude: row[6],
                        idgroupement: row[16],
                        idterritoire: row[18],
                        provincecode: row[8]
                    };

                    Villages.create({
                        village: Line['nomvillage'],
                        latitude: Line['latitude'],
                        longitude: Line['longitude'],
                        idgroupement: Line['idgroupement'] || "---",
                        provincecode: Line['provincecode'],
                        territoire: Line['idterritoire'] || "---"
                    })
                    .then(vill => {
                        if(vill instanceof Villages) created.push(vill)
                    })
                    .catch(err => {
                        // console.log(err);
                        console.log(" Line not inserted => ", i)
                    })
                });

            });
            return Response(res, 200, "File Uploaded successfuly !")
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    onchangesmsServiceProvider: async (req, res, next) => {
        const { providerid } = req.body;
        if(!providerid || parseInt(providerid) > 3) return Response(res, 401, "Invalid provided param !")
        try {
            global.providerid = providerid;
            return Response(res, 200, "Service: Message provider succefuly updated !") 
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    addcustomizedsms: async (req, res, next) => {
        const { type, message, idlangue } = req.body;
        if(!type || !message || !idlangue) return Response(res, 401, "this request must have at least type, message, idlangue");
        try {
            await CustomizedSMS.create({
                idlangue,
                case: parseInt(type),
                content: message
            })
            .then(sms => {
                if(sms instanceof CustomizedSMS) return Response(res, 200, sms)
                else return Response(res, 400, {})
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    addCodeToDicoForWeather: async (req, res, next) => {

        const { idlangue, main, description, code } = req.body;
        if(!idlangue || !main || !description || !code) return Response(res, 401,"this request must have at least ! !idlangue || !main || !description || !code");

        try {

            await DicoCodeWeather.create({
                idlangue, 
                main, 
                description, 
                code
            })
            .then(dicocode => {
                if(dicocode instanceof DicoCodeWeather) return Response(res, 200, dicocode)
                else return Response(res, 400, dicocode)
            })
            .catch(err => {
                return Response(res, 503, err)
            })

        } catch (error) {
            return Response(res, 500, error)
        }
    },

    listecustomizedsms: async (req, res, next) => {
        try {
            CustomizedSMS.findAndCountAll({
                where: {
                    status: 1
                }
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(e => {
                return Response(res, 500, e)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    startJobsFromTable: async (cb) => {
        cb = typeof cb === 'function' ? cb : () => {};
        const listjobs = await ListeOfJobs.findAll({
            where: {
                status: 1
            }
        });

        listjobs.forEach(job => {
            scheduleJobWeatherEveryDayAtSpecificTime({
                hour: job && job['hour'],
                minute: job && job['minutes'],
                range: {
                    end: job && job['end'],
                    start: job && job['start']
                }
            }, (er, done) => {
                if(done){
                    job.update({
                        updatedon: new Date().toLocaleString()
                    });
                    console.log(" Job started from Table => ", job && job['jobname'], "updatedon => ", job && job['updatedon']);
                }
            })
        });

    },

    listjobs: async (req, res, next) => {
        try {
            await ListeOfJobs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                }
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(e => {
                return Response(res, 500, e)
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    start: async (req, res, next) => {
        const { daystart, dayend, hour, minute } = req.body;
        if(!daystart || !dayend || !hour || !minute) return Response(res, "This request must have at least !daystart || !dayend || !hour || !munites ");
        try {
            await scheduleJobWeatherEveryDayAtSpecificTime({
                range: {
                    start: daystart, // ie. start on monday
                    end: dayend //ie. end on sunday
                },
                hour, // ie. le job commence chaque 23
                minute // à 0 munite
            }, (er, done) => {

                console.log( " Response is Service Name => ", done && done['message'] );
                ListeOfJobs.create({
                    jobname: `Job envoi SMS de ${hour}:${minute}` || done && done['message'],
                    hour,
                    minutes: minute,
                    secondes: 0,
                    jobdescription: `Job Description`,
                    updatedon: new Date().toLocaleString(),
                    createdon: new Date().toLocaleString()
                })
                .then(_ => {
                    // console.log(_);
                })
                .catch(er => {
                    // console.log(er);
                });

                return Response(res, 200, {
                    message: "All services started! ",
                    serviceName: done && done['message'],
                    configs: {
                        rang: `${returnDayOfTheWeekFromNumber({ dayNumber: daystart })} - ${returnDayOfTheWeekFromNumber({ dayNumber: dayend })}`,
                        heure: `${hour}H`,
                        minute: `${minute}Munites`
                    }
                })
            })
        } catch (error) {
            console.log(error);
            return Response(res, 500, error)
        }
    },
    
    stop: async (req, res, next) => {
        try {
            await gracefullShutdownAllSchudelJobs((er, done) => {
                if(done){
                    ListeOfJobs.update({
                        status: 0
                    }, {
                        where: {
                            status: 1
                        }
                    })
                    .then(listes => {
                        return Response(res, 200, "Toutes les taches on été mis en arrêt !")
                    })
                    .catch(err => {
                        return Response(res, 500, "Cannot gracefuly shutdown all services !")
                    })
                }else return Response(res, 500, "Cannot gracefuly shutdown all services !")
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    fetchTokenFromOrange: async (req, res, next) => {
        try {
            await onRefreshToken({
                oldtoken: process.env.APPDEFAULTORANGEBEARERTOKEN
            }, (err, done) => {
                console.log(" Done is => ", done);
            })
            return Response(res, 200, {})
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    sendSmS: async (req, res, next) => {
        const { content, phone } = req.body;
        if(!content || !phone) return Response(res, 401, "this request must have at least !content || !phone")
        onSendSMS({
            content: content,
            to: completeCodeCountryToPhoneNumber({ phone })
        }, (e, d) => {
            return Response(res, 200, {d,token: global && global['token']})
        })
    },

    addnewcridentials: async (req, res, next) => {
        const { password, card, phone } = req.body;
        if(!password || !card) return Response(res, 401, "This request must have at least password and card in body !")
        try {
            await _Globals.findOne({
                where: {
                    id: 1,
                    status: 1
                }
            })
            .then(gbl => {
                if(gbl instanceof _Globals){
                    gbl.update({
                        n_card: card,
                        n_password: password.trim(),
                        n_phone: phone ? fillphone({ phone }) : gbl.phone
                    })
                    return Response(res, 200, gbl)
                }else{
                    _Globals.create({
                        n_card:card,
                        n_password: password.trim(),
                        n_phone: phone && fillphone({ phone })
                    })
                    .then(glb_ => {
                        if(glb_ instanceof _Globals)  return Response(res, 200, glb_)
                        else  return Response(res, 400, {})
                    })
                    .catch(e => {
                        return Response(res, 500, e)
                    })
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })

        } catch (error) {
            return Response(res, 500, error)
        }
    },

    onchckingbalance: async (req, res, next) => {
        try {
            await onCheckingBalance({ options: {} }, (err, done) => {
                if(err){ 
                    console.log(" upLine ", err.toString());
                    return Response(res, 400, err);
                }else return Response(res, 200, done);
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    deliverreceipt: async (req, res, next) => {
        return Response(res, 200, {})
    },

    onSynchronisation: async (req, res, next) => {
        const { type, data } = req.body;
        if(!type || !data) return Response(res, 401, "this request must have at least type of synchronisation or data")
        try {
           await onSynchronize({ data: data, type })
        } catch (error) {
            return Response(res, 500, error)
        }
    }
}

module.exports = {
    ServicesController
}