const { completeCodeCountryToPhoneNumber, fillphone } = require("../helpers/helper.fillphone");
const { Response } = require("../helpers/helper.message");
const { now } = require("../helpers/helper.moment");
const { Agriculteurs } = require("../models/model.agriculteurs");
const { Ambassadeurs } = require("../models/model.ambassadeurs");
const { PackagesAmbassadeurs } = require("../models/model.packageambassadeurs");
const { Packages } = require("../models/model.packages");
const { Pendingpaiements } = require("../models/model.pendingpaiement");
const { onCheckTransactionState } = require("../services/service.paiement");
const { onSendSMS } = require("../services/services.messages");

const PaiementController = {

    rechargecomptegenerale: async (req, res, next) => {
        const { nbpackage, valuepackage } = req.body;
        if(!nbpackage) return Response(res, 401, "This request must have at least nbpackage !")
        try {

            const PG_ = await Packages.findOne({
                where: {
                    id: 1
                }
            });

            if(PG_ instanceof Packages){

                PG_.update({
                    package: parseInt(PG_.package) + parseInt(nbpackage),
                    updatedon: now({ options: {} })
                })
                .then(p => {
                    return Response(res, 200, PG_)
                })
                .catch(e => {
                    return Response(res, 500, e)
                })

            }else{

                await Packages.create({
                    package: nbpackage,
                    valuepackage: valuepackage ? valuepackage : 30, // a package equal to 30
                    unity: "SMS"
                })
                .then(p => {
                    if(p instanceof Packages) return Response(res, 200, p)
                    else Response(res, 400, {})
                })
                .catch(e => {
                    return Response(res, 500, e)
                })
            }

        } catch (error) {
            return Response(res, 500, error)
        }
    },

    rechargepackagetoambassador: async (req, res, next) => {
        const { phone, nbpackage } = req.body;
        if(!phone || !nbpackage) return Response(res, 401, "This request must have at least nbpackage, idambassadeur")
        const idambassador = phone;
        try {

            const PG_ = await Packages.findOne({
                where: {
                    id: 1
                }
            });

            const ambass = await Ambassadeurs.findOne({
                where: {
                    phone: fillphone({ phone: idambassador }),
                    status: 1
                }
            });

            if(ambass instanceof Ambassadeurs){
                if(PG_ instanceof Packages){
                    if(PG_['package'] >= nbpackage){
    
                        const amb = await PackagesAmbassadeurs.findOne({
                            where: {
                                idambassadeur: ambass && ambass['id']
                            }
                        })
    
                        if(amb instanceof PackagesAmbassadeurs){
                            amb.update({
                                package: parseInt(amb.package) + parseInt(nbpackage),
                                updatedon: now({ options: {} })
                            })
                            .then(pc => {
                                PG_.update({
                                    package: parseInt(PG_.package) - parseInt(nbpackage),
                                    updatedon: now({ options: {} })
                                })
    
                                if(ambass instanceof Ambassadeurs){
                                    onSendSMS({
                                        to: completeCodeCountryToPhoneNumber({ phone: ambass && ambass['phone'] }),
                                        content: `Bonjour ${ambass && ambass['nom']} ${ambass && ambass['postnom']} votre recharge de ${nbpackage}Paquets vient d'etre effectué avec succès. Nouvelle balance ${amb && amb['package']}Paquets`
                                    }, (_, __) => {
    
                                    })
                                }
                                return Response(res, 200, amb)
                            })
                            .catch(er => {
                                return Response(res, 400, er)
                            })
                            
                        }else{
                            if(ambass instanceof Ambassadeurs){
                                PackagesAmbassadeurs.create({
                                    idambassadeur: ambass && ambass['id'],
                                    package: nbpackage
                                })
                                .then(pa_ => {
                                    if(pa_ instanceof PackagesAmbassadeurs){
                                        PG_.update({
                                            package: parseInt(PG_.package) - parseInt(nbpackage),
                                            updatedon: now({ options: {} })
                                        })
            
                                        if(ambass instanceof Ambassadeurs){
                                            onSendSMS({
                                                to: completeCodeCountryToPhoneNumber({ phone: ambass && ambass['phone'] }),
                                                content: `Bonjour ${ambass && ambass['nom']} ${ambass && ambass['postnom']} votre recharge de ${nbpackage}Paquets vient d'etre effectué avec succès. Nouvelle balance ${pa_ && pa_['package']}Paquets`
                                            }, (_, __) => {
            
                                            })
                                        }
                                        return Response(res, 200, pa_)
                                    }else{
                                        return Response(res, 400, "Account ambassador not found or is desactivated ! Or Package configuration error !")
                                    }
                                })
                                .catch(er_ => {
                                    return Response(res, 500, er_)
                                })
                            }else{
                                return Response(res, 400, "Account ambassador not found or is desactivated !")
                            }
                        }
    
                    }else{
                        return Response(res, 203, "insufficient balance in generale account, recharge ! ")
                    }
                }else{
                    return Response(res, 203, "insufficient balance in generale account, recharge ! ")
                }
            }else{
                return Response(res, 400, "Account ambassador not found or is desactivated !")
            }

        } catch (error) {
            console.log(error);
            return Response(res, 500, error)
        }
    },

    getpacquetgenerale: async (req, res, next) => {
        await Packages.findOne({
            where: {
                id: 1
            }
        })
        .then(pack => {
            if(pack instanceof Packages) return Response(res, 200, [pack])
            else return Response(res, 400)
        })
        .catch(err => {
            return Response(res, 500, err)
        })
    },

    getlistpaquets: async (req, res, next) => {
        Ambassadeurs.hasOne(PackagesAmbassadeurs, {foreignKey: "idambassadeur" });
        PackagesAmbassadeurs.belongsTo(Ambassadeurs, { foreignKey: "id" })
        try {
            await PackagesAmbassadeurs.findAndCountAll({
                where: {},
                include: [
                    {
                        model: Ambassadeurs,
                        required: true
                    }
                ]
            })
            .then(pack => {
                if(pack) return Response(res, 200, pack)
                else return Response(res, 400)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    getpacquetgetoambassador: async (req, res, next) => {
        try {
            const { idambassadeur } = req.params;
            if(!idambassadeur) return Response(res, 401, "This request must have at least 'idambassadeur'")
            await PackagesAmbassadeurs.findOne({
                where: {
                    idambassadeur: idambassadeur
                }
            })
            .then((pacquet) => {
                return Response(res, 200, pacquet)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    liste: async (req, res, next) => {
        try {
            await Pendingpaiements.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    listingpendings: async (req, res, next) => {
        try {
            await Pendingpaiements.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    ispending: 1
                }
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500)
        }
    },

    listingdone: async (req, res, next) => {
        try {
            await Pendingpaiements.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    ispending: 1
                }
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    listingfailed: async (req, res, next) => {
        try {
            await Pendingpaiements.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    ispending: 2 // 2 means the request was canceled or rejected
                }
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    checktransaction: async (req, res, next) => {
        const { idtransaction, param } = req.body;
        if(!idtransaction) return Response(res, 401, "This request mus have at least idtransaction !")
        try {
            await onCheckTransactionState({ idtransaction },
            (er, dn) => {
              if(dn) return Response(res, 200, dn)  
              else return Response(res, 400, er)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    }
};

module.exports = {
    PaiementController
}