// const ChildExpenses = require("../Model/ChildExpensesModel");
// const ExpensesMaster = require("../Model/expensesModel");
// const _ = require("lodash");
// const User = require("../Model/emailModel");

// // exports.upsert = async (req, res) => {
// //   //#swagger.tags = ['Child-Expenses']
// //   const { expensesId, category, userId } = req.body;

// //   try {
// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(400).json({
// //         statusCode: "1",
// //         message: "User not found",
// //       });
// //     }

// //     const expenses = await ExpensesMaster.findById(expensesId);
// //     if (!expenses) {
// //       return res.status(400).json({
// //         statusCode: "1",
// //         message: "Expenses ID does not exist",
// //       });
// //     }

// //     const expensesTitle = await ExpensesMaster.findOne(title);
// //     if(!expensesTitle) {
// //       return res.status(400).json({
// //         statusCode: "1",
// //         message: "Expenses title does not exist",
// //       });
// //     }

// //     if (
// //       !Array.isArray(category) ||
// //       category.some((cat) => typeof cat !== "string")
// //     ) {
// //       return res.status(400).json({
// //         statusCode: "1",
// //         message: "Category must be an array of strings",
// //       });
// //     }

// //     const existingSubCategory = await ChildExpenses.findOne({ expensesId });

// //     if (existingSubCategory) {
// //       const updatedSubCategory = await ChildExpenses.findByIdAndUpdate(
// //         existingSubCategory._id,
// //         { $addToSet: { category: { $each: category } } },
// //         { new: true }
// //       );

// //       return res.status(200).json({
// //         statusCode: "0",
// //         message: "SubCategory updated successfully",
// //         data: updatedSubCategory,
// //       });
// //     } else {
// //       const newSubCategory = new ChildExpenses({
// //         userId,
// //         expensesId,
// //         title,
// //         category,
// //         active: true,
// //       });

// //       await newSubCategory.save();

// //       return res.status(201).json({
// //         statusCode: "0",
// //         message: "SubCategory created successfully",
// //         data: newSubCategory,
// //       });
// //     }
// //   } catch (error) {
// //     return res.status(500).json({
// //       statusCode: "1",
// //       message: error.message,
// //     });
// //   }
// // };

// exports.upsert = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']
//   const { expensesId, category, userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "User not found",
//       });
//     }

//     const expenses = await ExpensesMaster.findById(expensesId);
//     if (!expenses) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "Expenses ID does not exist",
//       });
//     }

//     if (
//       !Array.isArray(category) ||
//       category.some((cat) => typeof cat !== "string")
//     ) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "Category must be an array of strings",
//       });
//     }

//     const existingSubCategory = await ChildExpenses.findOne({ expensesId });

//     if (existingSubCategory) {
//       const updatedSubCategory = await ChildExpenses.findByIdAndUpdate(
//         existingSubCategory._id,
//         { $addToSet: { category: { $each: category } } },
//         { new: true }
//       );

//       return res.status(201).json({
//         statusCode: "0",
//         message: "SubCategory updated successfully",
//         title: expenses.title,
//         data: {
//           ...updatedSubCategory._doc,
//         },
//       });
//     } else {
//       const newSubCategory = new ChildExpenses({
//         userId,
//         expensesId,
//         category,
//         active: true,
//       });

//       await newSubCategory.save();

//       return res.status(201).json({
//         statusCode: "0",
//         message: "SubCategory created successfully",
//         title: expenses.title,
//         data: {
//           ...newSubCategory._doc,
//         },
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       statusCode: "1",
//       message: error.message,
//     });
//   }
// };

// exports.getAll = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']
//   try {
//     const { userId } = req.query;
//     console.log(userId);
//     const userVerify = await ChildExpenses.findOne({ userId });

//     if (!userId) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "userId is required",
//       });
//     } else if (!userVerify) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "user can not be found",
//       });
//     }
//     const categories = await ChildExpenses.find().populate(
//       "expensesId",
//       "title"
//     );
//     res.status(200).json({
//       statusCode: "0",
//       message: "subCategories data retrived Successfully",
//       data: categories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       statusCode: "1",
//       message: "Failed to retrived subcategories data",
//     });
//   }
// };

// exports.delete = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']

//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(200).json({
//         message: "ChildExpenses ID is required",
//         statusCode: "1",
//       });
//     }

//     const deletedExpense = await ChildExpenses.findByIdAndDelete(id);

//     if (!deletedExpense) {
//       return res.status(200).json({
//         message: "ChildExpenses not found",
//         statusCode: "1",
//       });
//     }

//     return res.status(201).json({
//       message: "ChildExpenses deleted successfully",
//       data: deletedExpense,
//       statusCode: "0",
//     });
//   } catch (error) {
//     console.error("Error in deleting child expenses:", error);
//     return res.status(200).json({
//       message: "Internal server error",
//       statusCode: "1",
//     });
//   }
// };

// exports.search = async (req, res) => {
//   //#swagger.tags = ['Child-Expenses']

//   const searchTerm = req.query.searchTerm;

//   try {
//     if (!searchTerm) {
//       return res.status(200).json({
//         message: "Search term is required",
//         data: [],
//         statusCode: "1",
//       });
//     }

//     const searchResult = await ChildExpenses.find({
//       category: { $regex: new RegExp(searchTerm, "i") },
//     }).populate("expensesId", "title");

//     if (searchResult.length === 0) {
//       return res.status(200).json({
//         message: "No matching results found",
//         data: [],
//         statusCode: "0",
//       });
//     }

//     return res.status(201).json({
//       message: "ChildExpenses retrieved successfully",
//       data: searchResult.map((expense) => ({
//         _id: expense._id,
//         expensesId: expense.expensesId,
//         category: expense.category.filter((cat) => cat.includes(searchTerm)),
//         createdAt: expense.createdAt,
//         updatedAt: expense.updatedAt,
//       })),
//       statusCode: "0",
//     });
//   } catch (err) {
//     console.error("Error in searching child expenses:", err);
//     return res.status(200).json({
//       statusCode: "1",
//       message: "Internal server error",
//     });
//   }
// };

const ChildExpenses = require("../Model/ChildExpensesModel");
const ExpensesMaster = require("../Model/expensesModel");
const User = require("../Model/emailModel");
const ExpensesAllocation = require("../Model/ExpensesAllocation");


exports.upsert = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { expensesId, category, userId } = req.body;

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

    const existingSubCategory = await ChildExpenses.findOne({ expensesId });

    // Retrieve or create ExpensesAllocation for the user
    let allocationExpenses = await ExpensesAllocation.findOne({
      userId,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear().toString(),
    });

    if (!allocationExpenses) {
      allocationExpenses = new ExpensesAllocation({
        userId,
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        titles: [], // Initialize titles as an empty array
      });
    }

    // If the subcategory exists, update it
    if (existingSubCategory) {
      const updatedSubCategory = await ChildExpenses.findByIdAndUpdate(
        existingSubCategory._id,
        { $addToSet: { category: { $each: category } } },
        { new: true }
      );

      const masterSubcategories = category.map(item => ({ title: item, amount: 0 }));
      expenses.category = [
        ...expenses.category,
        ...masterSubcategories
      ];
      await expenses.save();

      // Update the titles in ExpensesAllocation
      for (const item of masterSubcategories) {
        // Check if title exists
        const titleIndex = allocationExpenses.titles.findIndex(t => t.title === expenses.title);
        console.log('Iten .>>>', allocationExpenses)
        if (titleIndex !== -1) {
          // If title exists, check if category exists
          const categoryIndex = allocationExpenses.titles[titleIndex].category.findIndex(cat => cat.title === item.title);
          console.log('CA Index .>>>', categoryIndex)
          if (categoryIndex === -1) {
            // If category does not exist, push new category
            allocationExpenses.titles[titleIndex].category.push({ title: item.title, amount: 0 });
          }
        } else {
          // If title does not exist, create new title with category
          allocationExpenses.titles.push({
            title: item.title,
            category: [{ title: item.title, amount: 0 }], // Initialize category
            amount: 0, // Initialize amount
            active: true // Assuming new titles are active
          });
        }
      }
      await allocationExpenses.save();

      return res.status(201).json({
        statusCode: "0",
        message: "SubCategory updated successfully",
        title: expenses.title,
        data: {
          ...updatedSubCategory._doc,
        },
      });
    } else {
      // If the subcategory doesn't exist, create a new one
      const newSubCategory = new ChildExpenses({
        userId,
        expensesId,
        title: expenses.title,
        category,
        active: true,
      });

      await newSubCategory.save();

      // Update the titles in ExpensesAllocation
      for (const item of category) {
        // Check if title exists
        const titleIndex = allocationExpenses.titles.findIndex(t => t.title === expenses.title);
        if (titleIndex !== -1) {
          // If title exists, check if category exists
          const categoryIndex = allocationExpenses.titles[titleIndex].category.findIndex(cat => cat.title === item);
          if (categoryIndex === -1) {
            // If category does not exist, push new category
            allocationExpenses.titles[titleIndex].category.push({ title: item, amount: 0 });
          }
        } else {
          // If title does not exist, create new title with category
          allocationExpenses.titles.push({
            title: item,
            category: [{ title: item, amount: 0 }], // Initialize category
            amount: 0, // Initialize amount
            active: true // Assuming new titles are active
          });
        }
      }
      await allocationExpenses.save();

      return res.status(201).json({
        statusCode: "0",
        message: "SubCategory created successfully",
        data: {
          ...newSubCategory._doc,
        },
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

    const userVerify = await ChildExpenses.findOne({ userId });
    if (!userVerify) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const categories = await ChildExpenses.find({ userId });
    res.status(200).json({
      statusCode: "0",
      message: "SubCategories data retrieved successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve subcategories data",
    });
  }
};

//Get ChildExpenses by the master name
exports.getChildByMaster = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  try {
    const { userId, title } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        statusCode: "1",
        message: "userId or title is missing",
      });
    }

    const subData = await ChildExpenses.findOne({ title, userId });
    if (!subData) {
      return res.status(404).json({
        statusCode: "1",
        message: "No Data found",
      });
    }

    // const categories = await ChildExpenses.find().populate("expensesId", "title");
    res.status(200).json({
      statusCode: "0",
      message: "SubCategories data retrieved successfully",
      data: subData,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve subcategories data",
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "ChildExpenses ID is required",
        statusCode: "1",
      });
    }

    const deletedExpense = await ChildExpenses.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({
        message: "ChildExpenses not found",
        statusCode: "1",
      });
    }

    return res.status(200).json({
      message: "ChildExpenses deleted successfully",
      data: deletedExpense,
      statusCode: "0",
    });
  } catch (error) {
    console.error("Error in deleting child expenses:", error);
    return res.status(500).json({
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
      return res.status(400).json({
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
    return res.status(500).json({
      statusCode: "1",
      message: "Internal server error",
    });
  }
};
