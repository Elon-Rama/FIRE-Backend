const mongoose = require("mongoose");

const expensesAllocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  titles: [
    {
      title: {
        type: String,
        required: true,
      },
      active: {
        type: Boolean,
        required: false,
      },
      amount: {
        type: Number,
        default: 0,
      },
      individualTitleCatecaoryTotalAmount:{
        type : Number,
        default: 0
      },
      category: [
        {
          title: {
            type: String,
            required: true,
          },
          amounts: [
            {
              amount: {
                type: Number,
                required: true,
              },
              Date: {
                type: String,
                required: true,
              },
              time: {
                type: String,
                required: true,
              },
            }
          ],
          totalAmount: {
            type: Number,
            default: 0, // This should be updated programmatically
          },
        },
      ],
    },
  ],
  totalExpenses: {
    type: Number,
    default: 0, // This should be updated programmatically
  },
});

const ExpensesAllocation = mongoose.model(
  "ExpensesAllocation",
  expensesAllocationSchema
);

module.exports = ExpensesAllocation;
