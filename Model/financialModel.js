// const mongoose = require('mongoose');

// const financialSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true, 
//     unique: true 
//   },
//   income: { 
//     type: Number, 
//     default: 0 
//   },
//   expenses: { 
//     type: Number, 
//     default: 0 
//   },
//   debtAmount: { 
//     type: Number, 
//     default: 0 
//   },
//   monthlyEmi: { 
//     type: Number, 
//     default: 0 
//   },
//   insurance: { 
//     type: [String], 
//     default: ['None'], 
//   },
//   emergencyFund: { 
//     type: Number, 
//     default: 0 
//   },
//   investments: { 
//     type: [String],
//     // enum: ['Stocks', 'Gold', 'RealEstate', 'Bonds', 'MutualFund', 'Others'], 
//     default: [] 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// module.exports = mongoose.model('Financial', financialSchema);


const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  income: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  debtAmount: { type: Number, default: 0 },
  monthlyEmi: { type: Number, default: 0 },
  insurance: { type: [String], default: ['None'] },
  emergencyFund: { type: Number, default: 0 },
  investments: { type: [String], default: [] },
});

module.exports = mongoose.model('Financial', financialSchema);
