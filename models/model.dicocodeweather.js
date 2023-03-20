const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require("../helpers/helper.moment");
dotenv.config()

const DicoCodeWeather = Configs.define('__tbl_dicocodeweather', {
    code: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING 
    },
    main: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idlangue: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    createdon: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: now({ options: {} })
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {

    DicoCodeWeather
    
}
