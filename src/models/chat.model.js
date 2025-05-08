const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    content: {
        type: String,
        default: ''
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    // receiver: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: false // Optional if using rooms
    // },
    // room: {
    //     type: String, // e.g., group ID or room name
    //     required: false
    // },
    // file: {
    //     type: {
    //         url: String,
    //         type: String // e.g., 'image', 'video', 'pdf'
    //     },
    //     required: false
    // },
    // emoji: {
    //     type: String,
    //     required: false
    // },
    // seen: {
    //     type: Boolean,
    //     default: false
    // }
}, {
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Chat', chatSchema);
