const moment = require("moment-timezone");
const DebtClearance = require("../Model/debtModel");
const User = require("../Model/emailModel");

exports.createDebt = async (req, res) => {
  //#swagger.tags = ['Debt-Clearance']
  try {
    const { userId, source } = req.body;

    if (!userId || !source || !Array.isArray(source)) {
      return res.status(400).json({
        statusCode: "1",
        message:
          "Invalid request data. Please provide a valid userId and source array.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    const currentDateTime = moment.tz("Asia/Kolkata");
    const currentDate = currentDateTime.format("YYYY-MM-DD");
    const currentTime = currentDateTime.format("HH:mm:ss");
    const enrichedSource = source.map((loan) => {
      const monthlyInterestRate = loan.interest / 100 / 12;
      const totalMonths = loan.loanTenure * 12;

      const emi =
        (loan.principalAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

      const totalPayment = emi * totalMonths;
      const totalInterestPayment = totalPayment - loan.principalAmount;

      const outstandingBalance = loan.principalAmount - loan.currentPaid;

      return {
        ...loan,
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterestPayment: Math.round(totalInterestPayment),
        outstandingBalance: Math.round(outstandingBalance),
        date: currentDate,
        time: currentTime,
        paymentHistory: [],
      };
    });

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

    const debtClearance = await DebtClearance.findOne({ userId });

    if (!debtClearance) {
      return res.status(404).json({
        statusCode: "1",
        message: "No debt clearance records found for the user.",
      });
    }

    let totalDebt = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let totalOwed = 0;

    debtClearance.source.forEach((loan) => {
      totalDebt += loan.principalAmount;
      totalInterest += loan.totalInterestPayment;
      totalPaid += loan.currentPaid;
      totalOwed += loan.totalPayment - loan.currentPaid;

      let currentBalance = loan.principalAmount;
      loan.paymentHistory.forEach((payment, index) => {
        currentBalance -= payment.principalPaid;

        payment.remainingBalance = Math.max(0, currentBalance);
      });
    });

    return res.status(200).json({
      statusCode: "0",
      message: "Debt clearance records fetched successfully.",
      userId: debtClearance.userId,
      debtId: debtClearance._id,
      data: [
        {
          source: debtClearance.source,
          summary: {
            TotalDebt: Math.round(totalDebt),
            TotalInterest: Math.round(totalInterest),
            TotalPaid: Math.round(totalPaid),
            TotalOwed: Math.round(totalOwed),
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching debt clearance records:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.payEMI = async (req, res) => {
   //#swagger.tags = ['Debt-Clearance']
  try {
    const { userId, loanId, emiPaid } = req.body;

    if (!emiPaid) {
      return res.status(400).json({ message: "EMI amount is required." });
    }

    const debt = await DebtClearance.findOne({ userId });
    if (!debt) {
      return res.status(404).json({ message: "Debt record not found." });
    }

    const loan = debt.source.find((loan) => loan._id.toString() === loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    const monthlyInterestRate = loan.interest / 100 / 12;
    const interestForTheMonth = loan.outstandingBalance * monthlyInterestRate;

    if (emiPaid < interestForTheMonth) {
      return res
        .status(400)
        .json({ message: "EMI is too low to cover interest." });
    }

    const principalPaid = emiPaid - interestForTheMonth;

    loan.currentPaid += emiPaid;
    const currentDateTime = moment.tz("Asia/Kolkata");
    const currentDate = currentDateTime.format("YYYY-MM-DD");
    const currentMonth = moment().format("YYYY-MM");

    loan.paymentHistory.push({
      month: currentMonth,
      emiPaid,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interestForTheMonth),
      remainingBalance: Math.round(loan.outstandingBalance),
    });

    loan.outstandingBalance = Math.round(
      loan.outstandingBalance - principalPaid
    );

    await debt.save();

    return res.status(200).json({
      message: "EMI payment recorded successfully.",
      data: {
        loanId: loan._id,
        emiPaid,
        interestPaid: Math.round(interestForTheMonth),
        principalPaid: Math.round(principalPaid),
        currentPaid: loan.currentPaid,
        outstandingBalance: Math.round(loan.outstandingBalance),
        date: currentDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
