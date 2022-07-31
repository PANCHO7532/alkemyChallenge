const crypto = require("crypto");
const UserDB = require("../models/Users");
const mailAgent = require("../mailAgent");
const { emailAddress, enableEmailServices } = require("../config/config.inc.json");
exports.login = async(req, res, next) => {
    const userCheck = await UserDB.findOne({
        where: {
            userName: req.body.userName
        }
    });
    if(!req.body.userName) { await res.json({ error: "You need to specify an userName field!" }); return; }
    if(!req.body.password) { await res.json({ error: "You need to specify an password field!" }); return; }
    if(!userCheck) { await res.json({error: "User/password incorrect"}); }
    if(userCheck.password == null) { await res.json({error: "User/password incorrect"}); }
    const hashedUserPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    if(hashedUserPassword == userCheck.password) {
        const encodedCredentials = Buffer.from(`${userCheck.userName}:${userCheck.password}:${Date.now()}`).toString("base64");
        await res.json({
            token: `${encodedCredentials}.${crypto.createHash("sha512").update(`${userCheck.userName}:${userCheck.password}`).digest("base64")}`
        });
        return
    } else {
        await res.json({
            error: "User or password incorrect"
        });
        return;
    }
}
exports.register = async(req, res, next) => {
    const userCheck = await UserDB.findOne({
        where: {
            userName: req.body.userName
        }
    });
    if(userCheck) { await res.json({ error: "The user is currently registered!" }); return; }
    const hashedPassword = crypto.createHash("sha256").update(req.body.password).digest("hex");
    await UserDB.create({
        userName: req.body.userName,
        email: req.body.email,
        password: hashedPassword
    });
    if(!enableEmailServices) { await res.json({ error: "none", status: "User registered successfully!" }); return; }
    await mailAgent.sendMail({
        from: `ExampleAPI <${emailAddress}>`,
        to: req.body.email,
        subject: "Thank you for registering to our API!",
        html: `<p>Hello ${req.body.userName || "User"}! Thank you for registering to our API!</p>\r\n` +
                `<p>Get started by reading our documentation in <a href="https://example.com/api/Get-Started">this page</a> for more info on our different endpoints that we offer.</p>\r\n` +
                `<p>Remember that in order for use our API, you need to perform an login first, then using the provided token as an "Authorization: Bearer" in your requests.</p>\r\n` +
                `\r\n` +
                `<i>Happy Coding!</i>`
    })
    await res.json({ error: "none", status: "User registered successfully!" });
    return;
}