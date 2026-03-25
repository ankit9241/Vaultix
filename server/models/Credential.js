const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    emailOrPhone: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Credential', credentialSchema);
