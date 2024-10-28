const RealityExpenses = require("../../Model/Reality/ExpensesRealityModel");
const User = require("../../Model/emailModel");
const ExpensesMaster = require("../../Model/ExpensesAllocation");
const ChildExpenses = require("../../Model/ChildExpensesModel");
const moment = require("moment");

exports.upsert = async (req, res) => {
   //#swagger.tags = ['RealityExpenses']
  try {
    const { userId, title } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const currentMonth = moment().format("MMMM");
    const currentYear = moment().format("YYYY");

    let updatedTitles = title || [];
    if (!updatedTitles.length) {
      const expensesMaster = await ExpensesMaster.find({ userId });
      console.log("Fetched ExpensesMaster:", expensesMaster);
      updatedTitles = await Promise.all(
        expensesMaster.map(async (expense) => {
          const subCategories = await ChildExpenses.find({
            parentExpenseId: expense._id,
          });
          return {
            title: expense.title,
            active: expense.active,
            category: subCategories.map((sub) => ({
              name: sub.name,
              amount: 0,
            })),
          };
        })
      );
      console.log("Updated Titles:", updatedTitles);
    }

    const totalExpenses = updatedTitles.reduce((total, item) => {
      return (
        total +
        (item.category || []).reduce(
          (subTotal, sub) => subTotal + (sub.amount || 0),
          0
        )
      );
    }, 0);

    const updateData = {
      userId: user._id,
      month: currentMonth,
      year: currentYear,
      title: updatedTitles,
      totalExpenses,
    };

    const updatedRealityExpenses = await RealityExpenses.findOneAndUpdate(
      { userId: user._id, month: currentMonth, year: currentYear },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const response = {
      statusCode: "0",
      message: "Reality Expenses created/updated successfully",
      userId: user._id,
      id: updatedRealityExpenses._id,
      Expenses: [
        {
          month: currentMonth,
          year: currentYear,
          titles: (updatedRealityExpenses.title || []).map((expense) => ({
            title: expense.title,
            active: expense.active,
            subCategory: (expense.category || []).map((cat) => ({
              name: cat.name,
              amount: cat.amount || 0,
            })),
          })),
          totalExpenses: updatedRealityExpenses.totalExpenses || 0,
        },
      ],
    };

    return res.status(201).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAll = async (req, res) => {
   //#swagger.tags = ['RealityExpenses']
  try {
    const { userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statuscode: "1",
        message: "User not found",
      });
    }

    const realityExpenses = await RealityExpenses.find({ userId });

    if (!realityExpenses.length) {
      return res.status(404).json({
        statuscode: "1",
        message: "No reality expenses found for this user",
      });
    }

    return res.status(200).json({
      statuscode: "0",
      message: "Reality expenses retrieved successfully",
      userId: user._id,
      expenses: realityExpenses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statuscode: "1",
      message: "Internal Server Error",
    });
  }
};
