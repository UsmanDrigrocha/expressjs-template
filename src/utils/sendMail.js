const nodemailer = require("nodemailer");
const { prependOnceListener } = require("../models/User");
require('dotenv').config();

async function sendMail(sendMailto, mailSubject, mailText, mailHTMLBody) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.MAIL_FROM,
                pass: process.env.MAIL_PASSKEY
            }
        });

        const info = await transporter.sendMail({
            from: `"UpWrite AI" ${process.env.MAIL_FROM}`, // sender address
            to: `${sendMailto}`, // recipient address
            subject: `${mailSubject} ✔`, // Subject line
            text: mailText, // plain text body
            html: mailHTMLBody, // html body
        });
        
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error.message);
        return false;
    }
}

module.exports = sendMail;
