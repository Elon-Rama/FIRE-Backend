const mongoose = require("mongoose");

const SourceSchema = new mongoose.Schema({
  loanName: String,
  principalAmount: Number,
  interest: Number,
  loanTenure: Number,
  currentPaid: { type: Number, default: 0 },
  emi: Number,
  totalPayment: Number,
  totalInterestPayment: Number,
  outstandingBalance: Number, 
  date: String,
  time: String,
  paymentHistory: [
    {
      month: String, 
      emiPaid: Number,
      principalPaid: Number,
      interestPaid: Number,
      remainingBalance: Number,
    },
  ],
});
const DebtClearanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  source: [SourceSchema], 
  
});
const DebtClearance = mongoose.model("DebtClearance", DebtClearanceSchema);

module.exports = DebtClearance;


