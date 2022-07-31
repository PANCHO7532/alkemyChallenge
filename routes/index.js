const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const characterController = require("../controllers/characterController");
const movieController = require("../controllers/movieController");
module.exports = function() {
    // Character operations/management
    router.get("/characters", characterController.getCharacters);
    router.get("/characters/:id", characterController.detailCharacter);
    
    router.get("/characters?:name", characterController.getCharacters);
    router.get("/characters?:weight", characterController.getCharacters);
    router.get("/characters?:age", characterController.getCharacters);
    router.get("/characters?:movies", characterController.getCharacters);
    
    router.post("/characters", characterController.createCharacter);
    router.patch("/characters?:id", characterController.updateCharacter);
    router.delete("/characters?:id", characterController.deleteCharacter);
    // Movie operations/management
    router.get("/movies", movieController.getMovies);
    router.get("/movies/:id", movieController.detailMovie);
    router.get("/movies?:name", movieController.getMovies);
    router.get("/movies?:genre", movieController.getMovies);
    router.get("/movies?:order", movieController.getMovies);

    router.post("/movies", movieController.createMovie);
    router.patch("/movies?:id", movieController.updateMovie);
    router.delete("/movies?:id", movieController.deleteMovie);
    // Authorization endpoints
    router.post("/auth/login", authController.login);
    router.post("/auth/register", authController.register);
    return router;
}
