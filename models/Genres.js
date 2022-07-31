const Sequelize = require("sequelize");
const databaseManager = require("../databaseManager");
const Genres = databaseManager.define("genres", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    imageURL: Sequelize.STRING
});
module.exports = Genres;