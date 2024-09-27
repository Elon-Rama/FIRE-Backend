const mongoose = require('mongoose');

const personalSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  categories: {
    housing: { type: Number, required: true },
    entertainment: { type: Number, required: true },
    transportation: { type: Number, required: true },
    loans: { type: Number, required: true },
    insurance: { type: Number, required: true },
    taxes: { type: Number, required: true },
    food: { type: Number, required: true },
    savingsAndInvestments: { type: Number, required: true },
    pets: { type: Number, required: true },
    giftsAndDonations: { type: Number, required: true },
    personalCare: { type: Number, required: true },
    legal: { type: Number, required: true }
  },
  totalExpenses: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('PersonalBudget', personalSchema);
