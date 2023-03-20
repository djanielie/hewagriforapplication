const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const TypeSouscriptions = Configs.define('__tbl_typesouscriptions', {
    type: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    prix: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    echeanche: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    nombresms: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 30
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
    TypeSouscriptions
}
