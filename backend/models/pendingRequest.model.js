const mongoose = require('mongoose')

const pendingRequestSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    });
    
// auto delete after 5mins
pendingRequestSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('PendingRequest', pendingRequestSchema)