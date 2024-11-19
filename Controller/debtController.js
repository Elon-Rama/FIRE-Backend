const moment = require("moment-timezone");
const DebtClearance = require("../Model/debtModel");
const User = require("../Model/emailModel");

exports.createDebt = async (req, res) => {
  //#swagger.tags = ['Debt-Clearance']
  try {
    const { userId, Source } = req.body;

    if (!userId || !Source || !Array.isArray(Source)) {
      return res.status(200).json({
        statusCode: "1",
        message:
          "Invalid request data. Please provide a valid userId and Source array.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    const currentDateTime = moment.tz("Asia/Kolkata");
    const currentDate = currentDateTime.format("YYYY-MM-DD");
    const currentTime = currentDateTime.format("HH:mm:ss");

    const enrichedSource = Source.map((loan) => ({
      ...loan,
      date: currentDate,
      time: currentTime,
    }));

    const existingDebt = await DebtClearance.findOne({ userId });

    if (existingDebt) {
      existingDebt.source.push(...enrichedSource);
      const updatedDebt = await existingDebt.save();

      return res.status(201).json({
        statusCode: "0",
        message: "Debt clearance updated successfully",
        userId: updatedDebt.userId,
        debtId: updatedDebt._id,
        data: {
          source: updatedDebt.source,
        },
      });
    } else {
      const newDebtClearance = new DebtClearance({
        userId,
        source: enrichedSource,
      });

      const savedDebt = await newDebtClearance.save();

      return res.status(201).json({
        statusCode: "0",
        message: "Debt clearance created successfully",
        userId: savedDebt.userId,
        debtId: savedDebt._id,
        data: {
          source: savedDebt.source,
        },
      });
    }
  } catch (error) {
    console.error("Error creating/updating debt clearance:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAllDebts = async (req, res) => {
  //#swagger.tags = ['Debt-Clearance']
  try {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    // Fetch debt clearance record for the user
    const debts = await DebtClearance.findOne({ userId });
    if (!debts) {
      return res.status(404).json({
        statusCode: "1",
        message: "No debt clearance records found for the user.",
      });
    }

    // Check if debts.source exists and is an array
    if (!Array.isArray(debts.source)) {
      return res.status(404).json({
        statusCode: "1",
        message: "Invalid debt clearance data.",
      });
    }

    // Calculate totals
    const totalPrinciple = debts.source.reduce((sum, item) => sum + item.principleAmount, 0);

    let totalInterestPayment = 0;
    let currentPaid = 0;

    debts.source.forEach((item) => {
      const interest = (item.principleAmount * item.interest * item.loanTenure) / 100;
      totalInterestPayment += interest;
      currentPaid += item.currentPaid;
    });

    const totalOwed = totalPrinciple + totalInterestPayment;

    // Prepare response
    const formattedDebt = {
      userId: debts.userId,
      source: debts.source,
      totalDebt: totalPrinciple,
      totalInterestPayment, // Calculated using Simple Interest
      currentPaid, // Total payments made so far
      totalOwed, // Total Debt + Total Interest
    };

    res.status(200).json({
      statusCode: "0",
      message: "Data retrieved successfully",
      data: [{formattedDebt}],
    });
  } catch (error) {
    console.error("Error fetching debt clearance records:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};






