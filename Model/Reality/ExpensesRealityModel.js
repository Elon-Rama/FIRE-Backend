const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const realityExpensesSchema = new mongoose.Schema(
  {
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
      type: Number,
      required: true,
    },
    titles: [
      {
        title: {
          type: String,
          required: true,
        },
        subCategory: [subCategorySchema],
      },
    ],
    totalExpenses: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RealityExpenses = mongoose.model(
  "RealityExpenses",
  realityExpensesSchema
);

module.exports = RealityExpenses;
