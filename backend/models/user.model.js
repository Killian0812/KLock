const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["USER"]
    },
    active: {
        type: Boolean,
        default: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)