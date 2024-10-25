// const mongoose = require("mongoose");

// const expensesAllocationSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",
//      required: true 
//     },
//   month: { 
//     type: String, 
//     required: true 
//   }, 
//   year: { 
//     type: String, 
//     required: true 
//   },  
//   titles: [
//     {
//       title: { 
//         type: String, 
//         required: true 
//       },  
//       amount: { 
//         type: Number, 
//         default: 0 
//       },    
//     },
//   ],
// });

// const ExpensesAllocation = mongoose.model("ExpensesAllocation", expensesAllocationSchema);
// module.exports = ExpensesAllocation;


// models/expensesAllocationModel.js
const mongoose = require('mongoose');

const ExpensesAllocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User schema
    required: true
  },
  allocation_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  Titles: [
    {
      title: {
        type: String,
        ref: 'ExpensesMaster' // Reference for ExpensesMaster schema in expensesModel.js
      },
      amount: {
        type: Number,
        default: 0
      }
    }
  ],
  totalExpenses: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('ExpensesAllocation', ExpensesAllocationSchema);
