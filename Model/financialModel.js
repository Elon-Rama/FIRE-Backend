// const mongoose = require('mongoose');

// const financialSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', 
//     required: true,
//   },
//   income: {
//     type: String,
//     required: true,
//   },
//   expenses: {
//     type: String,
//     required: true,
//   },
//   debtAmount: {
//     type: String,
//     required: true,
//   },
//   monthlyEmi: {
//     type: String,
//     required: true,
//   },
//   insurance: {
//     Health: {
//       type: String,
//       default: "0",
//     },
//     Terms: {
//       type: String,
//       default: "0",
//     },
//     Both: {
//       type: String,
//       default: "0",
//     },
//   },
//   emergencyFund: {
//     type: String,
//     required: true,
//   },
//   investments: {
//     Stocks: {
//       type: String,
//       default: "0",
//     },
//     Gold: {
//       type: String,
//       default: "0",
//     },
//     Bonds: {
//       type: String,
//       default: "0",
//     },
//     MutualFund: {
//       type: String,
//       default: "0",
//     },
//     RealEstate: {
//       type: String,
//       default: "0",
//     },
//     Others: {
//       type: String,
//       default: "0",
//     },
//   },
// }, { timestamps: true });

// const Financial = mongoose.model('Financial', financialSchema);

// module.exports = Financial;

const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  income: { type: Number, required: true },
  expenses: { type: Number, required: true },
  debtAmount: { type: Number, required: true },
  monthlyEmi: { type: Number, required: true },
  insurance: { type: String, enum: ['Health', 'Terms', 'Both'], required: true },
  emergencyFund: { type: Number, required: true },
  investments: {
    type: [String],
    enum: ['Stocks', 'Gold', 'RealEstate', 'Bonds', 'MutualFund', 'Others'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Financial', financialSchema);
