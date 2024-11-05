// controllers/userSavingsController.js

const emergencyFund = require('../../Model/emergencyFundModel')
const User = require('../../Model/emailModel');

exports.create = async (req, res) => {
  const { monthlyExpenses, emergencyFundMonths, monthlySavings } = req.body;
  const userId = req.user.userId;

  try {
    // Validate input
    if (isNaN(monthlyExpenses) || isNaN(emergencyFundMonths) || isNaN(monthlySavings)) {
      return res.status(400).json({ error: 'monthlyExpenses, emergencyFundMonths, and monthlySavings must be valid numbers' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const totalEmergencyFund = monthlyExpenses * emergencyFundMonths;

    // Create a new UserSavings document
    const userSavings = new emergencyFund({
      userId,
      monthlyExpenses,
      emergencyFundMonths,
      monthlySavings,
      totalEmergencyFund,
    });

    await userSavings.save();

    res.status(201).json({
      message: 'Financial plan saved successfully',
      data: {
        monthlyExpenses,
        emergencyFundMonths,
        monthlySavings,
        totalEmergencyFund,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving the financial plan' });
  }
};
