const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Zoneproductions = Configs.define('__tbl_zoneproductions', {
    zoneproduction: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    idvillage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    createdon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: now({ options: {} })
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    Zoneproductions
}
