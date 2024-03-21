const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    mac: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    managers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
})

module.exports = mongoose.model('Room', roomSchema)