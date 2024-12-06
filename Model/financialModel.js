const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  income: { 
    type: Number, 
    default: 0 
  },
  expenses: { 
    type: Number, 
    default: 0 
  },
  debtAmount: { 
    type: Number, 
    default: 0 
  },
  monthlyEmi: { 
    type: Number, 
    default: 0 
  },
  insurance: { 
    type: String, 
    default: "None" 
  },
  emergencyFund: { 
    type: Number, 
    default: 0 
  },
  investments: { 
    type: [String], 
    default: [] 
  },
  savingsScore: {
    value: { type: Number, default: 0 },
    status: { type: String, default: "Needs Improvement" },
    points: { type: Number, default: 0 }
  },
  debtScore: {
    value: { type: Number, default: 0 },
    status: { type: String, default: "Poor" },
    points: { type: Number, default: 0 }
  },
  emergencyFundScore: {
    value: { type: Number, default: 0 },
    status: { type: String, default: "Poor" },
    points: { type: Number, default: 0 }
  },
  insuranceScore: {
    status: { type: String, default: "Poor" },
    points: { type: Number, default: 0 }
  },
  investmentScore: {
    status: { type: String, default: "Poor" },
    points: { type: Number, default: 0 }
  },
  overallScore: {
    value: { type: Number, default: 0 },
    status: { type: String, default: "Needs Improvement" },
    description: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model('Financial', financialSchema);


