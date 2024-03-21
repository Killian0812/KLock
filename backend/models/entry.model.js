const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema(
    {
        mac: {
            type: String,
            required: true
        },
        name: {
            type: String,
            default: "Guest"
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Entry', entrySchema)