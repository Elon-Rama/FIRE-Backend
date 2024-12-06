
const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [
        {
            question: Number,
            answer: String,
            points: Number
        }
    ],
    totalScore: {
        type: Number,
        required: true
    },
    riskProfile: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Risk", riskSchema);