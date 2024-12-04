// riskModel.js
const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Unique ID for user
    answers: [
        {
            question: String,
            answer: String,
            points: Number,
        },
    ],
    totalScore: { type: Number, required: true },
    riskProfile: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PersonalRisk', riskSchema);
