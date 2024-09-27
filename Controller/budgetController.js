const Budget = require("../Model/budgetModel");
const User = require("../Model/emailModel");

exports.createBudget = async (req, res) => {
  try {
    const { month, year, income, otherIncome, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingBudget = await Budget.findOne({ month, year, userId });
    if (existingBudget) {
      return res.status(400).json({
        message: "Budget entry already exists for this month and year",
      });
    }

    const totalIncome = income + (otherIncome || 0);

    const newBudget = new Budget({
      month,
      year,
      income,
      otherIncome: otherIncome || 0,
      totalIncome,
      userId,
    });

    await newBudget.save();

    return res.status(201).json({
      message: "Budget entry created successfully",
      budget: newBudget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { month, year, income, otherIncome, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budgetEntry = await Budget.findOne({ month, year, userId });
    if (!budgetEntry) {
      return res.status(404).json({
        message: "Budget entry not found for this month and year",
      });
    }

    budgetEntry.income = income;
    budgetEntry.otherIncome = otherIncome || 0;
    budgetEntry.totalIncome = income + (otherIncome || 0);
    budgetEntry.updatedAt = Date.now();

    await budgetEntry.save();

    return res.status(200).json({
      message: "Budget entry updated successfully",
      budget: budgetEntry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update budget entry",
      error: error.message,
    });
  }
};
