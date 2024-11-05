// models/userSavingsModel.js
const mongoose = require('mongoose');

const emergencyFundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  monthlyExpenses: {
    type: Number,
    required: true,
  },
  emergencyFundMonths: {
    type: Number,
    required: true,
  },
  monthlySavings: {
    type: Number,
    required: true,
  },
  totalEmergencyFund: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('emergencyFund', emergencyFundSchema);
