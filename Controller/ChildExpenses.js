const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");
const _ = require("lodash");
const User = require("../Model/emailModel");

exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id, expensesId, category, userId } = req.body;

    if (!userId || !expensesId || !category || !Array.isArray(category)) {
      return res.status(200).json({
        message: "UserId, ExpensesId, and category (array) are required",
        statusCode: "1",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(200).json({
        message: "User not found",
        statusCode: "1",
      });
    }

    const existingChildExpense = await ChildExpenses.findOne({ expensesId });

    if (existingChildExpense) {
      const existingCategories = existingChildExpense.category;
      const duplicates = category.filter((cat) =>
        existingCategories.includes(cat)
      );

      if (duplicates.length > 0) {
        return res.status(200).json({
          message: `Category(ies) [${duplicates.join(
            ", "
          )}] already exist(s) in ChildExpenses`,
          statusCode: "1",
        });
      }

      const updatedCategories = [...existingCategories, ...category];
      existingChildExpense.category = updatedCategories;
      existingChildExpense.userId = userId;
      await existingChildExpense.save();

      const populatedExpense = await existingChildExpense.populate(
        "expensesId",
        "title"
      );

      return res.status(201).json({
        message: "Categories updated successfully",
        userId,
        id: existingChildExpense._id,
        data: {
          expensesId,
          category: populatedExpense.category,
        },
        statusCode: "0",
      });
    }

    const newChildExpense = new ChildExpenses({
      expensesId,
      category,
      userId,
    });

    const savedExpense = await newChildExpense.save();
    const populatedExpense = await savedExpense.populate("expensesId", "title");

    return res.status(201).json({
      message: "Categories are created successfully",

      userId,
      id: newChildExpense._id,
      data: {
        expensesId,
        category: populatedExpense.category,
      },
      statusCode: "0",
    });
  } catch (error) {
    console.error("Error in upserting child expenses:", error);
    return res.status(200).json({
      message: "Internal server error",
      statusCode: "1",
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const subcategory = await ChildExpenses.find();
    return res.status(201).json({
      message: "ChildExpenses fetched successfully",
      data: subcategory,
      statusCode: "0",
    });
  } catch (error) {
    console.error("Error in fetching child expenses:", error);
    return res.status(200).json({
      message: "Internal server error",
      statusCode: "1",
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
