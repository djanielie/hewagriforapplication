const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const Pendingpaiements = Configs.define('__tbl_pendingpaiaments', {
    reference: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    ispending:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    currency:{
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "USD"
    },
    createdon: {
        type: Sequelize.STRING,
        allowNull: false,
        // [sequelize. fn(‘date_format’, sequelize.col(‘date_col’), ‘%Y-%m-%d’), ‘date_col_formed’]
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
    Pendingpaiements
}
