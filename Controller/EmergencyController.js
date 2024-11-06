const EmergencyFund = require("../Model/EmergencyModel");
const User = require("../Model/emailModel");

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
  };
};

exports.createEmergencyFund = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const {
    userId,
    monthlyExpenses,
    monthsNeeded,
    savingsPerMonth,
    initialEntry,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const expectedFund = monthlyExpenses * monthsNeeded;

    const entries = [];
    if (initialEntry) {
      const { amount, rateOfInterest, savingsMode } = initialEntry;
      const { date, time } = getCurrentDateTime();

      const entry = {
        date,
        time,
        amount,
        rateOfInterest,
        savingsMode,
      };
      entries.push(entry);
    }

    const actualFund = initialEntry ? [{ Entry: entries }] : [];

    const emergencyFund = new EmergencyFund({
      userId,
      monthlyExpenses,
      monthsNeeded,
      savingsPerMonth,
      expectedFund,
      actualFund,
      entries,
    });

    await emergencyFund.save();

    res.status(200).json({
      statusCode: "0",
      message: "Emergency Fund created successfully",
      data: emergencyFund,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const { userId } = req.query;

  try {
    const emergency = await EmergencyFund.find({ userId });

    if (emergency.length === 0) {
      return res.status(200).json({
        statusCode: "1",
        message: "No Expenses found for the provided userId",
      });
    }

    res.status(200).json({
      statusCode: "0",
      message: "Expenses retrieved successfully",
      data: emergency,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};
