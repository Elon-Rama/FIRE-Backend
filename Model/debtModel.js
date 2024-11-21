const mongoose = require("mongoose");

// const SourceSchema = new mongoose.Schema({
//   loanName: {
//     type: String,
//     required: true,
//   },
//   principleAmount: {
//     type: Number,
//     required: true,
//   },
//   interest: {
//     type: Number,
//     required: true,
//   },
//   loanTenure: {
//     type: Number,
//     required: true,
//   },
//   currentPaid: {
//     type: Number,
//     default: 0,
//   },
//   emi: {
//     type: Number,
//   },
//   totalPayment: {
//     type: Number,
//   },
//   totalInterestPayment: {
//     type: Number,
//   },
//   date: {
//     type: String,
//     required: true,
//   },
//   time: {
//     type: String,
//     required: true,
//   },
// });


const SourceSchema = new mongoose.Schema({
  loanName: String,
  principleAmount: Number,
  interest: Number,
  loanTenure: Number,
  currentPaid: { type: Number, default: 0 },
  emi: Number,
  totalPayment: Number,
  totalInterestPayment: Number,
  outstandingBalance: Number, // Keep track of the remaining amount
  date: String,
  time: String,
  paymentHistory: [
    {
      month: String, // e.g., "2024-11"
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


