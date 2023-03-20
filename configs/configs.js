const Sequelize = require("sequelize");
const dotenv = require('dotenv');

dotenv.config();

const Configs = new Sequelize(
    process.env.APPDBNAME,
    process.env.APPDBUSERNAME,
    process.env.APPDBPASSWORD
    ,{
        port: process.env.APPDBPORT,
        host: process.env.APPDBHOST,
        dialect: process.env.APPDBDIALECT || "mysql"
    }
);

const redisConfigs = {

};

module.exports = {
    Configs,
    redisConfigs
};

