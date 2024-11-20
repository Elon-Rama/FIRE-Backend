
const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  loanName: { type: String, required: true },
  principleAmount: { type: Number, required: true },
  interest: { type: Number, required: true },
  loanTenure: { type: Number, required: true },
  emi: { type: Number },
  totalPayment: { type: Number },
  totalInterestPayment: { type: Number },
  currentPaid: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  outstandingBalance: { type: Number, required: false },
});

const DebtClearanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  source: [LoanSchema],
});

module.exports = mongoose.model("DebtClearance", DebtClearanceSchema);
