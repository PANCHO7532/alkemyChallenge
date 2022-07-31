const crypto = require("crypto");
const Characters = require("../models/Characters");
const Users = require("../models/Users");
const Movies = require("../models/Movies");
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
exports.getCharacters = async(req, res, next) => {
    if(req.query.name) { await res.json(await Characters.findAll({ where: { name: req.query.name }})); return; }
    if(req.query.weight) { await res.json(await Characters.findAll({ where: { weight: req.query.weight }})); return; }
    if(req.query.age) { await res.json(await Characters.findAll({ where: { age: req.query.age }})); return; }
    if(req.query.movies) {
        await res.json(await Characters.findAll({
            include: {
                model: Movies,
                through: { attributes: [] },
                where: {
                    id: req.query.movies
                }
            }
        }));
        return;
    }
    await res.json(await Characters.findAll({ attributes: ["name", "imageURL"] }));
    return;
}
exports.detailCharacter = async(req, res, next) => {
    if(!await validate(req, res)) { return; }
    const existingCharacter = await Characters.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Movies,
            through: { attributes: [] }
        }
    });
    if(!existingCharacter) { await res.json({error: "Couldn't find character!"}); return; }
    res.json(existingCharacter);
    return;
}
exports.createCharacter = async(req, res, next) => {
    // Create character
    if(!await validate(req, res)) { return; }
    const { name, age, weight, biography, imageURL } = req.body;
    const newCharacter = await Characters.create({
        name, age, weight, biography, imageURL
    });
    if(!newCharacter) { await res.json({error: "Couldn't create new character"}); }
    await res.json(newCharacter);
    return;
}
exports.updateCharacter = async(req, res, next) => {
    // Update character
    if(!await validate(req, res)) { return; }
    const existingCharacter = await Characters.findOne({
        where: {
            id: req.query.id
        }
    });
    if(!existingCharacter) { await res.json({error: "Couldn't find character!"}); return; }
    const {name, age, weight, biography, imageURL} = req.body;
    name ? existingCharacter.name = name : null;
    age ? existingCharacter.age = age : null;
    weight ? existingCharacter.weight = weight : null;
    biography ? existingCharacter.biography = biography : null;
    imageURL ? existingCharacter.imageURL = imageURL : null;
    const result = await existingCharacter.save();
    if(!result) { await res.json({error: "Something went wrong!"}); return; }
    await res.json(existingCharacter);
    return;
}
exports.deleteCharacter = async(req, res, next) => {
    // Delete character
    if(!await validate(req, res)) { return; }
    const existingCharacter = await Characters.findOne({
        where: {
            id: req.query.id
        }
    });
    if(!existingCharacter) { await res.json({error: "Couldn't find character!"}); return; }
    await Characters.destroy({ where: { id: req.query.id } });
    await res.json({status: "ok"});
    return;
}