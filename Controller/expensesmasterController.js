const ExpensesMaster = require("../Model/expensesModel");
const ChildExpenses = require("../Model/ChildExpensesModel");
const User = require("../Model/emailModel");
const ExpensesAllocation = require("../Model/ExpensesAllocation");
const RealityExpenses = require("../Model/Reality/ExpensesRealityModel");

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
      // Toggle the active status of the parent expense
      expenses.active = !expenses.active;
      await expenses.save();

      // Update active status in ChildExpenses
      const updatedChildren = await ChildExpenses.updateMany(
        { expensesId: req.params.expenses_id },
        { active: expenses.active }
      );

      // Update active status in ExpensesAllocation
      const updatedAllocations = await ExpensesAllocation.updateMany(
        { "titles.title": expenses.title },
        { $set: { "titles.$.active": expenses.active } } 
      );

      // Update active status in RealityExpenses
      const updatedRealityExpenses = await RealityExpenses.updateMany(
        { "titles.title": expenses.title, userId: expenses.userId },
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
          updatedRealityExpenses,
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

