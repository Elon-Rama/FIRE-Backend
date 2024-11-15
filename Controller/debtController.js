const Debt = require("../Model/debtModel");
const moment = require("moment-timezone");
const User = require("../Model/emailModel");

const calculateLoanData = (amount, rateOfInterest, EMI) => {
  const totalInterest = (amount * rateOfInterest) / 100;
  const debtAmount = amount + totalInterest;

  const totalMonths = Math.ceil(debtAmount / EMI);

  const years = Math.floor(totalMonths / 12);
  const extraMonths = totalMonths % 12;
  const yearstorepaid = `${years} years ${extraMonths} months`;

  return { debtAmount, yearstorepaid, totalMonths };
};

exports.createDebt = async (req, res) => {
     //#swagger.tags = ['Emergency-Fund']
  try {
    const { userId, source } = req.body;

    // Check if the user exists in the User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    // Check if there's existing debt data for the user
    const existingDebt = await Debt.findOne({ userId });

    let totalMonths = 0;

    // Process the new loans
    const processedLoans = source.map((loan) => {
      const {
        debtAmount,
        yearstorepaid,
        totalMonths: loanMonths,
      } = calculateLoanData(
        parseFloat(loan.amount),
        loan.RateofInterest,
        loan.EMI
      );

      totalMonths += loanMonths;

      return {
        ...loan,
        amount: parseFloat(loan.amount),
        debtAmount: debtAmount.toFixed(2),
        yearstorepaid,
        RemainingBalance: debtAmount.toFixed(2),
      };
    });

    if (existingDebt) {
      // Update the existing document with new loans
      existingDebt.source = [...existingDebt.source, ...processedLoans];

      // Recalculate debt amount and remaining balance
      const updatedDebtAmount = existingDebt.source.reduce(
        (sum, loan) => sum + parseFloat(loan.debtAmount),
        0
      );

      const updatedRemainingBalance = existingDebt.source.reduce(
        (sum, loan) => sum + parseFloat(loan.RemainingBalance),
        0
      );

      existingDebt.debtAmount = updatedDebtAmount.toFixed(2);
      existingDebt.RemainingBalance = updatedRemainingBalance.toFixed(2);
      await existingDebt.save();

      // Calculate consolidated values for the response
      const totalDebt = existingDebt.source.reduce(
        (sum, loan) => sum + parseFloat(loan.debtAmount),
        0
      );

      const totalMonthsConsolidated = existingDebt.source.reduce(
        (sum, loan) =>
          sum +
          calculateLoanData(
            parseFloat(loan.amount),
            loan.RateofInterest,
            loan.EMI
          ).totalMonths,
        0
      );

      const consolidatedYearstorepaid = `${Math.floor(
        totalMonthsConsolidated / 12
      )} years ${totalMonthsConsolidated % 12} months`;

      return res.status(200).json({
        statusCode: "0",
        message: "Debt clearance data updated successfully",
        userId,
        data: {
          ...existingDebt._doc,
          TotalDebt: totalDebt.toFixed(2),
          yearstorepaid: consolidatedYearstorepaid,
        },
      });
    } else {
      // Create a new document if no existing debt data is found
      const debt = new Debt({ userId, source: processedLoans });
      const savedDebt = await debt.save();

      // Calculate consolidated values for the response
      const totalDebt = processedLoans.reduce(
        (sum, loan) => sum + parseFloat(loan.debtAmount),
        0
      );

      const consolidatedYearstorepaid = `${Math.floor(
        totalMonths / 12
      )} years ${totalMonths % 12} months`;

      res.status(201).json({
        statusCode: "0",
        message: "Debt clearance data created successfully",
        userId,
        data: {
          _id: savedDebt._id,
          debtAmount: totalDebt.toFixed(2),
          yearstorepaid: consolidatedYearstorepaid,
          source: processedLoans,
          RemainingBalance: processedLoans
            .reduce((sum, loan) => sum + parseFloat(loan.RemainingBalance), 0)
            .toFixed(2),
          TotalDebt: totalDebt.toFixed(2),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ statusCode: "1", message: error.message });
  }
};

exports.getAllDebts = async (req, res) => {
     //#swagger.tags = ['Emergency-Fund']
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        statusCode: "1",
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: "1",
        message: "User not found",
      });
    }

    const debts = await Debt.findOne({ userId });

    if (!debts) {
      return res.status(404).json({
        statusCode: "1",
        message: "No debt records found for this user",
      });
    }

    const totalDebt = debts.source.reduce(
      (sum, loan) => sum + parseFloat(loan.debtAmount),
      0
    );

    const totalMonths = debts.source.reduce(
      (sum, loan) =>
        sum +
        calculateLoanData(
          parseFloat(loan.amount),
          loan.RateofInterest,
          loan.EMI
        ).totalMonths,
      0
    );

    const consolidatedYearstorepaid = `${Math.floor(totalMonths / 12)} years ${
      totalMonths % 12
    } months`;

    return res.status(200).json({
      statusCode: "0",
      message: "Debt records retrieved successfully",
      userId,
      data: {
        ...debts._doc,
        TotalDebt: totalDebt.toFixed(2),
        yearstorepaid: consolidatedYearstorepaid,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: error.message,
    });
  }
};
