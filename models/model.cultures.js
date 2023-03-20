const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');
const { v4: uuidv4 } = require('uuid');

dotenv.config()

const Cultures = Configs.define('__tbl_cultures', {
    cultures: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    ref: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: uuidv4()
    },
    createdon: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: now({ options: {} })
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
    Cultures
}
