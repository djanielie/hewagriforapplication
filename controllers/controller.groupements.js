const { Response } = require("../helpers/helper.message")
const { Groupements } = require("../models/model.groupements")
const { Chefferies } = require("../models/model.chefferies")

const groupementController = {

    addGroupements: async (req, res) => {

        const { groupement, idchefferie } = req.body;
        if (!groupement || !idchefferie) return Response(res, 401, "The field can not be empty");
        try {
            await Groupements.create({
                groupement: groupement,
                idchefferie: idchefferie,
            }).then(grpment => {
                if (grpment instanceof Groupements) return Response(res, 200, grpment)
                else return Response(res, 400, grpment)
            }).catch(err => {
                return Response(res, 500, err)
            })
        } catch (error){
            return Response(res, 500, error)
        }
    },

    liste: async (req, res, next) => {
        try {
            Chefferies.hasOne(Groupements, { foreignKey: "idchefferie" });
            Groupements.belongsTo(Chefferies, { foreignKey: "id" }) // or idterritoire
            
            Groupements.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Chefferies,
                        required: false
                    }
                ]
            })
            .then(({ rows, count }) => {
                return Response(res, 200, { liste: rows, length: count })
            })
            .catch(err => {
                console.log('====================================');
                console.log(err);
                console.log('====================================');
                return Response(res, 500, err)
            })
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            return Response(res, 500, error)
        }
    },

    deleteGroupement: async (req, res) => {
        try{
            await Groupements.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deletegrpmnt => {
                if (deletegrpmnt) {
                    return Response(res, 200, req.params.id)
                }else{
                    return Response(res, 404, 'Server error, The item was not found' )
                }
            }).catch(err => {
                return Response(res, 500, err);
            })
        } catch (error) {
            return Response(res, 500, error);
        }
    },
    updateGroupements: async (req, res) => {
        const { groupement, idchefferie } = req.body;
        try {
            await Groupements.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updtgrpment => {
                if (updtgrpment instanceof Groupements) {
                    updtgrpment.update({
                        groupement,
                        idchefferie,
                    }
                    ).then(finalUpdt => {
                        if (finalUpdt) {
                            return Response(res, 200, updtgrpment);
                        }
                    })
                } else {
                    return Response(res, 404, 'Server error, The item was not found')
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
    groupementController
}