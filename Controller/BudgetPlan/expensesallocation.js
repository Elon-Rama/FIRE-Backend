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

    // Fetch only active ExpensesMaster entries for the user
    const activeExpensesMaster = await ExpensesMaster.find({
      userId,
      active: true, // Only consider active expenses
    });

    let updatedTitles = [];

    if (titles && titles.length > 0) {
      // Existing allocation logic
      const existingAllocation = await ExpensesAllocation.findOne({
        userId,
        month: currentMonth,
        year: currentYear,
      });

      const existingTitles = existingAllocation ? existingAllocation.titles : [];

      const existingTitlesMap = existingTitles.reduce((acc, title) => {
        acc[title.title] = title.amount;
        return acc;
      }, {});

      updatedTitles = titles.map((title) => ({
        title: title.title,
        amount: title.amount !== undefined
          ? title.amount
          : existingTitlesMap[title.title] || 0,
      }));
    } else {
      // Use active ExpensesMaster titles if no titles are provided
      updatedTitles = activeExpensesMaster.map((expense) => ({
        title: expense.title,
        amount: 0, // Default amount set to 0
      }));

      if (updatedTitles.length === 0) {
        return res.status(404).json({
          statuscode: "1",
          message: "No active expenses found for this user",
        });
      }
    }

    const updateData = {
      userId: user._id,
      month: currentMonth,
      year: currentYear,
      titles: updatedTitles,
    };

    const updatedOrCreatedAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId: user._id, month: currentMonth, year: currentYear },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const totalExpenses = updatedTitles.reduce(
      (acc, title) => acc + title.amount,
      0
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
          totalExpenses: totalExpenses,
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

    const allocations = await ExpensesMaster.find({userId});
    const activeallocations = allocations.filter((allocations) => allocations.active);
    return res.status(200).json({
      statuscode: "0",
      message: "Expenses Allocations fetched successfully",
      data: activeallocations,
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
  //#swagger.tags = ['Expenses Allocation']
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
