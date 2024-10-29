const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/expensesModel");
const ExpensesAllocation = require("../../Model/ExpensesAllocation");
const ChildExpenses = require("../../Model/ChildExpensesModel");

exports.upsert = async (req, res) => {
  try {
    const { userId, titles, month, year } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }
    const existingAllocation = await ExpensesAllocation.findOne({ userId, month, year });
    let updatedTitles = titles || [];
    if (!updatedTitles.length) {
      const expensesMaster = await ExpensesMaster.find({ userId });
      updatedTitles = expensesMaster
        .filter((expense) => expense.active)
        .map((expense) => ({
          title: expense.title,
          amount: 0,
          active: expense.active,
          category: expense.category
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
          category: title.category,
          active: true,
        });
      }
    });
    const finalTitles = Array.from(existingTitlesMap.values());
    // Calculate total expenses
    const totalExpenses = finalTitles.reduce(
      (total, title) => total + title.amount,
      0
    );

    // Prepare data for the specified month
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
        category: title.category,
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


// Copy the previous months data
exports.copyPreviousMonthData = async (req, res) => {
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
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    // Get the index of the provided month
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1 || monthIndex === 0) {
      return res.status(400).json({
        statuscode: "1",
        message: "Invalid month provided or no previous month data available.",
      });
    }

    // Calculate the previous month and year
    const previousMonth = monthNames[monthIndex - 1];
    const previousYear = (monthIndex === 0) ? year - 1 : year; // Adjust year if it's January

    // Find the previous month's allocation
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

    // Prepare new data based on the previous month's allocation
    const newAllocationData = {
      userId: user._id,
      month,
      year,
      titles: previousAllocation.titles.map(title => ({
        title: title.title,
        category: title.category,
        amount: title.amount, // Copy the amount
        active: title.active, // Copy the active status
      })),
      totalExpenses: previousAllocation.totalExpenses, // Copy total expenses
      active: true,
    };

    // Create the new allocation for the current month
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

// post the subcategory values
exports.postSubCategoryValues = async (req, res) => {
  try {
    const { userId, month, year, selectedMaster, selectedCategory, amount } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    // Find the expense record for the user, month, and year
    const expenses = await ExpensesAllocation.findOne({ userId, month, year });
    if (!expenses) {
      return res.status(404).json({
        statuscode: "1",
        message: "Expenses record not found for the specified month and year",
      });
    }

    // Find the master category in the titles array
    const master = expenses.titles.find((title) => title.title === selectedMaster);
    console.log('expenses >>> ', expenses)
    if (!master) {
      const newMaster = new ExpensesMaster({
        active: true,
        category: [{
          title: selectedCategory,
          amount: amount
        }],
        title: selectedMaster,
        userId
      })
      await newMaster.save()
      expenses.titles.push({
        title: selectedMaster,
        amount: amount,
        active: true,
        category: [{
          title: selectedCategory,
          amount: amount
        }]
      })
      await expenses.save()
      let child = await ChildExpenses.findOne({ userId, title: 'Others' })
      console.log('CHILD >>>>> ', child)
      if (child) {
        child.category.push(selectedCategory)
      } else {
        child = new ChildExpenses({
          active: true,
          category: [selectedCategory],
          title: selectedMaster,
          expensesId: newMaster.id,
          userId
        })
      }
      await child.save()
      return res.status(201).json({
        statuscode: "0",
        message: "New Master Added successfully",
      })
    }

    // Find the subcategory within the master category
    const category = master.category.find((cat) => cat.title === selectedCategory);
    if (!category) {
      const rmaster = expenses.titles.find(i => i.title === selectedMaster)
      rmaster.category.push({
          title: selectedCategory,
          amount
      })
      await expenses.save()
      let child = await ChildExpenses.findOne({ userId, title: 'Others' })
      console.log('CHILD >>>>> ', child)
      if (child) {
        child.category.push(selectedCategory)
      } else {
        child = new ChildExpenses({
          active: true,
          category: [selectedCategory],
          title: selectedMaster,
          expensesId: newMaster.id,
          userId
        })
      }
      await child.save()
      return res.status(201).json({
        statuscode: "1",
        message: "Subcategory added successfully",
      });
    }

    // Update the amount of the subcategory
    category.amount = amount;

    // Save the updated expense record
    await expenses.save();

    return res.status(201).json({
      statuscode: "0",
      message: "Amount updated successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};


exports.getAll = async (req, res) => {
  const { userId, month, year } = req.body;
  try {
    // Try to find the requested month's data
    let allocation = await ExpensesAllocation.findOne({ userId, month, year });
    console.log(userId, month, year)
    if (!allocation) {

      // Fetch the previous month's data
      const previousAllocation = await ExpensesAllocation.findOne({
        userId
      });

      if (previousAllocation) {
        // Modify the previous month's data by setting all `amount` values to `0`
        const modifiedTitles = previousAllocation.titles.map(title => ({
          title: title.title,
          active: title.active,
          category: title.category,
          amount: 0,
        }));

        // Create a new entry for the requested month with the modified titles
        allocation = new ExpensesAllocation({
          userId,
          month,
          year,
          titles: modifiedTitles,
        });

        await allocation.save();

        return res.status(201).json({
          statusCode: "0",
          message: "Previous month's data copied with amount reset to 0 and saved for the new month",
          data: [allocation],
        });
      } else {
        return res.status(200).json({
          statusCode: "1",
          message: "No data found for the user"
        });
      }
    }

    // If the requested month's data exists, return it as is
    res.status(200).json({
      statusCode: "0",
      message: "Data fetched successfully",
      data: [allocation],
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
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
