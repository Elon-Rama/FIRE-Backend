const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");
const _ = require("lodash");
const User = require("../Model/emailModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id, expensesId, category, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const expenses = await ExpensesMaster.findById(expensesId);
    if (!expenses) {
      return res.status(400).json({
        statusCode: "1",
        message: "Expenses ID does not exist",
      });
    }

    if (
      !Array.isArray(category) ||
      category.some((cat) => typeof cat !== "string")
    ) {
      return res.status(400).json({
        statusCode: "1",
        message: "Category must be an array of strings",
      });
    }

    if (id) {
      const updatedsubCategory = await ChildExpenses.findByIdAndUpdate(
        id,
        { $addToSet: { category: { $each: category } } },
        { new: true }
      );

      if (!updatedsubCategory) {
        return res.status(404).json({
          statusCode: "1",
          message: "SubCategory not found",
        });
      }

      return res.status(200).json({
        statusCode: "0",
        message: "SubCategory updated successfully",
        data: updatedsubCategory,
      });
    } else {
      const newsubCategory = await new ChildExpenses({
        userId,
        expensesId,
        category,
      }).save();

      return res.status(201).json({
        statusCode: "0",
        data: newsubCategory,
        message: "SubCategory added successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "userId is required",
      });
    }
    const categories = await ChildExpenses.find();
    res.status(200).json({
      statusCode: '0',
      message: "subCategories data retrived Successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: '1',
      message: "Failed to retrived subcategories data",
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).json({
        message: "ChildExpenses ID is required",
        statusCode: "1",
      });
    }

    const deletedExpense = await ChildExpenses.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(200).json({
        message: "ChildExpenses not found",
        statusCode: "1",
      });
    }

    return res.status(201).json({
      message: "ChildExpenses deleted successfully",
      data: deletedExpense,
      statusCode: "0",
    });
  } catch (error) {
    console.error("Error in deleting child expenses:", error);
    return res.status(200).json({
      message: "Internal server error",
      statusCode: "1",
    });
  }
};

exports.search = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  const searchTerm = req.query.searchTerm;

  try {
    if (!searchTerm) {
      return res.status(200).json({
        message: "Search term is required",
        data: [],
        statusCode: "1",
      });
    }

    const searchResult = await ChildExpenses.find({
      category: { $regex: new RegExp(searchTerm, "i") },
    }).populate("expensesId", "title");

    if (searchResult.length === 0) {
      return res.status(200).json({
        message: "No matching results found",
        data: [],
        statusCode: "0",
      });
    }

    return res.status(201).json({
      message: "ChildExpenses retrieved successfully",
      data: searchResult.map((expense) => ({
        _id: expense._id,
        expensesId: expense.expensesId,
        category: expense.category.filter((cat) => cat.includes(searchTerm)),
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      })),
      statusCode: "0",
    });
  } catch (err) {
    console.error("Error in searching child expenses:", err);
    return res.status(200).json({
      statusCode: "1",
      message: "Internal server error",
    });
  }
};
