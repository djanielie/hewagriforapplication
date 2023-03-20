const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require('dotenv');
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Admins = Configs.define('__tbl_admins', {
    nom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    postnom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    prenom: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    level: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'normal',
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    Admins
}
