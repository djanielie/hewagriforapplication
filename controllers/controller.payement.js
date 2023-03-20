// const { config } = require("dotenv");
// const { Response } = require("../helpers/helper.message");
// const { _Globals } = require("../models/model.configurations");

const axios = require("axios");
const dotenv = require("dotenv");
const { onAuthentification } = require("../services/service.paiement");

dotenv.config();

const PayementController =  {
    liste: async (req, res) => {
        const config = await _Globals.findOne({
            order: [
                ['id', 'DESC'],
            ],
            where: {
                id: 1,
            }
        })
        onAuthentification({
            card: config && config.n_card,
            password: config && config.n_password,
        }, (err, done) => {
            if (done) {
                axios({
                    method: "POST",
                    url: `${process.env.APPBASEURLFORPAYEMENT}/transaction/history`,
                })
            }   
        })
    }
};

module.exports = {
    PayementController
}