const e = require("express");
const { convertStringIntoArray } = require("../helpers/helper.datavalidator");
const { Response } = require("../helpers/helper.message")
const { Cultures } = require("../models/model.cultures")
const { Champs } = require("../models/model.champs")

const CulturesController = {

    add: async (req, res, next) => {
        const { cultures } = req.body;
        if(!cultures) return Response(res, 401, "this request must have at least !cultures as parametter in body");
        try {
            await Cultures.create({
                cultures
            })
            .then(clt => {
                if(clt instanceof Cultures) return Response(res, 200, clt)
                else return Response(res, 400, clt)
            })
            .catch(er => {
                return Response(res, 503, er)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    
    listebyid: async(req, res, next) => {
        const { ids } = req.body;
        if(!ids) return Response(res, 401, `This request must have at least ids: "[1, 3, 6]"`);
        const ids_ = convertStringIntoArray({ chaine: ids });
        try {
            await Cultures.findAndCountAll({
                where: {
                    id: ids_,
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

    liste: async(req, res, next) => {
        try {
            await Cultures.findAndCountAll({
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

    listebyid: async(req, res, next) => {
        const { ids } = req.body;
        if(!ids) return Response(res, 401, `This request must have at least ids: "[1, 3, 6]"`);
        const ids_ = convertStringIntoArray({ chaine: ids });
        try {
            await Cultures.findAndCountAll({
                where: {
                    id: ids_,
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

    deleteClture: async (req, res) => {
        try{
            await Cultures.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteCltr => {
                if (deleteCltr) {
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

    updateClture: async (req, res) => {
        const { cultures } = req.body;
        try{
            await Cultures.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateClture => {
                if (updateClture) {
                    updateClture.update({
                        cultures,
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
            return Response(res, 500, error)
        }
    },
}

module.exports = {
    CulturesController
}