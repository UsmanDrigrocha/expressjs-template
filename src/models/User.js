const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('Users', userSchema);