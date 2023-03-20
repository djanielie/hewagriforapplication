const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Langues = Configs.define('__tbl_langues', {
    langue: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    shortname: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
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
    Langues
}
