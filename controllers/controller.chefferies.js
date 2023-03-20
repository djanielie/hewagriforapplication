const { Response } = require("../helpers/helper.message")
const { Chefferies } = require("../models/model.chefferies")
const { Territoires } = require("../models/model.territoirs")

const chefferiesController = {
    
    addChefferies: async (req, res) => {

        const { chefferie, idterritoire } = req.body;
        if (!chefferie || !idterritoire) return Response(res, 401, "The field can not be empty");

        try {
            await Chefferies.create({
                chefferie: chefferie,
                idterritoire: idterritoire,
            }).then(chfrie => {
                if (chfrie instanceof Chefferies) return Response(res, 200, chfrie)
                else return Response(res, 400, chfrie)
            }).catch(err => {
                return Response(res, 500, err)
            })
        } catch (error){
            return Response(res, 500, error)
        }
    },

    liste: async(req, res, next) => {

        try {
            Territoires.hasOne(Chefferies, { foreignKey: "idterritoire" });
            Chefferies.belongsTo(Territoires, { foreignKey: "id" })
            
            Chefferies.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Territoires,
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
    },

    deleteChefferie: async (req, res) => {
        try{
            await Chefferies.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deletechfrie => {
                if (deletechfrie) {
                    return Response(res, 200,  req.params.id)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                return Response(res, 500, err);
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },

    updateChefferie: async (req, res) => {
        const { chefferie } = req.body;
        try {
            await Chefferies.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updtchfrie => {
                if (updtchfrie) {
                    updtchfrie.update({
                        chefferie,
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
    chefferiesController
}