const ExpensesMaster = require("../Model/expensesModel");
const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesAllocation = require("../Model/ExpensesAllocation");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { userId, title, id } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    if (!id) {
      const existingTitle = await ExpensesMaster.findOne({ userId, title });
      if (existingTitle) {
        return res.status(200).json({
          statusCode: "1",
          message:
            "This title already exists. Please try again with a different title.",
        });
      }
    }

    if (id) {
      const updatedTitle = await ExpensesMaster.findByIdAndUpdate(
        id,
        { userId, title },
        { new: true, upsert: true }
      );
      res.status(201).json({
        statusCode: "0",
        message: "Categories Title updated successfully",
        data: updatedTitle,
      });
    } else {
      const newTitle = await new ExpensesMaster({
        userId,
        title,
        active: true,
      }).save();
      
    // Now update the ExpensesAllocation's titles array
    await ExpensesAllocation.findOneAndUpdate(
      { userId },
      {
        $push: {
          titles: {
            title: newTitle.title,
            active: newTitle.active,
            amount: 0,
          },
        },
      },
      { new: true, upsert: true }
    )
      
      res.status(201).json({
        statusCode: "0",
        message: "Categories Title created successfully",
        data: newTitle,
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { userId } = req.query;

  try {
    const expenses = await ExpensesMaster.find({ userId });

    if (expenses.length === 0) {
      return res.status(200).json({
        statusCode: "1",
        message: "No Expenses found for the provided userId",
      });
    }

    res.status(200).json({
      statusCode: "0",
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findOne({
      _id: req.params.expenses_id,
      active: true,
    });

    if (expenses) {
      res.status(200).json({
        statusCode: "0",
        message: "Expense data retrieved successfully",
        data: expenses,
      });
    } else {
      res.status(200).json({
        statusCode: "1",
        message: "Expense ID not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve expense data",
      error: error.message,
    });
  }
};

// exports.deleteById = async (req, res) => {
//   //#swagger.tags = ['Master-Expenses']
//   try {
//     const expenses = await ExpensesMaster.findById(req.params.expenses_id);

//     if (expenses) {
//       expenses.active = !expenses.active;
//       await expenses.save();

//       if (!expenses.active) {
//         await ExpensesMaster.findOne({ expensesId: req.params.expenses_id });
//         res.status(200).json({
//           statusCode: "0",
//           message: "Expense inactivated successfully",
//           data: expenses,
//         });
//       } else {
//         res.status(200).json({
//           statusCode: "0",
//           message: "Expense activated successfully",
//           data: expenses,
//         });
//       }
//     } else {
//       res.status(404).json({
//         statusCode: "1",
//         message: "No expense data found",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       statusCode: "1",
//       message: "Failed to update expense status",
//       error: error.message,
//     });
//   }
// };

exports.deleteById = async (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  try {
    const expenses = await ExpensesMaster.findById(req.params.expenses_id);

    if (expenses) {
      const previousStatus = expenses.active;
      expenses.active = !expenses.active;
      await expenses.save();

      // Find the affected allocations before updating
      const allocations = await ExpensesAllocation.find({
        "titles.title": expenses.title,
      });

      // Loop through each affected allocation to update totalExpenses
      for (const allocation of allocations) {
        const titleEntry = allocation.titles.find(
          (title) => title.title === expenses.title
        );

        if (titleEntry) {
          // Adjust the totalExpenses based on the active status change
          if (previousStatus && !expenses.active) {
            // If we're inactivating the expense, subtract its amount from totalExpenses
            allocation.totalExpenses -= titleEntry.amount;
            titleEntry.amount = 0;
            titleEntry.category.map(i => i.amount = 0)
          }

          // Ensure the totalExpenses doesn't go below zero
          allocation.totalExpenses = Math.max(0, allocation.totalExpenses);

          // Save the updated allocation
          await allocation.save();
        }
      }

      // Update the active status of child expenses and allocation titles
      const updatedChildren = await ChildExpenses.updateMany(
        { expensesId: req.params.expenses_id },
        { active: expenses.active }
      );
      const updatedAllocations = await ExpensesAllocation.updateMany(
        { "titles.title": expenses.title },
        { $set: { "titles.$.active": expenses.active } }
      );

      const message = expenses.active
        ? "Expense activated successfully"
        : "Expense inactivated successfully";

      res.status(200).json({
        statusCode: "0",
        message,
        data: {
          parent: expenses,
          updatedChildren,
          updatedAllocations,
        },
      });
    } else {
      res.status(404).json({
        statusCode: "1",
        message: "No expense data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Failed to update expense status",
      error: error.message,
    });
  }
};
