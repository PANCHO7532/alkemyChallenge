const crypto = require("crypto");
const Characters = require("../models/Characters");
const Users = require("../models/Users");
const Movies = require("../models/Movies");
const Genres = require("../models/Genres");
async function verifyToken(clientToken) {
    const credentials = Buffer.from(clientToken.split(".")[0], "base64").toString().split(":");
    const user = await Users.findOne({
        where: {
            userName: credentials[0]
        }
    });
    if(!user) { return false; }
    if((parseInt(credentials[2]) + (parseInt(process.env.TOKEN_EXPIRATION) || 3600000)) < Date.now()) { return false; }
    const hashedPassword = crypto.createHash("sha512").update(`${user.userName}:${user.password}`).digest("base64");
    if(hashedPassword != clientToken.split(".")[1]) { return false; }
    return true;
}
async function validate(req, res) {
    if(!req.headers.authorization || req.headers.authorization.length < 1) { await res.json({error: "You must provide your token via Authorization: Bearer header!"}); return false; }
    const clientToken = req.headers.authorization.split(" ")[1];
    if(!await verifyToken(clientToken)) { await res.json({ error: "Invalid token!" }); return false; }
    return true;
}
exports.getMovies = async(req, res, next) => {
    if(req.query.name) { await res.json(await Movies.findAll({ where: { title: req.query.name }})); return; }
    if(req.query.order) { await res.json(await Movies.findAll({ order: [["creationDate", (req.query.order == "ASC" || req.query.order == "DESC") ? req.query.order: "DESC"]]})); return; }
    if(req.query.genre) {
        await res.json(await Movies.findAll({
            include: {
                model: Genres,
                through: { attributes: [] },
                where: {
                    id: req.query.genre
                }
            }
        }));
        return;
    }
    /* default */
    await res.json(await Movies.findAll({ attributes: ["title", "imageURL", "creationDate"] }));
    return;
}
exports.detailMovie = async(req, res, next) => {
    if(!await validate(req, res)) { return; }
    const existingMovie = await Movies.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Characters,
            through: { attributes: [] }
        }
    });
    if(!existingMovie) { await res.json({error: "Couldn't find movie!"}); return; }
    res.json(existingMovie);
    return;
}
exports.createMovie = async(req, res, next) => {
    if(!await validate(req, res)) { return; }
    const { title, imageURL, creationDate, rate } = req.body;
    const newMovie = await Movies.create({
        title, imageURL, creationDate, rate
    });
    if(!newMovie) { await res.json({error: "Couldn't create new movie"}); }
    await res.json(newMovie);
    return;
}
exports.updateMovie = async(req, res, next) => {
    const existingMovie = await Movies.findOne({
        where: {
            id: req.query.id
        }
    });
    if(!existingMovie) { await res.json({error: "Couldn't find movie!"}); return; }
    const {title, imageURL, creationDate, rate} = req.body;
    title ? existingMovie.title = title : null;
    imageURL ? existingMovie.imageURL = imageURL : null;
    creationDate ? existingMovie.creationDate = creationDate : null;
    rate ? existingMovie.rate = rate : null;
    const result = await existingMovie.save();
    if(!result) { await res.json({error: "Something went wrong!"}); return; }
    await res.json(existingMovie);
    return;
}
exports.deleteMovie = async(req, res, next) => {
    if(!await validate(req, res)) { return; }
    const existingMovie = await Movies.findOne({
        where: {
            id: req.query.id
        }
    });
    if(!existingMovie) { await res.json({error: "Couldn't find movie!"}); return; }
    await Movies.destroy({ where: { id: req.query.id } });
    await res.json({status: "ok"});
    return;
}