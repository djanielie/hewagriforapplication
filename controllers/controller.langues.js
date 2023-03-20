const { nameValidator } = require("../helpers/helper.datavalidator");
const { Response } = require("../helpers/helper.message");
const { Langues } = require("../models/model.langues");

const LanguageController = {
    add: async (req, res, next) => {
        const { langue, shortname } = req.body;
        if(!langue || !shortname) return Response(res, 401, "This request must have at least !langue || !shortname in body");
        // if( nameValidator({ name: langue, res }))
        try {
            await Langues.create({
                langue,
                shortname
            })
            .then(langue => {
                if(langue instanceof Langues) return Response(res, 200, langue)
                else return Response(res, 400, langue)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    liste: async(req, res, next) => {
        try {
            await Langues.findAndCountAll({
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
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    deleteLngue: async (req, res) => {
        try{
            await Langues.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteLgue => {
                if (deleteLgue) {
                    return Response(res, 200, req.params.id)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                return Response(res, 500, err) 
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },

    updateLngue: async (req, res) => {
        const { langue, shortname } = req.body;
        try{
            await Langues.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateLgue => {
                if (updateLgue) {
                    updateLgue.update({
                        langue,
                        shortname
                    }
                    ).then(finalUpdt => {
                        if (finalUpdt) {
                            return Response(res, 200, finalUpdt);
                        }
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
    LanguageController
}