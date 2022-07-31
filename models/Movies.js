const Sequelize = require("sequelize");
const databaseManager = require("../databaseManager");
const Movies = databaseManager.define("movies", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequelize.STRING,
    imageURL: Sequelize.STRING,
    creationDate: Sequelize.DATE,
    rate: Sequelize.INTEGER
});
module.exports = Movies;