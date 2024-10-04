// const ExpensesAllocation = require("../Model/personalModel");
// const User = require("../Model/emailModel");

// const formatAmount = (amount) => {
//   return new Intl.NumberFormat("en-IN").format(amount);
// };

// exports.Create = async (req, res) => {
//   //#swagger.tags = ['User-Expenses Allocation']
//   try {
//     const {
//       month,
//       year,
//       housing,
//       entertainment,
//       transportation,
//       loans,
//       insurance,
//       taxes,
//       food,
//       savingsAndInvestments,
//       pets,
//       giftsAndDonations,
//       personalCare,
//       legal,
//       userId,
//     } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const existingBudget = await ExpensesAllocation.findOne({
//       month,
//       year,
//       userId,
//     });

//     if (existingBudget) {
//       return res.status(200).json({
//         message: `A budget for the month ${month} and year ${year} already exists for this user.`,
//       });
//     }

//     const totalExpenses =
//       Number(housing) +
//       Number(entertainment) +
//       Number(transportation) +
//       Number(loans) +
//       Number(insurance) +
//       Number(taxes) +
//       Number(food) +
//       Number(savingsAndInvestments) +
//       Number(pets) +
//       Number(giftsAndDonations) +
//       Number(personalCare) +
//       Number(legal);

//     const newBudget = new ExpensesAllocation({
//       month,
//       year,
//       categories: {
//         housing,
//         entertainment,
//         transportation,
//         loans,
//         insurance,
//         taxes,
//         food,
//         savingsAndInvestments,
//         pets,
//         giftsAndDonations,
//         personalCare,
//         legal,
//         totalExpenses,
//       },

//       userId,
//     });

//     await newBudget.save();

//     return res.status(201).json({
//       message: "Budget entry created successfully",
//       budget: {
//         id: newBudget._id,
//         month: newBudget.month,
//         year: newBudget.year,
//         categories: {
//           housing: formatAmount(newBudget.categories.housing),
//           entertainment: formatAmount(newBudget.categories.entertainment),
//           transportation: formatAmount(newBudget.categories.transportation),
//           loans: formatAmount(newBudget.categories.loans),
//           insurance: formatAmount(newBudget.categories.insurance),
//           taxes: formatAmount(newBudget.categories.taxes),
//           food: formatAmount(newBudget.categories.food),
//           savingsAndInvestments: formatAmount(
//             newBudget.categories.savingsAndInvestments
//           ),
//           pets: formatAmount(newBudget.categories.pets),
//           giftsAndDonations: formatAmount(
//             newBudget.categories.giftsAndDonations
//           ),
//           personalCare: formatAmount(newBudget.categories.personalCare),
//           legal: formatAmount(newBudget.categories.legal),
//           totalExpenses: formatAmount(newBudget.categories.totalExpenses),
//         },

//         userId: newBudget.userId,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to create budget entry",
//       error: error.message,
//     });
//   }
// };

const ExpensesAllocation = require("../Model/personalModel");
const User = require("../Model/emailModel");

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

// Define the months of the year as strings
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

exports.Create = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const {
      year,
      housing,
      entertainment,
      transportation,
      loans,
      insurance,
      taxes,
      food,
      savingsAndInvestments,
      pets,
      giftsAndDonations,
      personalCare,
      legal,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Iterate through each month
    for (let i = 0; i < months.length; i++) {
      const month = months[i];

      // Check if the budget already exists for this month and year
      const existingBudget = await ExpensesAllocation.findOne({
        month,
        year,
        userId,
      });

      if (!existingBudget) {
        // Calculate total expenses
        const totalExpenses =
          Number(housing) +
          Number(entertainment) +
          Number(transportation) +
          Number(loans) +
          Number(insurance) +
          Number(taxes) +
          Number(food) +
          Number(savingsAndInvestments) +
          Number(pets) +
          Number(giftsAndDonations) +
          Number(personalCare) +
          Number(legal);

        // Create new budget for the current month
        const newBudget = new ExpensesAllocation({
          month,
          year,
          categories: {
            housing,
            entertainment,
            transportation,
            loans,
            insurance,
            taxes,
            food,
            savingsAndInvestments,
            pets,
            giftsAndDonations,
            personalCare,
            legal,
            totalExpenses,
          },
          userId,
        });

        await newBudget.save();
      }
    }

    return res.status(201).json({
      message: "Budget entries created for all months in the year",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entries",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const budget = await ExpensesAllocation.findById(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { month, year, userId } = req.query;
    const {
      housing,
      entertainment,
      transportation,
      loans,
      insurance,
      taxes,
      food,
      savingsAndInvestments,
      pets,
      giftsAndDonations,
      personalCare,
      legal,
    } = req.body;

    const budget = await ExpensesAllocation.findOne({ month, year, userId });
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found for the selected month and year" });
    }

    const totalExpenses =
      Number(housing) +
      Number(entertainment) +
      Number(transportation) +
      Number(loans) +
      Number(insurance) +
      Number(taxes) +
      Number(food) +
      Number(savingsAndInvestments) +
      Number(pets) +
      Number(giftsAndDonations) +
      Number(personalCare) +
      Number(legal);

    budget.categories = {
      housing,
      entertainment,
      transportation,
      loans,
      insurance,
      taxes,
      food,
      savingsAndInvestments,
      pets,
      giftsAndDonations,
      personalCare,
      legal,
      totalExpenses,
    };

    await budget.save();

    return res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update budget",
      error: error.message,
    });
  }
};

exports.view = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { month, year, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const budget = await ExpensesAllocation.findOne({ month, year, userId });
    if (!budget) {
      return res.status(200).json({
        message: "No budget found for the selected month and year",
      });
    }

    return res.status(201).json({
      message: "Budget retrieved successfully",
      budget,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve budget",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['User-Expenses Allocation']
  try {
    const { id } = req.params;
    const budget = await ExpensesAllocation.findByIdAndDelete(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete budget",
      error: error.message,
    });
  }
};
