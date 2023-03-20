const Sequelize = require('sequelize');
const { Configs } = require('../configs/configs.js');
const dotenv = require("dotenv");
const { now } = require('../helpers/helper.moment.js');

dotenv.config()

const ListeOfJobs = Configs.define('__tbl_jobslistes', {
    jobname: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: process.env.APPESCAPESTRING
    },
    hour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    start: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    end: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    secondes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: process.env.APPESCAPESTRING
    },
    jobdescription: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    updatedon: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    createdon: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
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
    ListeOfJobs
}
