const express = require("express");
const router = express.Router();
const Expense = require("../../Model/Reality/ExpensesRealityModel");
const User = require("../../Model/emailModel");

// Create a new expense
exports.createExpense = async (req, res) => {
  const { userId, title, category, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    const newExpense = new Expense({
      userId: user._id,
      title,
      category,
      amount,
    });

    await newExpense.save();

    res.status(201).json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
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

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { title, category, amount } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, category, amount },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
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
