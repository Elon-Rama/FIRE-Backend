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

    const now = new Date();
    const responseDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // Months are zero-indexed
      date: now.getDate(),
      time: now.toLocaleTimeString(), // You can customize the format as needed
    };

    res.status(201).json({
      statusCode: 201,
      message: 'Financial plan saved successfully',
      data: {
        monthlyExpenses,
        emergencyFundMonths,
        monthlySavings,
        totalEmergencyFund,
      },
      responseDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while saving the financial plan'
    });
  }
};
