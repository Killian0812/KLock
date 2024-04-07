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
    room: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    refreshToken: String,
    expoPushToken: String,
    mobileRefreshToken: String
})

module.exports = mongoose.model('User', userSchema)