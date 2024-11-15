const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    loanName: { type: String, required: true },
    amount: { type: Number, required: true },
    RateofInterest: { type: Number, required: true }, // Percentage
    EMI: { type: Number, required: true },
    debtAmount: { type: Number }, // Calculated (principal + interest)
    yearstorepaid: { type: String }, // Calculated repayment time
    RemainingBalance: { type: Number } // Remaining balance to be repaid
});

const DebtSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    source: [LoanSchema] // Array of loans
});

module.exports = mongoose.model('Debt', DebtSchema);
