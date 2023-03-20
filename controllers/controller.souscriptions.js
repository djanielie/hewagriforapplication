const { dateValidator } = require("../helpers/helper.datavalidator");
const { Response } = require("../helpers/helper.message");
const { Souscriptions } = require("../models/model.souscriptions");
const { v4: uuidv4 } = require('uuid');
const { Agriculteurs } = require("../models/model.agriculteurs");
const { Ambassadeurs } = require("../models/model.ambassadeurs");
const { Champs } = require("../models/model.champs");
const { Langues } = require("../models/model.langues");
const { onSendSMS } = require("../services/services.messages");
const { completeCodeCountryToPhoneNumber, fillphone } = require("../helpers/helper.fillphone");
const { onAuthentification, onMakePaiement } = require("../services/service.paiement");
const { _Globals } = require("../models/model.configurations");
const { sendMail, onSendMail } = require("../services/service.mail");
const { TypeSouscriptions } = require("../models/model.typesouscriptions");
const { Pendingpaiements } = require("../models/model.pendingpaiement");
const { scheduleAJobToBeExecutedOnceTime } = require("../services/service.scheduler");
const { PackagesAmbassadeurs } = require("../models/model.packageambassadeurs");
const { checkIfCanPayWithPackage } = require("../helpers/helper.helper");
const { generateIdentifier, genenateMultilangueTemplate } = require("../helpers/helper.random");
const { addDaysThenReturnUnix } = require("../helpers/helper.moment");
const { CustomizedSMS } = require("../models/model.cutsomizedsms");
const { loggerSystem } = require("../helpers/helper.logwriterfile");

const onSavingSouscription = async ({ req, reference, agriculteur, typesouscritpion, champs, message }) => {

    const { type, datedebut, datefin, frequence, idchamps, idambassadeur, idlangue, idagriculteur, method, isfake } = req;
    if(!type || !datedebut || !datefin || !frequence || !idchamps || !idambassadeur || !idlangue || !idagriculteur || !method ) return false;
    else {     

        const Message = message;
        console.log(" Message will be =================> ", Message['content']);

        await Souscriptions.create({
            idtypesouscription: type,
            datedebut,
            datefin,
            enddatetimeunix: addDaysThenReturnUnix({ days: type }),
            frequence,
            idagriculteur,
            idchamps,
            idambassadeur,
            isfake: isfake ? isfake : 0,
            idlangue,
            ref: reference ,//uuidv4(),
            status: method === "package" ? 1 : 0 
        })
        .then(souscr => {
            if(souscr instanceof Souscriptions) { 

                if(agriculteur instanceof Agriculteurs){

                    onSendSMS({
                        content: genenateMultilangueTemplate({
                            concerne: {
                                fsname: agriculteur && agriculteur['nom'],
                                lsname: agriculteur && agriculteur['postnom'],
                                champsname: champs && champs['champs'],
                                code: "",
                                packet: typesouscritpion && typesouscritpion['type'],
                                password: ""
                            },
                            message: Message && Message['content'] ? Message['content'] : `Bonjour # ## votre souscription de #$$$$# aux informations sur la meteo agricole a reussie reussie avec succes`
                        }),
                        to: completeCodeCountryToPhoneNumber({ phone: agriculteur && agriculteur['phone'] })
                    }, (er, done) => {

                    })

                }else{
                    loggerSystem({ message: "Agricultor not found", title: "Paiement avec paquet echec !" })
                    console.log(" +++++++++++++++++++++++ Error on saving souscription => ", {});
                }

            }else{
                loggerSystem({ message: "Souscription not saved", title: "Paiement avec paquet echec !" })
                console.log(" +++++++++++++++++++++++ Error on saving souscription => ", {});
            }
        })
        .catch(err => {
            loggerSystem({ message: "Souscription not saved", title: "Paiement avec paquet echec !" })
            console.log(" +++++++++++++++++++++++ Error on saving souscription => ", err);
        }) 

        return true;
    }
};

const SouscriptionsController = {
    
    add: async (req, res, next) => {
        
        const { type, datedebut, datefin, frequence, idchamps, idambassadeur, idlangue, idagriculteur, currency, method } = req.body;
        if(!type || !datedebut || !datefin || !frequence || !idchamps || !idambassadeur || !idlangue || !idagriculteur || !method ) return Response(res, 401, "this request mus have at least !type || !datedebut || !datefin || !frequence || !idchamps || !idambassadeur || !idlangue || !idagriculteur && method")
       
        const agriculteur = await Agriculteurs.findOne({
            where: {
                id: idagriculteur
            }
        });

        const Message = await CustomizedSMS.findOne({
            where: {
                case: 5, // this means welcome souscription
                idlangue: idlangue // means default here is swahili
            },
            attributes: ['content']
        })

        const typesouscritpion = await TypeSouscriptions.findOne({
            where: {
                id: (type)
            }
        });

        const champsSouscrit = await Champs.findOne({
            where: {
                id: idchamps
            }
        })

        const directPaiement = async () => {
            if(
                dateValidator({ chaine: datedebut, res }) 
                && dateValidator({ chaine: datefin, res }))
            try {
                
                const glbl = await _Globals.findOne({
                    where: {
                        id: 1,
                        status: 1
                    },
                    // attributes: ["n_card", "n_password", "status"]
                });
    
                const ambassadeur = await Ambassadeurs.findOne({
                    where: {
                        id: idambassadeur
                    }
                });
            
                if(typesouscritpion instanceof TypeSouscriptions && ambassadeur instanceof Ambassadeurs && agriculteur instanceof Agriculteurs && champsSouscrit instanceof Champs);
                else return Response(res, 401, " We can not find `TypeSouscription` || `Ambassadeur` || `Agriculteur` ");
    
                if(glbl instanceof _Globals){
    
                    await onAuthentification({
                        card: glbl && glbl['n_card'],
                        password: glbl && glbl['n_password'],
                    }, (eAuth, dAuth) => {
                        if(dAuth){
                            
                            return onMakePaiement({
                                amount: typesouscritpion && typesouscritpion['prix'],
                                phone: ambassadeur && ambassadeur['phone'],
                                currency: 1
                            }, (pError, pDone) => {
                                if(pDone){
                                    // console.log(" Response => ", pDone);
                                    Pendingpaiements.create({
                                        reference: pDone && pDone['data'] && pDone['data']['reference'],
                                        phone: fillphone({ phone: ambassadeur && ambassadeur['phone'] }),
                                        amount: typesouscritpion && typesouscritpion['prix'],
                                        currency: currency ? currency : "USD"
                                    })
                                    .then(pending => {
                                        if(pending instanceof Pendingpaiements){
                                            onSavingSouscription({ 
                                                "req": req && req.body, 
                                                reference: pDone && pDone['data'] && pDone['data']['reference'], 
                                                agriculteur, 
                                                typesouscritpion, 
                                                champs: champsSouscrit,
                                                message: Message
                                            }) // ie. saving souscription and then activate if all gone well

                                            scheduleAJobToBeExecutedOnceTime({ minutes: 2 }) // ie. apres munites : 3 une requete est lancer pour tester si l'opération s'est bien passer

                                            return Response(res, 201, pending);
                                        }else return Response(res, 400, {});
                                    })
                                    .catch(e => {
                                        return Response(res, 500, e)
                                    });
    
                                }else{
                                    return Response(res, 400, "Nothing to runder for this request !");
                                }
                            });
    
                        }else{
                            return Response(res, 400, {" case": "The request can not be proceded !", dAuth, eAuth })
                        }
                    });
    
                }else{
    
                    onSendMail({
                        to: `developer.david.maene@gmail.com`,
                        content: `"Configuration error cridentials for login on paiement are invalides ! password : ${glbl && glbl['n_password']} | ${glbl && glbl['n_card']}`
                    }, (_, __) => {});
    
                    return Response(res, 400, "Configuration error cridentials for login on paiement are invalides ! ")
                }
            } catch (error) {
                console.log('====================================');
                console.log(error);
                console.log('====================================');
                return Response(res, 500, error)
            }
        }

        const packagePaiement = async () => {

            const p = await PackagesAmbassadeurs.findOne({
                where: {
                    idambassadeur
                }
            });

            if(p instanceof PackagesAmbassadeurs){
                if(checkIfCanPayWithPackage({ type, nbPackage: p && p['package'] })){
                    if(
                        agriculteur instanceof Agriculteurs &&
                        typesouscritpion instanceof TypeSouscriptions &&
                        champsSouscrit instanceof Champs &&
                        Message instanceof CustomizedSMS
                    ){
                        if(
                            onSavingSouscription({
                                "req": req.body,
                                reference: generateIdentifier({ prefix: "HEWAREF" }),
                                agriculteur,
                                message: Message,
                                champs: champsSouscrit,
                                typesouscritpion
                            })
                        ){
                            p.update({
                                package: parseInt(p['package']) - parseInt(type)
                            })
                            .then(P => {
                                return Response(res, 200, p)
                            })
                            .catch(e => {
                                return Response(res, 203, "insufficient balance, paiement faild !");
                            })
                        }else{
                            return Response(res, 203, "insufficient balance, paiement faild !");
                        }

                    }else{
                        loggerSystem({ message: JSON.stringify(req.body), title: "Paiement with packet Bad request, request can not be proceded because bad params was sent !" })
                        return Response(res, 400, "Bad request, request can not be proceded because bad params was sent !")
                    }
                    
                }else return Response(res, 201, "insufficient balance, paiement faild !");
            }else return Response(res, 203, "insufficient balance, paiement faild !");
        }

        if(method === 'direct' || method === 1) return directPaiement();
        if(method === 'package' || method === 2) return packagePaiement();
        else return Response(res, 400, "Bad request : this request must have parameter paiement method ! this can be: direct OR package");

    },

    liste: async(req, res, next) => {
        try {
            TypeSouscriptions.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(TypeSouscriptions, { foreignKey: "idtypesouscription" });

            Agriculteurs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Agriculteurs, { foreignKey: "idagriculteur" });

            Souscriptions.hasOne(Langues, { foreignKey: "id" });
            Souscriptions.belongsTo(Langues, { foreignKey: "idlangue" });

            Ambassadeurs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Ambassadeurs, { foreignKey: "idambassadeur" });

            Champs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Champs, { foreignKey: "idchamps" });

            await Souscriptions.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: TypeSouscriptions,
                        required: false
                    },
                    {
                        model: Agriculteurs,
                        required: false
                    },
                    {
                        model: Langues,
                        required: false
                    },
                    {
                        model: Ambassadeurs,
                        required: false
                    },
                    {
                        model: Champs,
                        required: false
                    }
                ]
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 500, err )
            })
        } catch (error) {
            return Response(res, 500, error )
        }
    },

    listebyambassador: async(req, res, next) => {
        const { ambss } = req.params;
        if(!ambss) return Response(res, 401, " This request must have at least idambassadeur !");
        try {

            TypeSouscriptions.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(TypeSouscriptions, { foreignKey: "idtypesouscription" });

            Agriculteurs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Agriculteurs, { foreignKey: "idagriculteur" });

            Souscriptions.hasOne(Langues, { foreignKey: "id" });
            Souscriptions.belongsTo(Langues, { foreignKey: "idlangue" });

            Ambassadeurs.hasOne(Souscriptions, { foreignKey: "id" });
            Souscriptions.belongsTo(Ambassadeurs, { foreignKey: "idambassadeur" });

            await Souscriptions.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1,
                    idambassadeur: ambss
                },
                include: [
                    {
                        model: TypeSouscriptions,
                        required: false
                    },
                    {
                        model: Agriculteurs,
                        required: false
                    },
                    {
                        model: Langues,
                        required: false
                    },
                    // {
                    //     model: Ambassadeurs,
                    //     required: false
                    // }
                ]
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    deleteSouscriptn: async (req, res) => {
        try {
            await Souscriptions.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteSousptn => {
                if (deleteSousptn) {
                    return Response(res, 200, req.params.id)
                } else {
                    return Response(res, 404, 'Server error, The item was not found')
                }
            }).catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    updateSuscpt: async (req, res) => {
        const { datedebut, datefin, frequence } = req.body;
        try {
            await Langues.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateLgue => {
                if (updateLgue) {
                    updateLgue.update({
                        langue,
                        shortname
                    })
                    .then(finalUpdt => {
                        if (finalUpdt) {
                            return Response(res, 200, finalUpdt);
                        }
                    })
                    .catch(e => {
                        return Response(res, 404, e )
                    })
                } else {
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },
}

module.exports = {
    SouscriptionsController
}