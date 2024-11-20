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

    const enrichedSource = Source.map((loan) => {
      const { principleAmount, interest, loanTenure, currentPaid } = loan;
      const totalInterest = (principleAmount * interest * loanTenure) / 100;
      const totalOwed = principleAmount + totalInterest;
      const outstandingBalance = totalOwed - currentPaid;

      return {
        ...loan,
        outstandingBalance, // Add outstandingBalance for each loan
        date: currentDate,
        time: currentTime,
      };
    });

    const existingDebt = await DebtClearance.findOne({ userId });

    let updatedDebt;

    if (existingDebt) {
      existingDebt.source.push(...enrichedSource);
      updatedDebt = await existingDebt.save();
    } else {
      const newDebtClearance = new DebtClearance({
        userId,
        source: enrichedSource,
      });
      updatedDebt = await newDebtClearance.save();
    }

    // Prepare response with outstanding balances for each loan
    const responseSource = updatedDebt.source.map((loan) => {
      const { principleAmount, interest, loanTenure, currentPaid } = loan;
      const totalInterest = (principleAmount * interest * loanTenure) / 100;
      const totalOwed = principleAmount + totalInterest;
      const outstandingBalance = totalOwed - currentPaid;

      return {
        ...loan._doc, // Include all loan properties
        outstandingBalance, // Add outstandingBalance for response
      };
    });

    return res.status(201).json({
      statusCode: "0",
      message: existingDebt
        ? "Debt clearance updated successfully"
        : "Debt clearance created successfully",
      userId: updatedDebt.userId,
      debtId: updatedDebt._id,
      data: {
        source: responseSource, // Include detailed loans with outstandingBalance
      },
    });
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

    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    const debts = await DebtClearance.find({ userId }).populate("userId");
    if (!debts || debts.length === 0) {
      return res.status(404).json({
        statusCode: "1",
        message: "No debt clearance records found for the user.",
      });
    }

    const formattedDebts = debts.map((debt) => {
      const totalPrinciple = debt.source.reduce(
        (sum, item) => sum + (item.principleAmount || 0),
        0
      );

      let totalInterestPayment = 0;
      let currentPaid = 0;

      debt.source.forEach((item) => {
        const interest =
          ((item.principleAmount || 0) *
            (item.interest || 0) *
            (item.loanTenure || 0)) /
          100;
        totalInterestPayment += interest;
        currentPaid += item.currentPaid || 0;
      });

      const totalOwed = totalPrinciple + totalInterestPayment;

      return {
        userId: debt.userId._id,
        source: debt.source,
        totalDebt: totalPrinciple,
        totalInterestPayment,
        currentPaid,
        totalOwed,
      };
    });

    res.status(200).json({
      statusCode: "0",
      message: "Data retrieved successfully",
      data: formattedDebts,
    });
  } catch (error) {
    console.error("Error fetching debt clearance records:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve debts due to a server error.",
    });
  }
};
