const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    income: {
        type: String,
        default: '0'
    },
    expenses: {
        type: String,
        default: '0'
    },
    debtAmount: {
        type: String,
        default: '0'
    },
    monthlyEmi: {
        type: String,
        default: '0'
    },
    insurance: {
        Health: {
            type: String,
            default: '0'
        },
        Terms: {
            type: String,
            default: '0'
        },
        Both: {
            type: String,
            default: '0'
        }
    },
    emergencyFund: {
        type: String,
        default: '0'
    },
    investments: {
        Stocks: {
            type: String,
            default: '0'
        },
        Gold: {
            type: String,
            default: '0'
        },
        Bonds: {
            type: String,
            default: '0'
        },
        MutualFund: {
            type: String,
            default: '0'
        },
        RealEstate: {
            type: String,
            default: '0'
        },
        Others: {
            type: String,
            default: '0'
        }
    },
    scores: [{
        savingsRate: Object,
        debtToIncomeRatio: Object,
        emergencyFund: Object,
        insuranceCoverage: Object,
        investmentDiversification: Object,
    }],
    overallScore: Number,
  category: String,
  description: String,
});

module.exports = mongoose.model('Financial', financialSchema);
