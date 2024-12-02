// const mongoose = require('mongoose');

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

// financialModel.js
const mongoose = require('mongoose');

const financialHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  monthlyIncome: { type: String, default: '0' },
  monthlyExpenses: { type: String, default: '0' },
  Savings: [
    {
      totalSavings: { type: String, default: '0' },
      investments: { type: String, default: '0' },
    },
  ],
  debt: [
    {
      monthlyDebtPayments: { type: String, default: '0' },
      totalDebtBalance: { type: String, default: '0' },
    },
  ],
  Insurance: [
    {
      health: { type: String, default: '0' },
      life: { type: String, default: '0' },
    },
  ],
  emergencyFund: { type: String, default: '0' },
});

const FinancialHealth = mongoose.model('FinancialHealth', financialHealthSchema);

module.exports = FinancialHealth;