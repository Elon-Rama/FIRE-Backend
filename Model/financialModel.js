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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  income: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  debtAmount: { type: Number, default: 0 },
  monthlyEmi: { type: Number, default: 0 },
  insurance: { type: String, enum: ['Health', 'Terms', 'Both'], default: 'None' },
  emergencyFund: { type: Number, default: 0 },
  investments: { type: [String],enum: ['Stocks', 'Gold', 'RealEstate', 'Bonds', 'MutualFund', 'Others'], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Financial', financialSchema);
