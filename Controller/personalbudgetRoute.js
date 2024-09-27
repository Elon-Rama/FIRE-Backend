const PersonalBudget = require("../Model/personalModel");
const User = require("../Model/emailModel");

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

exports.Create = async (req, res) => {
  try {
    const {
      month,
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

    const totalExpenses =
      housing +
      entertainment +
      transportation +
      loans +
      insurance +
      taxes +
      food +
      savingsAndInvestments +
      pets +
      giftsAndDonations +
      personalCare +
      legal;

    const newBudget = new PersonalBudget({
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
      },
      totalExpenses,
      userId,
    });

    await newBudget.save();

    return res.status(201).json({
      message: "Budget entry created successfully",
      budget: {
        month: newBudget.month,
        year: newBudget.year,
        categories: {
          housing: formatAmount(newBudget.categories.housing),
          entertainment: formatAmount(newBudget.categories.entertainment),
          transportation: formatAmount(newBudget.categories.transportation),
          loans: formatAmount(newBudget.categories.loans),
          insurance: formatAmount(newBudget.categories.insurance),
          taxes: formatAmount(newBudget.categories.taxes),
          food: formatAmount(newBudget.categories.food),
          savingsAndInvestments: formatAmount(
            newBudget.categories.savingsAndInvestments
          ),
          pets: formatAmount(newBudget.categories.pets),
          giftsAndDonations: formatAmount(
            newBudget.categories.giftsAndDonations
          ),
          personalCare: formatAmount(newBudget.categories.personalCare),
          legal: formatAmount(newBudget.categories.legal),
        },
        totalExpenses: formatAmount(newBudget.totalExpenses),
        userId: newBudget.userId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create budget entry",
      error: error.message,
    });
  }
};
