const { Response } = require("../helpers/helper.message");
const { Champs } = require("../models/model.champs");
const dotenv = require('dotenv');
const { Agriculteurs } = require("../models/model.agriculteurs");
const { Ambassadeurs } = require("../models/model.ambassadeurs");
const { Zoneproductions } = require("../models/model.zoneproductiopns");
const { Cultures } = require("../models/model.cultures");
const { faker } = require('@faker-js/faker');
const { onSendSMS } = require("../services/services.messages");
const { completeCodeCountryToPhoneNumber } = require("../helpers/helper.fillphone");
const { CustomizedSMS } = require("../models/model.cutsomizedsms");
const { genenateMultilangueTemplate } = require("../helpers/helper.random");

dotenv.config();

const ChampsController = {

    add: async (req, res, next) => {
        
        const { champs, idagriculteurs, dimensions, latitude, longitude, altitude, idzoneproduction, idculture, idambassadeur } = req.body;
        if(!idagriculteurs || !dimensions || !latitude || !longitude || !idculture || !idambassadeur) return Response(res, 401, " This request must have at least !idagriculteurs || !dimensions || !latitude || !longitude || !idculture || !idambassadeur");

        const agriculteur = await Agriculteurs.findOne({
            where: {
                id: idagriculteurs
            }
        });

        const Message = await CustomizedSMS.findOne({
            where: {
                case: 2, // this means welcome message
                idlangue: 8 // means default here is swahili
            },
            attributes: ['content']
        })

        try {
            await Champs.create({
                champs,
                idagriculteurs,
                dimensions,
                latitude,
                longitude,
                idambassadeur,
                altitude,
                idzoneproduction: idzoneproduction && idzoneproduction.length
                    ? idzoneproduction
                    : process.env.APPESCAPESTRING,
                idculture: idculture.toString(),
            })
                .then(chmp => {
                    if (chmp instanceof Champs) {
                        if(agriculteur instanceof Agriculteurs){
                            // Message && Message['content'] ? Message['content'] : `Hujambo # ## sehemu yako ya #$$$# imehifadhiwa kwa mafanikio. katika Kivu Green`
                            onSendSMS({
                                content: genenateMultilangueTemplate({
                                    concerne: {
                                        champsname: champs,
                                        code: "",
                                        fsname: agriculteur && agriculteur['nom'],
                                        lsname: agriculteur && agriculteur['postnom'],
                                        packet: "",
                                        password: ""
                                    },
                                    message: Message && Message['content'] ? Message['content'] : `Hujambo # ## sehemu yako ya #$$$# imehifadhiwa kwa mafanikio. katika Kivu Green`
                                }),
                                to: completeCodeCountryToPhoneNumber({ phone: agriculteur && agriculteur['phone'] })
                            }, ( _, __) => {})
                            
                        }
                        return Response(res, 200, chmp)
                    } else {
                        return Response(res, 400, chmp)
                    }
                })
                .catch(err => {
                    return Response(res, 400, err)
                })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    liste: async(req, res, next) => {
        try {
            Agriculteurs.hasOne(Champs, { foreignKey: "id" });
            Champs.belongsTo(Agriculteurs, { foreignKey: "idagriculteurs" });

            Ambassadeurs.hasOne(Champs, { foreignKey: "id" });
            Champs.belongsTo(Ambassadeurs, { foreignKey: "idambassadeur" });

            Zoneproductions.hasOne(Champs, { foreignKey: "id" });
            Champs.belongsTo(Zoneproductions, { foreignKey: "idzoneproduction" });

            Cultures.hasOne(Champs, { foreignKey: "id" });
            Champs.belongsTo(Cultures, { foreignKey: "idculture" });

            await Champs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Agriculteurs,
                        required: false
                    },
                    {
                        model: Ambassadeurs,
                        required: false,
                    },
                    {
                        model: Zoneproductions,
                        required: false,
                    },
                    {
                        model: Cultures,
                        required: false,
                    }
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

    deleteChamp: async (req, res) => {
        try{
            await Champs.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteChmp => {
                if (deleteChmp) {
                    return Response(res, 200, req.params.id)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    updateChamp: async (req, res) => {
        const { dimensions, latitude, longitude, champs, idagriculteurs, idzoneproduction, idambassadeur, idculture } = req.body;
        const { id } = req.params;
        if(!id) return Response(res, 401, "This request must have at least id as params !")
        try {
            await Champs.findOne({
                where: {
                    id
                }
            })
            .then(updateChmp => {
                if (updateChmp) {
                    updateChmp.update({
                        idculture: idculture.toString(),
                        dimensions: dimensions ? dimensions : updateChmp.dimensions,
                        latitude: latitude ? latitude : updateChmp.latitude, 
                        longitude: longitude ? longitude : updateChmp.longitude,
                        champs: champs ? champs : updateChmp.champs,
                        idagriculteurs: idagriculteurs ? idagriculteurs : updateChmp.idagriculteurs,
                        idzoneproduction: idzoneproduction ? idzoneproduction : updateChmp.idzoneproduction,
                        idambassadeur: idambassadeur ? idambassadeur : updateChmp.idambassadeur,
                    }
                    ).then(finalUpdt => {
                        if (finalUpdt) {
                            return Response(res, 200, finalUpdt);
                        }
                    })
                } else {
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    listebyambassador: async(req, res, next) => {
        const { ambss } = req.params;
        if(!ambss) return Response(res, 401, " This request must have at least idambassadeur !");
        
        Agriculteurs.hasOne(Champs, { foreignKey: "id" });
        Champs.belongsTo(Agriculteurs, { foreignKey: "idagriculteurs" });

        // Agriculteurs.hasOne(Cooperatives, { foreignKey: "id" });
        // Cooperatives.belongsTo(Agriculteurs, { foreignKey: "membrecooperative" });

        try {
            await Champs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1,
                    idambassadeur: ambss
                },
                include: [
                    {
                        model: Agriculteurs,
                        required: true
                    }
                ]
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                console.log(err);
                return Response(res, 500, err)
            })
        } catch (error) {
            console.log(err);
            return Response(res, 500, error)
        }
    },

    listebyagriculteur: async(req, res, next) => {
        const { agr } = req.params;
        if(!agr) return Response(res, 401, " This request must have at least idagriculteur !");

        Agriculteurs.hasOne(Champs, { foreignKey: "id" });
        Champs.belongsTo(Agriculteurs, { foreignKey: "idagriculteurs" });

        try {
            await Champs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1,
                    idagriculteurs: agr
                },
                include: [
                    {
                        model: Agriculteurs,
                        required: true
                    }
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
    }
}

module.exports = {
    ChampsController
}