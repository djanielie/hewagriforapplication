const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const { now } = require('../helpers/helper.moment.js');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const Agriculteurs = Configs.define('__tbl_agriculteurs', {
    ref: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: uuidv4()
    },
    nom: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isfake: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    postnom: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    prenom: {
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
        allowNull: true
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_de_daissance: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '1900-12-12',
        defaultValue: process.env.APPESCAPESTRING
    },
    membrecooperative: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    idambassadeur: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
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
    Agriculteurs
}
