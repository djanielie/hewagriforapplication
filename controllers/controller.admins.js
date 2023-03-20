const { emailValidator, phoneValidator, passwordValidator, nameValidator } = require("../helpers/helper.datavalidator.js");
const { fillphone } = require("../helpers/helper.fillphone.js");
const { Response } = require("../helpers/helper.message.js");
const { comparePWD, hashPWD } = require("../helpers/helper.password.js");
const { Admins } = require("../models/model.admins.js");
const { signinCookies } = require("../middlewares/ware.cookies.js");
const { sendMail, onSendMail } = require("../services/service.mail.js");

const AdminsController = {
    // function executed whene Admin :::::  login
    signin: async (req, res, next) => {
        const { email, password } = req.body;
        if(!email || !password) return Response(res, 401, "This request must have at least !email || !password")
        try {
            Admins.findOne({
                where: {
                    email,
                    status: 1
                }
            })
            .then(admin => {
                if(admin instanceof Admins){
                    comparePWD({ plaintext: password, hashedtext: admin && admin['password'] }, (notmatch, matched) => {
                        if(matched){
                            // signinCookies(req, res, next);
                            return Response(res, 200, admin);
                        }else return Response(res, 203, "Password or email is incorrect !");
                    })
                }else{
                    return Response(res, 203, "Password or email is incorrect !");
                }
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    // Function executed whene Admin is taking inscription
    signup: async (req, res, next) => {
        const { email, password, phone, nom, postnom, prenom } = req.body;
        if(!email || !password || !phone || !nom || !postnom) return Response(res, 401, "This request must have at least !email || !password || !phone || !nom || !postnom || !level");
        try {
            if(
                emailValidator({ emal: email, res }) &&
                phoneValidator({ phone, res }) &&
                passwordValidator({ chaine: password, res }) &&
                nameValidator({ name: nom, res }) &&
                nameValidator({ name: postnom, res })
            ){
                const pwd = await hashPWD({ plaintext: password });
                await Admins.create({
                    phone: fillphone({ phone }),
                    email: email.toLowerCase(),
                    nom: nom.toLowerCase(),
                    postnom: postnom.toLowerCase(),
                    prenom: prenom && prenom.toLowerCase(),
                    password: pwd,
                    // level: level,
                })
                .then(admin => {
                    if(admin instanceof Admins){
                        onSendMail({
                            content: `Bonjour ${admin && admin['nom']} ${admin && admin['postnom']} un compte admin chez ${process.env.APPNAME} a ete cree avec vos identifiants. Bienvenu chez ${APPCOMPANYNAME}`,
                            to: admin && admin['email']
                        }, (er, dn) => {

                        })
                        return Response(res, 200, admin);
                    } else return Response(res, 400, admin)
                })
                .catch(error => {
                    return Response(res, 503, error);
                })
            }
        } catch (error) {
            console.log(" Error is => ", error);
            return Response(res, 500, error);
        }
    },
    // Function executed whene Trying to get Admins Liste
    listeactifs: async (req, res, next) => {
        try {
            Admins.findAll({
                where: {
                    status: 1
                }
            })
            .then(admins => {
                return Response(res, 200, admins)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    // Function executed whene Trying to get Admins Liste
    listeinactifs: async (req, res, next) => {
        try {
            Admins.findAll({
                where: {
                    status: 0
                }
            })
            .then(admins => {
                return Response(res, 200, admins)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    // function executed whene Trying to get all admins
    listeall: async () => {
        try {
            Admins.findAll({

            })
            .then(admins => {
                return Response(res, 200, admins)
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
    AdminsController
}