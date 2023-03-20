const { Response } = require("../helpers/helper.message");
const { TypeSouscriptions } = require("../models/model.typesouscriptions");
const { Zoneproductions } = require("../models/model.zoneproductiopns");
const { Villages } = require("../models/model.villages");
const { Groupements } = require("../models/model.groupements");

const ZoneproductionsController = {

    addwithcoords: async (req, res, next) => {
        const { zone, idvillage, idprovince, idterritoite, coords } = req.body;
        if(!zone || !idvillage || !idprovince || !idterritoite ) return Response(res, 401, "This request must have at least !zone || !idvillage ");
        try {
            await Zoneproductions.create({
                zoneproduction: zone,
                idvillage
            })
            .then(t => {
                if(t instanceof Zoneproductions) return Response(res, 200, t);
                else return Response(res, 400, t)
            })
            .catch(err => {
                return Response(res, 500, err)
            })
        } catch (error) {
            return Response(res, 500, error)
        }
    },
    add: async (req, res, next) => {
        const { zoneproduction, idvillage } = req.body;
        if(!zoneproduction || !idvillage ) return Response(res, 401, "This request must have at least !zoneproduction || !idvillage ");
        try {
            await Zoneproductions.create({
                zoneproduction,
                idvillage
            })
            .then(t => {
                if(t instanceof Zoneproductions) return Response(res, 200, t);
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

            Villages.hasOne(Zoneproductions, { foreignKey: "id" });
            Zoneproductions.belongsTo(Villages, { foreignKey: "idvillage" });

            await Zoneproductions.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    status: 1
                },
                include: [
                    {
                        model: Villages,
                        required: true, //False return an empty table, True return only table that match. 
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

    deleteZnprod: async (req, res) => {
        try{
            await Zoneproductions.destroy({
                where: {
                    id: req.params.id
                }
            }).then(deleteZn => {
                if (deleteZn) {
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

    updateZnprod: async (req, res) => {
        const { zoneproduction, idvillage } = req.body;
        try{
            await Zoneproductions.findOne({
                where: {
                    id: req.params.id
                }
            }).then(updateZn => {
                if (updateZn) {
                    updateZn.update({
                        zoneproduction,
                        idvillage,
                    }
                    ).then(finalUpdt => {
                        if (finalUpdt){
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
};

module.exports = {
    ZoneproductionsController
}