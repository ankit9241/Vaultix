const mongoose = require('mongoose');

const envVariableSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    key: {
        type: String,
        required: true,
        trim: true,
    },
    value: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EnvVariable', envVariableSchema);
