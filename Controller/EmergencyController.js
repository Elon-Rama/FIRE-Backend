const EmergencyFund = require("../Model/EmergencyModel");
const User = require("../Model/emailModel");

const getCurrentDateTime = () => {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().split(" ")[0],
  };
};
exports.upsert = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  const {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const expectedFund = monthlyExpenses * monthsNeed;

    const entries = [];
    if (initialEntry) {
      const { amount, rateofInterest, savingsMode } = initialEntry;
      const { date, time } = getCurrentDateTime();

      const entry = {
        date,
        time,
        amount,
        rateofInterest,
        savingsMode,
      };

      entries.push(entry);
    }

    const actualFund = initialEntry ? [{ Entry: entries }] : [];

    if (emergencyId) {
      const updatedFund = await EmergencyFund.findById(emergencyId);

      if (!updatedFund) {
        return res.status(200).json({
          statusCode: "1",
          message: "Emergency Fund not found",
        });
      }

      if (initialEntry) {
        updatedFund.actualFund[0].Entry.push({
          date: entries[0].date,
          time: entries[0].time,
          amount: entries[0].amount,
          rateofInterest: entries[0].rateofInterest,
          savingsMode: entries[0].savingsMode,
        });
      }

      updatedFund.monthlyExpenses = monthlyExpenses;
      updatedFund.monthsNeed = monthsNeed;
      updatedFund.savingsperMonth = savingsperMonth;
      updatedFund.expectedFund = expectedFund;

      await updatedFund.save();

      return res.status(201).json({
        statusCode: "0",
        message: "Emergency Fund updated successfully",
        data: updatedFund,
      });
    } else {
      const emergencyFund = new EmergencyFund({
        userId,
        monthlyExpenses,
        monthsNeed,
        savingsperMonth,
        expectedFund,
        actualFund,
        entries,
      });

      await emergencyFund.save();

      return res.status(201).json({
        statusCode: "0",
        message: "Emergency Fund created successfully",
        data: emergencyFund,
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

exports.getById = async (req, res) => {
  //#swagger.tags = ['Emergency-Fund']
  try {
    const emergency = await EmergencyFund.findOne({ _id: req.params.emergency_id }); // Match parameter name
    if (emergency) {
      res.status(200).json({
        statusCode: "0",
        message: "Emergency Id retrieved successfully",
        data: emergency,
      });
    } else {
      res.status(404).json({
        message: "Emergency Id not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve emergency data",
    });
  }
};


exports.deleteById = async (req, res) => {
 //#swagger.tags = ['Emergency-Fund']
  try {
    const emergency = await EmergencyFund.findOne({ _id: req.params.emergency_id });
    if (emergency) {
      await EmergencyFund.deleteOne({_id: req.params.emergency_id });
      res.status(200).json({
        message: "emergency data deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "No emergency data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete a emergency ",
    });
  }
};
