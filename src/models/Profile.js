const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, experience: { type: String, default: null },
    industry: { type: String, default: null },
    role: { type: String, enum: ['individual', 'agency'] },
    projects: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
