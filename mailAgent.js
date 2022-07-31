const util = require("util");
const nodemailer = require("nodemailer");
const { smtpHost, smtpPort, smtpUsername, smtpPassword } = require(`${__dirname}/config/config.inc.json`);
const mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || smtpHost,
    port: process.env.SMTP_PORT || smtpPort,
    auth: {
        user: process.env.SMTP_USER || smtpUsername,
        pass: process.env.SMTP_PASS || smtpPassword
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
});
exports.sendMail = async(mailContent) => {
    const transportInstance = util.promisify(mailTransport.sendMail, mailTransport);
    return transportInstance.call(mailTransport, mailContent);
}