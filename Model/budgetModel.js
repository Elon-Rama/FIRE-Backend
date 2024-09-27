const mongoose = require('mongoose');


const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    month: {
        type: String,
        required: false,
    },
    year: {
        type: Number,
        required: false,
    },
    income: {
        type: Number,
        required: false,
    },
    otherIncome: {
        type: Number,
        default: 0,
    },
    totalIncome: {
        type: Number,
        required: false,
    },
    }, { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
