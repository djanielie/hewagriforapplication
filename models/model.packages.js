const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Packages = Configs.define('__tbl_packages', {
    package: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    valuepackage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    unity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    updatedon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: now({ options: {} })
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
    Packages
}
