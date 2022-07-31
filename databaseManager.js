const Sequelize = require("sequelize");
const {mysqlHost, mysqlPort, mysqlUsername, mysqlPassword, mysqlDatabaseName} = require(`${__dirname}/config/config.inc.json`);
const sequelizeInstance = new Sequelize(process.env.DB_NAME || mysqlDatabaseName, process.env.DB_USER || mysqlUsername, process.env.DB_PASS || mysqlPassword, {
    host: process.env.DB_HOST || mysqlHost,
    port: process.env.DB_PORT || mysqlPort,
    dialect: "mysql",
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
module.exports = sequelizeInstance;