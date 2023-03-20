const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Weather = Configs.define('__tbl_weather', {
    latitude: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    longitude: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    timezone_offset: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    current: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    tomorrow: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    hourly: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    daily: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    Weather
}
