const mongoose = require("mongoose");

const expensesAllocationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  month: { 
    type: String, 
    required: true 
  }, 
  year: { 
    type: String, 
    required: true 
  },  
  titles: [
    {
      title: { 
        type: String, 
        required: true 
      },  
      active: {
        type: Boolean,
        required: false,
      },
      amount: { 
        type: Number, 
        default: 0 
      },   
    }
  ],
  totalExpenses: {
    type: Number,
    default: 0
  },
});

const ExpensesAllocation = mongoose.model("ExpensesAllocation", expensesAllocationSchema);
module.exports = ExpensesAllocation;
