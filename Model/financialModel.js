const mongoose = require('mongoose');

// const financialSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",  
//         required: true,
//       },
//     income: { type: Number, default: 0 },
//     expenses: { type: Number, default: 0 }, 
//     savings: { type: Number, default: 0 }, 
//     debt: {
//         monthlyDebtPayments: { type: Number, default: 0 }, 
//         totalDebtBalance: { type: Number, default: 0 } 
//     },
//     insurance: {
//         healthCover: { type: Number, default: 0 },
//         lifeCover: { type: Number, default: 0 } 
//     },
//     emergencyFund: { type: Number, default: 0 }, 
//     investments: { type: [String], default: [] } 
// });

// module.exports = mongoose.model('FinancialHealth', financialSchema);

const financialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  monthlyIncome: { type: Number, required: true },
  monthlyExpenses: { type: Number, required: true },
  totalDebt: { type: Number, required: true },
  monthlyEMI: { type: Number, required: true },
  insuranceCoverage: { type: String, enum: ['Health', 'Terms', 'Both', 'None'], required: true },
  emergencyFund: { type: Number, required: true },
  investments: [{
    type: { type: String, enum: ['Gold', 'Stocks', 'MutualFund', 'Bonds', 'RealEstate', 'Others'], required: true },
    value: { type: Number, required: true },
  }],
  scores: {
    savingsRate: { type: Number, default: 0 },
    debtToIncome: { type: Number, default: 0 },
    emergencyFundAdequacy: { type: Number, default: 0 },
    insuranceCoverage: { type: Number, default: 0 },
    investmentDiversification: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('FinancialHealth', financialSchema);
