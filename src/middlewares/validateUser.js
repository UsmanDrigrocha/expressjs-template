const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/User');
const { default: mongoose } = require('mongoose');

const validateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split('Bearer ')[1]
            : req.headers.authorization;

        if (!token) {
            return res.status(400).json({ Message: "Unauthorized !!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userID = decoded.userID;
        const validateUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userId), isDeleted: false });

        if (!validateUser) {
            return res.status(400).json({ Message: "Unauthorized !" });
        }

        req.user = decoded;
        next();

    } catch (error) {
        res.status(500).json({ message: "Error Validating Token", error: error.message });
    }
};


module.exports = {
    validateUser
}