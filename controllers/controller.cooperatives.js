const { phoneValidator } = require("../helpers/helper.datavalidator");
const { fillphone } = require("../helpers/helper.fillphone");
const { Response } = require("../helpers/helper.message")
const { Cooperatives } = require("../models/model.cooperatives")

const CooperativesController = {

    addcooperative: async (req, res, next) => {
        const { cooperative, phone, email } = req.body;
        if(!cooperative || !phone ) return Response(res, 401, "this request must have at least !cooperative || !phone");
        if(phoneValidator({ phone, res }))
        try {
            await Cooperatives.create({
                cooperative,
                phone: fillphone({ phone }),
                email: email && email.toLowerCase()
            })
            .then(coop => {
                if(coop instanceof Cooperatives) return Response(res, 200, coop)
                else return Response(res, 400, coop)
            })
            .catch(err => {
                return Response(res, 503, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    liste: async(req, res, next) => {
        try {
            Cooperatives.findAndCountAll({
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

    deleteCooprtv: async (req, res) => {
        try{
            await Cooperatives.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteCoop => {
                if (deleteCoop) {
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

    updateCooprtv: async (req, res) => {
        const { cooperative, phone } = req.body;
        try{
            await Cooperatives.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateCoop => {
                if (updateCoop) {
                    updateCoop.update({
                        cooperative,
                        phone,
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

    getcoopbyid: async(req, res, next) => {
        const { id } = req.params;
        try {
            Cooperatives.findOne({
                where: {
                    id,
                    status: 1
                }
            })
            .then((coop) => {
                if(coop instanceof Cooperatives) return Response(res, 200, coop);
                else return Response(res, 400, {})
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
    CooperativesController
}