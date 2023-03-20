const { Response } = require("../helpers/helper.message");
const { TypeSouscriptions } = require("../models/model.typesouscriptions");

const TypesouscritptionsController = {
    
    add: async (req, res, next) => {
        const { type, prix, frequence, nombresms } = req.body;
        if(!type || !prix || !frequence) return Response(res, 401, "This request must have at least !type || !prix || !frequence");
        try {
            await TypeSouscriptions.create({
                type,
                prix,
                echeanche: frequence
            })
            .then(t => {
                if(t instanceof TypeSouscriptions) return Response(res, 200, t);
                else return Response(res, 400, t)
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
            await TypeSouscriptions.findAndCountAll({
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

    deleteTypeScrpt: async (req, res) => {
        try {
            await TypeSouscriptions.destroy({
                where: {
                    id: req.params.id
                }
            }).then(dlttpscrp => {
                if (dlttpscrp) {
                    return Response(res, 200, req.params.id)
                } else {
                    return Response(res, 404, 'Server error, The item was not found')
                }
            }).catch(err => {
                return Response(res, 500, err);
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    updateTypeScrpt: async (req, res) => {
        const { prix, frequence, type } = req.body;
        try {
            await TypeSouscriptions.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateTprod => {
                if (updateTprod) {
                    updateTprod.update({
                        prix,
                        frequence,
                        type,
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
    TypesouscritptionsController
}