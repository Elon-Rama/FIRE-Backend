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
      category: [
                {
                  title: {
                    type: String,
                    required: true
                  },
                  amounts: [
                    {
                      amount: {
                        type: Number,
                        required: true 
                      },
                      Date: {
                        type: String,
                        required: true
                      },
                      time: {
                        type: String,
                        required: true
                      }
                    }
                  ],
                  totalAmount: {
                    type: Number,
                    default: 0 
                  }
                }
              ]
    }
  ],
  // totalExpenses: {
  //   type: Number,
  //   default: 0
  // },
});

const ExpensesAllocation = mongoose.model("ExpensesAllocation", expensesAllocationSchema);
module.exports = ExpensesAllocation;


// const mongoose = require("mongoose");

// const expensesAllocationSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User",
//     required: true 
//   },
//   month: { 
//     type: String, 
//     required: true 
//   }, 
//   year: { 
//     type: String, 
//     required: true 
//   },  
//    titles: [
//     {
//       title: { 
//         type: String, 
//         required: true 
//       },  
//       active: {
//         type: Boolean,
//         required: false,
//       },
//       amount: { 
//         type: Number, 
//         default: 0 
//       },
//       category: [
//         {
//           title: {
//             type: String,
//             required: true
//           },
//           amounts: [
//             {
//               amount: {
//                 type: Number,
//                 required: true 
//               },
//               Date: {
//                 type: String,
//                 required: true
//               },
//               time: {
//                 type: String,
//                 required: true
//               }
//             }
//           ],
//           totalAmount: {
//             type: Number,
//             default: 0 // You can keep this, but it will not automatically calculate from amounts
//           }
//         }
//       ]
//     }
//   ],
//   totalExpenses: {
//     type: Number,
//     default: 0
//   },
// });

// // Add a pre-save hook to calculate totalAmount and totalExpenses if needed
// expensesAllocationSchema.pre('save', function (next) {
//   this.titles.forEach(title => {
//     title.category.forEach(cat => {
//       // Calculate total amount for the category
//       cat.totalAmount = cat.amounts.reduce((sum, item) => sum + item.amount, 0);
//     });
//   });

//   // Calculate total expenses across all titles and categories
//   this.totalExpenses = this.titles.reduce((sum, title) => {
//     return sum + title.category.reduce((catSum, cat) => catSum + cat.totalAmount, 0);
//   }, 0);

//   next();
// });

// const ExpensesAllocation = mongoose.model("ExpensesAllocation", expensesAllocationSchema);
// module.exports = ExpensesAllocation;


