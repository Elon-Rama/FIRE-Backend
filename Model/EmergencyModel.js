const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthlyExpenses: {
    type: Number,
    required: false,
  },
  monthsNeed: {
    type: Number,
    required: false,
  },
  savingsperMonth: {
    type: Number,
    required: false,
  },
  expectedFund: {
    type: Number,
    required: false,
  },
  actualFund: [
    {
      Entry: [
        {
          date: {
            type: String,
            required: true,
          },
          time: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: false,
          },
          rateofInterest: {
            type: Number,
            required: false,
          },
          savingsMode: {
            type: String,
            enum: ["F.D", "R.D", "M.F liquid", "M.F debt"], 
            required: false, 
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("EmergencyFund", emergencySchema);
