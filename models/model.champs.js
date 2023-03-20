const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const { now } = require('../helpers/helper.moment.js');
const dotenv = require("dotenv");

dotenv.config()

const Champs = Configs.define('__tbl_champs', {
    champs: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    idagriculteurs: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idambassadeur: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dimensions: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    latitude: {
        type: Sequelize.STRING,
        allowNull: true
    },
    longitude: {
        type: Sequelize.STRING,
        allowNull: true
    },
    altitude: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    idzoneproduction: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    idculture: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    createdon: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: now({ options: {} })
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    Champs
}
