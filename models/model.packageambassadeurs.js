const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const PackagesAmbassadeurs = Configs.define('__tbl_packages_to_ambass', {
    package: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    idambassadeur: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    updatedon: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: now({ options: {} })
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
    PackagesAmbassadeurs
}