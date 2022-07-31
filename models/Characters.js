const Sequelize = require("sequelize");
const databaseManager = require("../databaseManager");
const Genres = require("./Genres");
const Movies = require("./Movies");
const Characters = databaseManager.define("characters", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    weight: Sequelize.INTEGER,
    biography: Sequelize.STRING,
    imageURL: Sequelize.STRING
});
Characters.belongsToMany(Movies, {
    through: "movieCharacters"
});
Movies.belongsToMany(Characters, {
    through: "movieCharacters"
});
Movies.belongsToMany(Genres, {
    through: "movieGenres"
});
Genres.belongsToMany(Movies, {
    through: "movieGenres"
})
module.exports = Characters;