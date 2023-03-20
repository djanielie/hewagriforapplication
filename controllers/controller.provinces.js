const { Response } = require("../helpers/helper.message");
const { Provinces } = require("../models/model.provinces");

const ProvincesController = {
    
    liste: async (req, res, next) => {
        try {
            await Provinces.findAndCountAll({
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
};

module.exports = {
    ProvincesController
}