const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    loanName: { type: String, required: true },
    amount: { type: Number, required: true },
    RateofInterest: { type: Number, required: true }, 
    EMI: { type: Number, required: true },
    debtAmount: { type: Number },
    yearstorepaid: { type: String }, 
    RemainingBalance: { type: Number } 
});

const DebtSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    source: [LoanSchema]
});

module.exports = mongoose.model('Debt', DebtSchema);
