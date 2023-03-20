const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Partenaires = Configs.define('__tbl_partenaires', {
    raisonsocial: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    adresse: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
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
    Partenaires
}
