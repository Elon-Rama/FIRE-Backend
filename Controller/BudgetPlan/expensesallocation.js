const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/masterExpensesModel");
const ExpensesAllocation = require("../../Model/ExpensesAllocation");
const ChildExpenses = require("../../Model/ChildExpensesModel");
const moment = require("moment-timezone");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, titles, month, year } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    const existingAllocation = await ExpensesAllocation.findOne({
      userId,
      month,
      year,
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
          category: expense.category,
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
        existingTitle.amount = title.amount || 0;
      } else {
        existingTitlesMap.set(title.title, {
          title: title.title,
          amount: title.amount || 0,
          category: title.category || [],
          active: true,
        });
      }
    });

    const finalTitles = Array.from(existingTitlesMap.values());

    const totalExpenses = finalTitles.reduce((total, title) => {
      return (
        total +
        (typeof title.amount === "number" && !isNaN(title.amount)
          ? title.amount
          : 0)
      );
    }, 0);

    const updateData = {
      userId: user._id,
      month,
      year,
      titles: finalTitles,
      totalExpenses,
      active: true,
    };

    const updateAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId: user._id, month, year },
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
      totalExpenses,
      Expenses: finalTitles.map((title) => ({
        title: title.title,
        amount: title.amount,
        active: title.active,
        category: title.category.map((cat) => ({
          title: cat.title,
          amounts: cat.amounts || [],
          _id: cat._id,
        })),
        _id: title._id,
      })),
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

exports.copyPreviousMonthData = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, month, year } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1 || monthIndex === 0) {
      return res.status(400).json({
        statuscode: "1",
        message: "Invalid month provided or no previous month data available.",
      });
    }

    const previousMonth = monthNames[monthIndex - 1];
    const previousYear = monthIndex === 0 ? year - 1 : year;

    const previousAllocation = await ExpensesAllocation.findOne({
      userId,
      month: previousMonth,
      year: previousYear,
    });

    if (!previousAllocation) {
      return res.status(404).json({
        statuscode: "1",
        message: "No allocation data found for the previous month.",
      });
    }

    const newAllocationData = {
      userId: user._id,
      month,
      year,
      titles: previousAllocation.titles.map((title) => ({
        title: title.title,
        category: title.category,
        amount: title.amount,
        active: title.active,
      })),
      totalExpenses: previousAllocation.totalExpenses,
      active: true,
    };

    const newAllocation = await ExpensesAllocation.findOneAndUpdate(
      { userId: user._id, month, year },
      { $set: newAllocationData },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      statuscode: "0",
      message: "Data copied successfully from the previous month.",
      userId: user._id,
      expensesAllocationId: newAllocation._id,
      totalExpenses: newAllocation.totalExpenses,
      Expenses: newAllocation.titles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.updateExpenseAmount = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, entryId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const expenses = await ExpensesAllocation.findOne({ userId });
    if (!expenses) {
      return res.status(404).json({
        statusCode: "1",
        message: "Expenses record not found",
      });
    }

    let foundEntry = null;
    for (const title of expenses.titles) {
      for (const category of title.category) {
        foundEntry = category.amounts.find(
          (entry) => entry._id.toString() === entryId
        );
        if (foundEntry) break;
      }
      if (foundEntry) break;
    }

    if (!foundEntry) {
      return res.status(404).json({
        statusCode: "1",
        message: "Amount entry not found",
      });
    }

    foundEntry.amount = parseFloat(amount);
    foundEntry.Date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    foundEntry.time = moment().tz("Asia/Kolkata").format("HH:mm:ss");

    await expenses.save();

    return res.status(200).json({
      statusCode: "0",
      message: "Expense amount updated successfully",
      updatedEntry: foundEntry,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.postSubCategoryValues = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, month, year, selectedMaster, selectedCategory, amount } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const expenses = await ExpensesAllocation.findOne({ userId, month, year });
    if (!expenses) {
      return res.status(404).json({
        statusCode: "1",
        message: "Expenses record not found for the specified month and year",
      });
    }

    const master = expenses.titles.find(
      (title) => title.title === selectedMaster
    );

    const timeZone = "Asia/Kolkata";
    const currentDate = moment().tz(timeZone).format("YYYY-MM-DD");
    const currentTime = moment().tz(timeZone).format("HH:mm:ss");

    if (!master) {
      const newMaster = {
        title: selectedMaster,
        active: true,
        category: [
          {
            title: selectedCategory,
            amounts: [
              {
                amount: parseFloat(amount),
                Date: currentDate,
                time: currentTime,
              },
            ],
          },
        ],
      };
      expenses.titles.push(newMaster);
      await expenses.save();
    } else {
      const category = master.category.find(
        (cat) => cat.title === selectedCategory
      );
      if (category) {
        category.amounts.push({
          amount: parseFloat(amount),
          Date: currentDate,
          time: currentTime,
        });
      } else {
        master.category.push({
          title: selectedCategory,
          amounts: [
            {
              amount: parseFloat(amount),
              Date: currentDate,
              time: currentTime,
            },
          ],
        });
      }
      await expenses.save();
    }

    const categoryResponse = master.category.map((cat) => {
      const totalAmount = cat.amounts.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );
      return {
        title: cat.title,
        amounts: cat.amounts,
        totalAmount: totalAmount,
      };
    });

    const categoryTotal = categoryResponse.reduce(
      (sum, cat) => sum + cat.totalAmount,
      0
    );

    return res.status(201).json({
      statusCode: "0",
      message: "Subcategory amount updated successfully",
      category: categoryResponse,
      categoryTotal: categoryTotal,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  const { userId, month, year } = req.body;

  try {
    let allocation = await ExpensesAllocation.findOne({ userId, month, year });

    if (!allocation) {
      const previousAllocation = await ExpensesAllocation.findOne({ userId });

      if (previousAllocation) {
        const modifiedTitles = previousAllocation.titles.map((title) => ({
          title: title.title,
          active: title.active,
          category: title.category,
          amount: 0,
        }));

        allocation = new ExpensesAllocation({
          userId,
          month,
          year,
          titles: modifiedTitles,
          AllocationTotal: 0,
          RealityTotal: 0,
        });

        await allocation.save();
        return res.status(201).json({
          statuscode: "0",
          message:
            "Previous month's data copied with amount reset to 0 for the new month",
          data: [allocation],
        });
      } else {
        return res.status(404).json({
          statuscode: "1",
          message: "No allocation data found for the user",
        });
      }
    }

    let AllocationTotal = 0;
    let categoryTotal = 0;

    allocation.titles = allocation.titles.map((title) => {
      const titleAmount = title.amount;

      let individualTitleCatecaoryTotalAmount = 0; // Initialize total amount for this title

      title.category = title.category.map((cat) => {
        const categoryTotalAmount = cat.amounts.reduce(
          (sum, amt) => sum + amt.amount,
          0
        );
        cat.totalAmount = categoryTotalAmount;
        categoryTotal += categoryTotalAmount;
        individualTitleCatecaoryTotalAmount += categoryTotalAmount;

        // Add the computed value to each category and return it
        return {
          ...cat,
          individualTitleCatecaoryTotalAmount, // Add this computed value
        };
      });

      AllocationTotal += titleAmount;
console.log("first",individualTitleCatecaoryTotalAmount)
      // Add the `individualTitleCatecaoryTotalAmount` to the title object
      console.log("tt", title)
      return {
        ...title,
        amount: titleAmount,
        individualTitleCatecaoryTotalAmount, // Add the computed value here
      };
    });

    allocation.AllocationTotal = AllocationTotal;
    // await allocation.save();

    res.status(200).json({
      statuscode: "0",
      message: "Data fetched successfully",
      data: [
        allocation,
        {
          AllocationTotal,
          categoryTotal,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};


exports.getById = async (req, res) => {
  //#swagger.tags = ['Expenses Allocation']
  try {
    const { userId, month, year } = req.params;

    if (!userId || !month || !year) {
      return res.status(400).json({
        statusCode: "1",
        message: "userId, month, and year are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const allocation = await ExpensesAllocation.findOne({
      userId,
      month,
      year,
    });

    if (!allocation) {
      return res.status(404).json({
        statusCode: "1",
        message: "Expenses Allocation not found",
      });
    }

    const response = {
      statusCode: "0",
      message: "Expenses Allocation fetched successfully",
      data: {
        userId: allocation.userId,
        month: allocation.month,
        year: allocation.year,
        titles: allocation.titles.map((title) => ({
          title: title.title,
          amount: title.amount,
          active: title.active,
          _id: title._id,
        })),
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
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