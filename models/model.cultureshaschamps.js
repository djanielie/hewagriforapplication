const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');
const { v4: uuidv4 } = require('uuid');

dotenv.config()

const Cultureshaschamps = Configs.define('__tbl_Champs_has_Cultures', {
    //Id
    Champs_idChamps: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: uuidv4()
    },
    Cultures_idCultures : {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: now({ options: {} })
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    Cultureshaschamps
}
