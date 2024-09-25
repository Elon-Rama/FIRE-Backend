// FireQuestionModel.js
const mongoose = require("mongoose");

const FireQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: true,
  },
  occupation: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  retireage: {
    type: Number,
    required: false,
  },
  expense: {
    type: Number,
    required: false,
  },
  inflation: {
    type: Number,
    required: false,
  },
  monthlysavings: {
    type: Number,
    required: false,
  },
  retirementsavings: {
    type: Number,
    required: false,
  },
  prereturn: {
    type: Number,
    required: false,
  },
  postreturn: {
    type: Number,
    required: false,
  },
  expectancy: {
    type: Number,
    required: false,
  },

  yearsLeftForRetirement: Number,
  monthlyExpensesAfterRetirement: Number,
  totalSavingsAtRetirement: Number,
  targetedSavings: Number,
  shortfallInSavings: Number,
  accumulatedSavings: Number,
  existingSavingsGrowth: Number,
  extraOneTimeSavingsRequired: Number,
  extraMonthlySavingsRequired: Number,
});

module.exports = mongoose.model("FireQuestion", FireQuestionSchema);
