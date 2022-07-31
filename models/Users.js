const Sequelize = require("sequelize");
const databaseManager = require("../databaseManager");
const Users = databaseManager.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: Sequelize.STRING,
    userName: Sequelize.STRING,
    password: Sequelize.STRING
});
module.exports = Users;