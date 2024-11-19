// const Debt = require("../Model/debtModel");
// const moment = require("moment-timezone");
// const User = require("../Model/emailModel");

// const calculateLoanData = (amount, rateOfInterest, EMI) => {
//   const totalInterest = (amount * rateOfInterest) / 100;
//   const debtAmount = amount + totalInterest;

//   const totalMonths = Math.ceil(debtAmount / EMI);

//   const years = Math.floor(totalMonths / 12);
//   const extraMonths = totalMonths % 12;
//   const yearstorepaid = `${years} years ${extraMonths} months`;

//   return { debtAmount, yearstorepaid, totalMonths };
// };

// exports.createDebt = async (req, res) => {
//   //#swagger.tags = ['Debt-clearance']
//   try {
//     const { userId, source } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "User not found",
//       });
//     }

//     const existingDebt = await Debt.findOne({ userId });

//     let totalMonths = 0;

//     const processedLoans = source.map((loan) => {
//       const {
//         debtAmount,
//         yearstorepaid,
//         totalMonths: loanMonths,
//       } = calculateLoanData(
//         parseFloat(loan.amount),
//         loan.RateofInterest,
//         loan.EMI
//       );

//       totalMonths += loanMonths;

//       return {
//         ...loan,
//         amount: parseFloat(loan.amount),
//         debtAmount: debtAmount.toFixed(2),
//         yearstorepaid,
//         RemainingBalance: debtAmount.toFixed(2),
//       };
//     });

//     if (existingDebt) {
//       existingDebt.source = [...existingDebt.source, ...processedLoans];

//       const updatedDebtAmount = existingDebt.source.reduce(
//         (sum, loan) => sum + parseFloat(loan.debtAmount),
//         0
//       );

//       const updatedRemainingBalance = existingDebt.source.reduce(
//         (sum, loan) => sum + parseFloat(loan.RemainingBalance),
//         0
//       );

//       existingDebt.debtAmount = updatedDebtAmount.toFixed(2);
//       existingDebt.RemainingBalance = updatedRemainingBalance.toFixed(2);
//       await existingDebt.save();

//       const totalDebt = existingDebt.source.reduce(
//         (sum, loan) => sum + parseFloat(loan.debtAmount),
//         0
//       );

//       const totalMonthsConsolidated = existingDebt.source.reduce(
//         (sum, loan) =>
//           sum +
//           calculateLoanData(
//             parseFloat(loan.amount),
//             loan.RateofInterest,
//             loan.EMI
//           ).totalMonths,
//         0
//       );

//       const consolidatedYearstorepaid = `${Math.floor(
//         totalMonthsConsolidated / 12
//       )} years ${totalMonthsConsolidated % 12} months`;

//       return res.status(200).json({
//         statusCode: "0",
//         message: "Debt clearance data updated successfully",
//         userId,
//         data: {
//           ...existingDebt._doc,
//           TotalDebt: totalDebt.toFixed(2),
//           yearstorepaid: consolidatedYearstorepaid,
//         },
//       });
//     } else {
//       const debt = new Debt({ userId, source: processedLoans });
//       const savedDebt = await debt.save();

//       const totalDebt = processedLoans.reduce(
//         (sum, loan) => sum + parseFloat(loan.debtAmount),
//         0
//       );

//       const consolidatedYearstorepaid = `${Math.floor(
//         totalMonths / 12
//       )} years ${totalMonths % 12} months`;

//       res.status(201).json({
//         statusCode: "0",
//         message: "Debt clearance data created successfully",
//         userId,
//         data: {
//           _id: savedDebt._id,
//           debtAmount: totalDebt.toFixed(2),
//           yearstorepaid: consolidatedYearstorepaid,
//           source: processedLoans,
//           RemainingBalance: processedLoans
//             .reduce((sum, loan) => sum + parseFloat(loan.RemainingBalance), 0)
//             .toFixed(2),
//           TotalDebt: totalDebt.toFixed(2),
//         },
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ statusCode: "1", message: error.message });
//   }
// };

// exports.getAllDebts = async (req, res) => {
//   //#swagger.tags = ['Debt-clearance']
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({
//         statusCode: "1",
//         message: "User ID is required",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         statusCode: "1",
//         message: "User not found",
//       });
//     }

//     const debts = await Debt.findOne({ userId });

//     if (!debts) {
//       return res.status(404).json({
//         statusCode: "1",
//         message: "No debt records found for this user",
//       });
//     }

//     const totalDebt = debts.source.reduce(
//       (sum, loan) => sum + parseFloat(loan.debtAmount),
//       0
//     );

//     const totalMonths = debts.source.reduce(
//       (sum, loan) =>
//         sum +
//         calculateLoanData(
//           parseFloat(loan.amount),
//           loan.RateofInterest,
//           loan.EMI
//         ).totalMonths,
//       0
//     );

//     const consolidatedYearstorepaid = `${Math.floor(totalMonths / 12)} years ${
//       totalMonths % 12
//     } months`;

//     return res.status(200).json({
//       statusCode: "0",
//       message: "Debt records retrieved successfully",
//       userId,
//       data: {
//         ...debts._doc,
//         TotalDebt: totalDebt.toFixed(2),
//         yearstorepaid: consolidatedYearstorepaid,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       statusCode: "1",
//       message: error.message,
//     });
//   }
// };


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

    if (!userId) {
      return res.status(200).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    // Fetch debt clearance records for the user
    const debtClearance = await DebtClearance.findOne({ userId });

    if (!debtClearance) {
      return res.status(200).json({
        statusCode: "1",
        message: "No debt clearance records found for the user.",
      });
    }

    // Calculate the additional fields
    const totalDebt = debtClearance.source.reduce((sum, loan) => sum + loan.principleAmount, 0);
    const totalInterest = debtClearance.source.reduce((sum, loan) => {
      return sum + (loan.principleAmount * loan.interest) / 100;
    }, 0);
    const totalPaid = debtClearance.source.reduce((sum, loan) => sum + loan.currentPaid, 0);
    const totalOwed = totalDebt + totalInterest - totalPaid;

    return res.status(200).json({
      statusCode: "0",
      message: "Debt clearance records fetched successfully.",
      userId: debtClearance.userId,
      debtId: debtClearance._id,
      data: {
        source: debtClearance.source,
        TotalDebt: totalDebt,
        TotalInterest: totalInterest,
        TotalOwed: totalOwed,
        totalPaid: totalPaid,
      },
    });
  } catch (error) {
    console.error("Error fetching debt clearance records:", error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};