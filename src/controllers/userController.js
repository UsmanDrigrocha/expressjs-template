const jwt = require('jsonwebtoken');

const multer = require('multer');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');

const User = require('../models/User');

const bcrypt = require('bcrypt');

const mail = require('../utils/sendMail');

// --------------------------------------- Register ---------------------------------------
const userRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const issuedAt = Math.floor(Date.now() / 1000);

        const expirationTime = issuedAt + 3600; // 1 hour expiration

        const payload = {
            email: email,
            iat: issuedAt,
            exp: expirationTime
        };

        const emailVerifyToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        const emailVerifyLink = process.env.FRONTEND_URL_ACCOUNT_VERIFY + emailVerifyToken;

        let findUser = await User.findOne({ email });

        // User Not Found : Create
        if (!findUser) {
            const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({
                email,
                password: hashedPassword,
            });

            await user.save();

            const emailSent = mail(email, "Email Verification", 'Email Verification', `OTP<a>${emailVerifyLink}</a>`);

            if (emailSent) {
                return res.status(200).json({ Message: "Verify Email !", Data: user.email });
            } else {
                return res.status(400).json({ Message: "Error Sending Mail !" })
            }
        }

        // Deleted OR Not Verified
        if (findUser.isDeleted || !findUser.emailVerified) {
            // send mail
            const emailSent = mail(email, "Email Verification", 'Email Verification', `OTP<a>${emailVerifyLink}</a>`);
            if (emailSent) {
                return res.status(200).json({ Message: "Verify Email !", Data: findUser.email });
            } else {
                return res.status(400).json({ Message: "Error Sending Mail !" })
            }
        }

        // Verified
        if (findUser.emailVerified) {
            return res.status(409).json({ Message: "User Already Registered !" });
        }
    } catch (error) {
        res.status(500).json({ Message: "Internal Server Error !", Error: error.message });
    }

}

// --------------------------------------- Verify Account ---------------------------------------
const verifyAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const currentTime = Math.floor(Date.now() / 1000);

        const findUser = await User.findOne({ email: decoded.email });

        if (!findUser) {
            return res.status(404).json({ Message: "User Not Found !" })
        }

        if (currentTime > decoded.exp) {
            res.status(400).json({ Message: "Token Expired !" });
        } else {
            if (!findUser.isDeleted || !findUser.emailVerified) {
                findUser.emailVerified = true;
                findUser.isDeleted = false;
            }

            await findUser.save();
            return res.status(200).json({ Message: "Account Verified !", User: findUser.email });
        }

        res.status(200).json({ message: 'Account Verification Successful', Email: decoded.email });
    } catch (error) {
        res.status(400).json({ Message: "Token Expired !" });
    }
};

// --------------------------------------- Login ---------------------------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({ Message: "User Not Found !" })
        }

        if (findUser.isDeleted || !findUser.emailVerified) {
            return res.status(400).json({ Message: "Please verify your account by registering again." });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);

        if (!passwordMatch) {
            return res.status(401).json({ Message: "Invalid Password !" });
        }

        const token = jwt.sign({ userID: findUser.id, },
            process.env.JWT_SECRET_KEY, { expiresIn: '4d' }
        );

        res.status(200).json({ Message: "Login Successfully !", Token: token });


    } catch (error) {
        res.status(500).json({ Message: "Internal Server Error !", Error: error.message });
    }
}


// ##########################################################################################################################


module.exports = {
    userRegister,
    verifyAccount,
    login,
}