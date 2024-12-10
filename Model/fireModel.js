
const mongoose = require("mongoose");

const FireQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true,
  },
  // occupation: {
  //   type: String,
  //   required: true,
  // },
  // city: {
  //   type: String,
  //   required: true,
  // },
  age: {
    type: Number,
    required: true,
  },
  retireage: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
  inflation: {
    type: Number,
    required: true,
  },
  monthlysavings: {
    type: Number,
    required: true,
  },
  retirementsavings: {
    type: Number,
    required: true,
  },
  prereturn: {
    type: Number,
    required: true,
  },
  postreturn: {
    type: Number,
    required: true,
  },
  expectancy: {
    type: Number,
    required: true,
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
