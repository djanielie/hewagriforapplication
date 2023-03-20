const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const { now } = require('../helpers/helper.moment.js');

const Agronomes = Configs.define('__tbl_agronomes', {
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
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    adresse: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
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
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: now()
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    Agronomes
}
