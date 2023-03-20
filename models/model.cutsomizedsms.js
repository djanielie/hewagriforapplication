const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require("../helpers/helper.moment");

dotenv.config();

const CustomizedSMS = Configs.define('__tbl_customizedsms', {
    idlangue: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    case: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    content: {
        type: Sequelize.TEXT,
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
    CustomizedSMS
}
