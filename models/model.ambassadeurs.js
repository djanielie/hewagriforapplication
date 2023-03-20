const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const { now } = require('../helpers/helper.moment.js');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const Ambassadeurs = Configs.define('__tbl_ambassadeurs', {
    nom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ref: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: uuidv4()
    },
    verificationcode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    postnom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    prenom: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    datenaissance: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    adresse: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idvillage: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    isactivated: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    createdon: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: now({ options : {}})
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    Ambassadeurs
}
