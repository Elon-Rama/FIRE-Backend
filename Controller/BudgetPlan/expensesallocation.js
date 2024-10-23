const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/expensesModel");
const ExpensesAllocation = require("../../Model/ExpensesAllocation");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, titles } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    const currentYear = new Date().getFullYear();

    const existingAllocation = await ExpensesAllocation.findOne({
      userId,
      month: currentMonth,
      year: currentYear,
    });

    let updatedTitles = titles;
    if (!titles || titles.length === 0) {
      const expensesMaster = await ExpensesMaster.find({ userId: userId });

      updatedTitles = expensesMaster
        .filter((expense) => expense.active)
        .map((expense) => ({
          title: expense.title,
          amount: 0,
        }));

      if (updatedTitles.length === 0) {
        return res.status(404).json({
          statuscode: "1",
          message: "No active expenses found for this user",
        });
      }
    }

    // Calculate total expenses
    const totalExpenses = updatedTitles.reduce((total, title) => total + title.amount, 0);

    const updateData = {
      userId: user._id,
      month: currentMonth,
      year: currentYear,
      titles: updatedTitles,
      totalExpenses, // Include totalExpenses in updateData
    };

    const updatedOrCreatedAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId: user._id, month: currentMonth, year: currentYear },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const response = {
      statuscode: "0",
      message: existingAllocation
        ? "Expenses Allocation updated successfully"
        : "Expenses Allocation created successfully",
      userId: user._id,
      expensesAllocationId: updatedOrCreatedAllocation._id,
      Expenses: [
        {
          month: currentMonth,
          year: currentYear,
        },
        {
          titles: updatedOrCreatedAllocation.titles,
          totalExpenses: updatedOrCreatedAllocation.totalExpenses, // Add totalExpenses to response
        },
      ],
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};


exports.getAll = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const allocations = await ExpensesAllocation.find();
    return res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocations fetched successfully",
      data: allocations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  const { userId, month, year } = req.params;

  try {
    const allocation = await ExpensesAllocation.findOne({
      userId,
      month,
      year,
    });
    
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    return res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation fetched successfully",
      data: allocation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};



exports.delete = async (req, res) => {
  const { allocationId } = req.params;

  try {
    const allocation = await ExpensesAllocation.findByIdAndDelete(allocationId);
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.delete = async (req, res) => {
  const { allocationId } = req.params;

  try {
    const allocation = await ExpensesAllocation.findByIdAndDelete(allocationId);
    if (!allocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses Allocation not found",
      });
    }

    res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocation deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};
