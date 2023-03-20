const e = require("express");
const { convertStringIntoArray } = require("../helpers/helper.datavalidator");
const { Response } = require("../helpers/helper.message")
const { Cultureshaschamps } = require("../models/model.cultureshaschamps")

const CultureshaschampsController = {

    liste: async (req, res, next) => {

        try {
            await Cultureshaschamps.findAndCountAll({
                order: [
                    ['id', 'DESC'],
                ],
                // where: {
                //     status: 1
                // }
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
}

module.exports = {
    CultureshaschampsController
}