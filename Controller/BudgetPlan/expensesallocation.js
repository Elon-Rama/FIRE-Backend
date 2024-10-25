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

    let updatedTitles = titles || [];
    if (!updatedTitles.length) {
      const expensesMaster = await ExpensesMaster.find({ userId });
      updatedTitles = expensesMaster
        .filter((expense) => expense.active)
        .map((expense) => ({
          title: expense.title,
          amount: 0,
          active: expense.active,
        }));

      if (updatedTitles.length === 0) {
        return res.status(404).json({
          statuscode: "1",
          message: "No active expenses found for this user",
        });
      }
    }

    const existingTitlesMap = existingAllocation
      ? new Map(existingAllocation.titles.map((title) => [title.title, title]))
      : new Map();

    updatedTitles.forEach((title) => {
      const existingTitle = existingTitlesMap.get(title.title);
      if (existingTitle) {
        existingTitle.amount = title.amount;
      } else {
        existingTitlesMap.set(title.title, {
          title: title.title,
          amount: title.amount,
          active: true,
        });
      }
    });

    const finalTitles = Array.from(existingTitlesMap.values());

    const updateData = {
      userId: user._id,
      month: currentMonth,
      year: currentYear,
      titles: finalTitles,
    };

    const updateAllocation = await ExpensesAllocation.findOneAndUpdate(
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
      expensesAllocationId: updateAllocation._id,
      Expenses: [
        {
          month: currentMonth,
          year: currentYear,
        },
        {
          titles: finalTitles.map((title) => ({
            title: title.title,
            amount: title.amount,
            active: title.active,
            _id: title._id,
          })),
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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "userId is required",
      });
    }

    const userVerify = await ChildExpenses.findOne({ userId });
    if (!userVerify) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }
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
