const { emailValidator, nameValidator, passwordValidator, phoneValidator, dateValidator } = require("../helpers/helper.datavalidator.js");
const { fillphone, completeCodeCountryToPhoneNumber } = require("../helpers/helper.fillphone.js");
const { Response } = require("../helpers/helper.message");
const { comparePWD, hashPWD } = require("../helpers/helper.password.js");
const { randomLongNumber } = require("../helpers/helper.random.js");
const { Ambassadeurs } = require("../models/model.ambassadeurs.js");
const { sendMail } = require("../services/service.mail.js");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const { onSendSMS } = require("../services/services.messages.js");
const { Villages } = require("../models/model.villages.js");

dotenv.config();

const AmbasadeursController = {

    signin: async (req, res, next) => {
        const { email, password } = req.body;
        if(!email || !password) return Response(res, 401, "this request must have at least !email || !password")
        try {
            Ambassadeurs.findOne({
                where: {
                    [Op.or]: [
                        { phone: fillphone({ phone: email }) },
                        { email: email.toString().toLowerCase() }
                    ]
                }
            })
            .then(amb => {
                if(amb instanceof Ambassadeurs){
                    comparePWD({ plaintext: password, hashedtext: amb && amb['password'] }, (notmatch, matched) => {
                        if(matched){
                            if(amb && parseInt(amb['isactivated']) === 1){
                                return Response(res, 200, amb);
                            }else{
                                
                                // const code = randomLongNumber({ length: 6 });
                                // sendMail({
                                //     to: email,
                                //     title: "Code de vérification",
                                //     code: amb && amb['verificationcode']
                                // }, (e, d) => {});

                                // onSendSMS({
                                //     content: `Code de vérification : #${amb && amb['verificationcode']}`,
                                //     to: completeCodeCountryToPhoneNumber({ phone: fillphone({ phone: amb && amb['phone'] }) })
                                // }, ( mErr, mDone) => {});

                                return Response(res, 402, {
                                    user: amb,
                                    code: amb && amb['verificationcode']
                                })
                            }
                        }else return Response(res, 203, "Password or email is incorrect !");
                    })
                }else return Response(res, 203, "Password or email is incorrect !");
            })
            .catch(er => {
                return Response(res, 500, er);
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    liste: async (req, res, next) => {
        try {
            Villages.hasOne(Ambassadeurs, { foreignKey: "idvillage" });
            Ambassadeurs.belongsTo(Villages, { foreignKey: "id" })

            Ambassadeurs.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Villages,
                        required: false,
                    }
                ]
            })
            .then(ambs => {
                return Response(res, 200, ambs)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    signup: async (req, res, next) => {
        const { email, phone, nom, postnom, prenom, adresse, genre, idvillage, password, datenaissance } = req.body;
        if(!email || !phone || !nom || !postnom || !genre || !datenaissance) return Response(res, 401, "Sorry this request must have at least !email || !phone || !nom || !postnom || !genre || !datenaissance");
        try {
            if(
                emailValidator({ emal: email, res })
                && dateValidator({ chaine: datenaissance, res })
                && nameValidator({ name: nom, res })
                && nameValidator({ name: postnom, res })
                && phoneValidator({ phone, res })
                // && passwordValidator({ chaine: password, res })
            ){
                const code = randomLongNumber({ length: 6 });
                const defaultpassord = randomLongNumber({ length: 6 });
                const pwd = await hashPWD({ plaintext: defaultpassord.trim() });

                await Ambassadeurs.create({
                    nom: nom.toLowerCase(),
                    postnom: postnom.toLowerCase(),
                    prenom: prenom && prenom.toLowerCase(),
                    password: pwd,
                    datenaissance: datenaissance,
                    email: email.toLowerCase(),
                    phone: fillphone({ phone }),
                    adresse: adresse && adresse,
                    genre,
                    verificationcode: code,
                    idvillage
                })
                .then(ambass => {
                    if(ambass instanceof Ambassadeurs){

                        if(ambass && ambass['email'] !== process.env.APPESCAPESTRING) sendMail({
                            to: email,
                            title: "Code de vérification",
                            code
                        }, (e, d) => {});

                        onSendSMS({
                            content: `Bonjour ${nom} ${postnom} la creation de votre compte ambassadeur a reussie. mot de passe : ${defaultpassord} et votre code de verification est : ${code}`,
                            to: completeCodeCountryToPhoneNumber({ phone: fillphone({ phone }) })
                        }, ( mErr, mDone) => {});

                        // onSendSMS({
                        //     content: `Code de vérification : #${code}`,
                        //     to: completeCodeCountryToPhoneNumber({ phone: fillphone({ phone }) })
                        // }, ( mErr, mDone) => {});

                        return Response(res, 200, {
                            user: ambass,
                            code
                        })

                    }else return Response(res, 400, ambass)
                })
                .catch(err => {
                    return Response(res, 500, err)
                })
            }
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    deleteAmbassadeur: async (req, res) => {
        try{
            await Ambassadeurs.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(deletedAmb => {
                if (deletedAmb) {
                    return Response(res, 200, req.params.id)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            })
            .catch(err => {
                console.log(err);
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    updateAmbassadorPasswordThenSendItOnMessage: async (req, res, next) => {
        const { idambassadeur } = req.params;
        if(!idambassadeur) return Response(res, 401, "this request must have at least !idambassadeur")
        try {
            const newpassword = randomLongNumber({ length: 6 });
            const pwd = await hashPWD({ plaintext: newpassword.trim() })
            await Ambassadeurs.findOne(
                {
                    where: {
                        id: idambassadeur
                    }
                }
            )
            .then(U => {
                if(U instanceof Ambassadeurs){
                    U.update({
                        password: pwd
                    })
                    .then(A => {
                        onSendSMS({
                            content: `Votre mot de passe a ete mis a jour avec succes; votre nouveau mot de passe est ${newpassword}`,
                            to: completeCodeCountryToPhoneNumber({ phone: U && U['phone'] })
                        })
                        return Response(res, 200, U)
                    })
                    .catch(err => {
                        return Response(res, 400, "Une erreur lors de la mis à jour vient de se produire !")
                    })
                }else return Response(res, 404, "Ambassador not found !")
            })
            .catch(er => {
                return Response(res, 503, er)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    updateAmbassadorPassword: async (req, res, next) => {
        const { idambassadeur, newpassword } = req.body;
        if(!idambassadeur || !newpassword) return Response(res, 401, "this request must have at least !idambassadeur || !newpassword")
        try {
            const pwd = await hashPWD({ plaintext: newpassword.trim() })
            await Ambassadeurs.findOne({
                where: {
                    id: idambassadeur,
                    status: 1
                }
            })
            .then(amb => {
                if(amb instanceof Ambassadeurs){
                    amb.update({
                        password: pwd
                    })
                    .then(U => {
                        onSendSMS({
                            content: `Votre mot de passe a ete mis a jour avec succes; votre nouveau mot de passe est ${newpassword}`,
                            to: completeCodeCountryToPhoneNumber({ phone: amb && amb['phone'] })
                        })
                        return Response(res, 200, U)
                    })
                    .catch(E => {
                        return Response(res, 500, E)
                    })

                }else{
                    return Response(res, 503, " Error  ")
                }
            })
            .catch(er => {
                return Response(res, 503, er)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    
    updateAmbassadeur: async (req, res) => {
        const { nom, postnom, prenom, email, phone, genre, datenaissance, adresse, idvillage } = req.body;
        const { id } = req.params;
        if (!id) return Response(res, 401, "This request must have at least id in req params")
        
        try{
            await Ambassadeurs.findOne({
                where: {
                    id
                }
            })
            .then(updetedAmb => {
                if (updetedAmb instanceof Ambassadeurs) {
                    updetedAmb.update({
                        datenaissance: datenaissance ? datenaissance : updetedAmb.datenaissance,
                        adresse: adresse ? adresse : updetedAmb.adresse,
                        idvillage: idvillage ? idvillage : updetedAmb.idvillage,
                        nom: nom ? nom : updetedAmb.nom,
                        prenom: prenom ? prenom : updetedAmb.prenom,
                        postnom: postnom ? postnom : updetedAmb.postnom,  
                        email: email ? email : updetedAmb.email,
                        phone: phone ? fillphone({ phone }) : updetedAmb.phone,
                        genre: genre ? genre : updetedAmb.genre
                    })
                    return Response(res, 200, updetedAmb)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    updatPassword: async (req, res, next) => {
        const { password, id, phone } = req.body;
        if(!password || !id || !phone) return Response(res, 401, "This request must have at least password or id of ambassador !");
        try {
            const pwd = await hashPWD({ plaintext: defaultpassord.trim() });
            await Ambassadeurs.findOne({
                where: {
                    phone: fillphone({ phone })
                }
            })
            .then(amb => {
                if(amb instanceof Ambassadeurs){

                }else return Response(res, 404, " we can not find ressource over here sorry !")
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    getambassadeurbyphoneoremail: async (req, res, next) => {
        const { email } = req.body;
        if(!email) return Response(res, 401, "This request must have at least email as parameter !");
        try {
            Ambassadeurs.findOne({
                where: {
                    [Op.or]: [
                        { phone: fillphone({ phone: email }) },
                        { email: email.toString().toLowerCase() }
                    ]
                }
            })
            .then(ambs => {
                if(ambs instanceof Ambassadeurs){
                    return Response(res, 200, ambs)
                }else{
                    return Response(res, 400, ambs )
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    resendverificationcode: async (req, res, next) => {
        const { email } = req.body;
        if(!email) return Response(res, 401, "This request must have at least email as parameter !");
        try {
            const code = randomLongNumber({ length: 6 });
            Ambassadeurs.findOne({
                where: {
                    [Op.or]: [
                        { phone: fillphone({ phone: email }) },
                        { email: email.toString().toLowerCase() }
                    ]
                }
            })
            .then(ambs => {
                if(ambs instanceof Ambassadeurs){

                    onSendSMS({
                        content: `Code de verification : ${code}`,
                        to: completeCodeCountryToPhoneNumber({ phone: fillphone({ phone: ambs && ambs['phone'] }) })
                    }, ( mErr, mDone) => {})

                    if(ambs && ambs['email'] !== process.env.APPESCAPESTRING) sendMail({
                        to: ambs && ambs['email'],
                        code,
                        title: "Code de vérification"
                    }, (er, done) => {})

                    return Response(res, 200, {
                        user: ambs,
                        code
                    })
                    
                }else{
                    return Response(res, 400, ambs )
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    
    switchaccount: async (req, res, next) => {
        const { email, switcher } = req.body;
        if(!email || !switcher) return Response(res, 401, "This request must have at least email and switcher as parameters !");
        if(switcher.toUpperCase() === "ON" || switcher.toUpperCase() === "OFF");
        else return Response(res, 401, "The parameter switcher has ivalide value this last must tobe 'ON' or 'OFF'");

        console.log(" Body is => ", req.body);

        Ambassadeurs.findOne({
            where: {
                [Op.or]: [
                    { phone: fillphone({ phone: email }) },
                    { email: email.toString().toLowerCase() }
                ]
            }
        })
        .then(ambs => {
            if(ambs instanceof Ambassadeurs){
                ambs.update({
                    isactivated: switcher.toUpperCase() === "ON" ? 1 : 0
                })
                .then(_ => {
                    const message = switcher.toUpperCase() === "ON"
                    ? `Bonjour ${ambs && ambs['nom']} ${ambs && ambs['postnom']} \n Nous sommes heureux de vous annoncer que votre compte  ${process.env.APPNAME} chez ${process.env.APPCOMPANYNAME} vient d'etre reactive avec succes ` 
                    : `Bonjour ${ambs && ambs['nom']} ${ambs && ambs['postnom']} \n Nous sommes desole de vous annoncer que votre compte  ${process.env.APPNAME} chez ${process.env.APPCOMPANYNAME} vient d'etre desactive s'il s'agit d'une erreur veuillez contacter notre service commerciale `;

                    onSendSMS({
                        content: message,
                        to: completeCodeCountryToPhoneNumber({ phone: fillphone({ phone: ambs && ambs['phone'] }) })
                    }, ( mErr, mDone) => {})

                    if(ambs && ambs['email'] !== process.env.APPESCAPESTRING) sendMail({
                        to: ambs && ambs['email'],
                        body: message,
                        title: "Modification de l'état du compte"
                    }, (er, done) => {
    
                    });
                    
                })
                .catch(_e => {});

                return Response(res, 200, ambs)
            }else{
                return Response(res, 400, ambs)
            }
        })
    }
}
module.exports = {
    AmbasadeursController
}