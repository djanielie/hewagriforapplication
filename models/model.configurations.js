const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');
const { v4: uuidv4 } = require('uuid');

dotenv.config()

const _Globals = Configs.define('__tbl_configurations', {
    n_card: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    n_password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: uuidv4()
    },
    n_phone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    _Globals
}
