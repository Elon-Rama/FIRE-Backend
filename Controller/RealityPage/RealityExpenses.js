const express = require("express");
const router = express.Router();
const Expense = require("../../Model/Reality/ExpensesRealityModel");
const User = require("../../Model/emailModel");

exports.createExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId, month, year, title, categories } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalAmount = categories.reduce(
      (acc, category) => acc + category.amount,
      0
    );

    const newExpense = new Expense({
      userId: user._id,
      month,
      year,
      title,
      categories,
      totalAmount,
    });

    await newExpense.save();

    res
      .status(201)
      .json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

exports.getAllExpenses = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

exports.getExpenseById = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense", error });
  }
};

exports.updateExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;
  const { title, categories } = req.body;

  try {
    const totalAmount = categories.reduce(
      (acc, category) => acc + category.amount,
      0
    );

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, categories, totalAmount },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};


exports.deleteExpense = async (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
