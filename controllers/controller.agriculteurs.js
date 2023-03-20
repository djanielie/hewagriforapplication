const { emailValidator, phoneValidator, nameValidator, genderValidator } = require("../helpers/helper.datavalidator");
const { fillphone, completeCodeCountryToPhoneNumber } = require("../helpers/helper.fillphone");
const { Response } = require("../helpers/helper.message");
const { hashPWD } = require("../helpers/helper.password");
const { randomLongNumber, genenateMultilangueTemplate } = require("../helpers/helper.random");
const { Agriculteurs } = require("../models/model.agriculteurs");
const { Ambassadeurs } = require("../models/model.ambassadeurs");
const { Cooperatives } = require("../models/model.cooperatives");
const { sendMail } = require("../services/service.mail");
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
const { onSendSMS } = require("../services/services.messages");
const { CustomizedSMS } = require("../models/model.cutsomizedsms");

dotenv.config();

const AgriculteurController = {

    register: async (req, res, next) => {
        const { nom, postnom, prenom, email, phone, genre, date_de_daissance, idambassadeur, membrecooperative, password, isfake } = req.body;
        if(!nom || !postnom || !phone || !genre || !date_de_daissance || !idambassadeur) return Response(res, 401, " This request must have at least a nom, postnom, phone, genre, idambassadeur, date_de_daissance ");
        const code = randomLongNumber({ length: 6 });
        const pwd = await hashPWD({ plaintext: code });
        if
        (
            phoneValidator({ phone, res })
            && nameValidator({ name: nom, res })
            && nameValidator({ name: postnom, res})
            && genderValidator({ chaine: genre, res })
        ){
            try {

                const Message = await CustomizedSMS.findOne({
                    where: {
                        case: 2, // this means welcome message
                        idlangue: 8 // means default here is swahili
                    },
                    attributes: ['content']
                })

                await Agriculteurs.create({
                    nom: nom.toLowerCase(),
                    postnom: postnom.toLowerCase(),
                    prenom: prenom && prenom.toLowerCase(),
                    email: email && email.toLowerCase(),
                    phone: fillphone({ phone, res }),
                    password: pwd,
                    genre,
                    isfake: isfake && isfake === 1 ? 1 : 0,
                    date_de_daissance: date_de_daissance.toString(),
                    ref: uuidv4(),
                    idambassadeur,
                    membrecooperative: membrecooperative && membrecooperative
                }) 
                .then(agr => {
                    if(agr instanceof Agriculteurs){
                        
                        // if(agr && agr['email'] !== process.env.APPESCAPESTRING){
                        //     sendMail({
                        //         title: "Création de compte",
                        //         to: agr && agr['email'],
                        //         body: `Bonjour ${agr && agr['nom']} ${agr && agr['postnom']} \n Votre compte ${process.env.APPNAME} vient d'être crée avec succès`
                        //     }, (err, done) => {
                                
                        //     })
                        // }

                        // `Bonjour ${agr && agr['nom']} ${agr && agr['postnom']} \n Votre compte ${process.env.APPNAME} vient d'etre cree avec succes`

                        onSendSMS({
                            to: completeCodeCountryToPhoneNumber({ phone: agr && agr['phone'] }),
                            content: genenateMultilangueTemplate({ 
                                concerne: {
                                    fsname: agr && agr['nom'],
                                    lsname: agr && agr['postnom'],
                                    code: "",
                                    password: "",
                                    champsname: "",
                                    packet: ""
                                },
                                message: Message && Message['content'] ? Message['content'] : `Bonjour ## # votre compte vert ambassadeur kivu vient d'être créé ; maintenant tu es un ambassadeur du Kivu Green`
                            })
                        }, (er, done) => {})
    
                        return Response(res, 200, agr);
                    }else{
                        return Response(res, 400, agr);
                    }
                })
                .catch(err => {
                    console.log(err);
                    return Response(res, 503, err)
                })
            } catch (error) {
                return Response(res, 500, error);
            }
        }
    },
    
    liste: async (req, res, next) => {
        try {
            Ambassadeurs.hasOne(Agriculteurs, { foreignKey: "idambassadeur" });
            Agriculteurs.belongsTo(Ambassadeurs, { foreignKey: "id" });

            Cooperatives.hasOne(Agriculteurs, { foreignKey: "membrecooperative" });
            Agriculteurs.belongsTo(Cooperatives, { foreignKey: "id" });

            Agriculteurs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Ambassadeurs,
                        required: false,
                    },
                    {
                        model: Cooperatives,
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

    listefem: async (req, res, next) => {
        try {
            Agriculteurs.findAndCountAll({
                where: {
                    genre: "female",
                },
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        }catch (error) {
            return Response(res, 500, error)
        } 
    },

    listehom: async (req, res, next) => {
        try {
            Agriculteurs.findAndCountAll({
                where: {
                    genre: "male",
                },
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        }catch (error) {
            return Response(res, 500, error)
        } 
    },

    listeByIdAmbassadeur: async (req, res, next) => {
        const { ambassadeur } = req.params;
        if(!ambassadeur) return Response(res, 401, " This request must have at least idambassadeur !")
        try {
            await Agriculteurs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1,
                    idambassadeur: (ambassadeur)
                }
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

    deleteAgriculteur: async (req, res) => {
        try {
            await Agriculteurs.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteAgri => {
                if (deleteAgri) {
                    return Response(res, 200, req.params.id)
                } else {
                    return Response(res, 404, 'Server error, The item was not found')
                }
            }).catch(err => {
                return Response(res, 500, err);
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    updateAgriculteur: async (req, res) => {
        const { nom, prenom, postnom, email, phone, genre, membrecooperative } = req.body;
        const { id } = req.params;
        
        if(!id) return Response(res, 401, " This request must have at least id ")
        try {
            await Agriculteurs.findOne({
                where: {
                    id
                }
            }).then(updetedAgri => {
                if (updetedAgri) {
                    updetedAgri.update(
                        {
                            nom,
                            prenom,
                            postnom,  
                            email,
                            phone,
                            genre,
                            membrecooperative
                        }
                    ).then(finalUpdt => {
                        if (finalUpdt) {
                            return Response(res, 200, finalUpdt);
                        }
                    })
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                console.log(" Une erreur => ", err);
                return Response(res, 500, err)
            })
        } catch (error) {
            console.log(" Une erreur => ", error);
            return Response(res, 500, error)
        }
    },
};
module.exports = {
    AgriculteurController
}