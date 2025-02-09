const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    favorites: [{ type: String }] // Список имен покемонов
});

module.exports = mongoose.model('User', UserSchema);