// const moment = require("moment-timezone");
// const DebtClearance = require("../Model/debtModel");
// const User = require("../Model/emailModel");

// exports.createDebt = async (req, res) => {
//   //#swagger.tags = ['Debt-Clearance']
//   try {
//     const { userId, Source } = req.body;

//     if (!userId || !Source || !Array.isArray(Source)) {
//       return res.status(200).json({
//         statusCode: "1",
//         message:
//           "Invalid request data. Please provide a valid userId and Source array.",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "User not found. Please provide a valid userId.",
//       });
//     }

//     const currentDateTime = moment.tz("Asia/Kolkata");
//     const currentDate = currentDateTime.format("YYYY-MM-DD");
//     const currentTime = currentDateTime.format("HH:mm:ss");

//     const enrichedSource = Source.map((loan) => {
//       const { principleAmount, interest, loanTenure, currentPaid } = loan;
//       const totalInterest = (principleAmount * interest * loanTenure) / 100;
//       const totalOwed = principleAmount + totalInterest;
//       const outstandingBalance = totalOwed - currentPaid;

//       return {
//         ...loan,
//         outstandingBalance, // Add outstandingBalance for each loan
//         date: currentDate,
//         time: currentTime,
//       };
//     });

//     const existingDebt = await DebtClearance.findOne({ userId });

//     let updatedDebt;

//     if (existingDebt) {
//       existingDebt.source.push(...enrichedSource);
//       updatedDebt = await existingDebt.save();
//     } else {
//       const newDebtClearance = new DebtClearance({
//         userId,
//         source: enrichedSource,
//       });
//       updatedDebt = await newDebtClearance.save();
//     }

//     // Prepare response with outstanding balances for each loan
//     const responseSource = updatedDebt.source.map((loan) => {
//       const { principleAmount, interest, loanTenure, currentPaid } = loan;
//       const totalInterest = (principleAmount * interest * loanTenure) / 100;
//       const totalOwed = principleAmount + totalInterest;
//       const outstandingBalance = totalOwed - currentPaid;

//       return {
//         ...loan._doc, // Include all loan properties
//         outstandingBalance, // Add outstandingBalance for response
//       };
//     });

//     return res.status(201).json({
//       statusCode: "0",
//       message: existingDebt
//         ? "Debt clearance updated successfully"
//         : "Debt clearance created successfully",
//       userId: updatedDebt.userId,
//       debtId: updatedDebt._id,
//       data: {
//         source: responseSource, // Include detailed loans with outstandingBalance
//       },
//     });
//   } catch (error) {
//     console.error("Error creating/updating debt clearance:", error);
//     res.status(500).json({
//       statusCode: "1",
//       message: "Internal Server Error",
//     });
//   }
// };

// exports.getAllDebts = async (req, res) => {
//   //#swagger.tags = ['Debt-Clearance']
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(400).json({
//         statusCode: "1",
//         message: "Invalid request. Please provide a valid userId.",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         statusCode: "1",
//         message: "User not found. Please provide a valid userId.",
//       });
//     }

//     const debts = await DebtClearance.find({ userId }).populate("userId");
//     if (!debts || debts.length === 0) {
//       return res.status(404).json({
//         statusCode: "1",
//         message: "No debt clearance records found for the user.",
//       });
//     }

//     const formattedDebts = debts.map((debt) => {
//       const totalPrinciple = debt.source.reduce(
//         (sum, item) => sum + (item.principleAmount || 0),
//         0
//       );

//       let totalInterestPayment = 0;
//       let currentPaid = 0;

//       debt.source.forEach((item) => {
//         const interest =
//           ((item.principleAmount || 0) *
//             (item.interest || 0) *
//             (item.loanTenure || 0)) /
//           100;
//         totalInterestPayment += interest;
//         currentPaid += item.currentPaid || 0;
//       });

//       const totalOwed = totalPrinciple + totalInterestPayment;

//       return {
//         userId: debt.userId._id,
//         source: debt.source,
//         totalDebt: totalPrinciple,
//         totalInterestPayment,
//         currentPaid,
//         totalOwed,
//       };
//     });

//     res.status(200).json({
//       statusCode: "0",
//       message: "Data retrieved successfully",
//       data: formattedDebts,
//     });
//   } catch (error) {
//     console.error("Error fetching debt clearance records:", error);
//     res.status(500).json({
//       statusCode: "1",
//       message: "Failed to retrieve debts due to a server error.",
//     });
//   }
// };

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

    // const enrichedSource = source.map((loan) => {
    //   const monthlyInterestRate = loan.interest / 100 / 12;
    //   const totalMonths = loan.loanTenure * 12;

    //   const emi =
    //     (loan.principleAmount *
    //       monthlyInterestRate *
    //       Math.pow(1 + monthlyInterestRate, totalMonths)) /
    //     (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

    //   const totalPayment = emi * totalMonths;
    //   const totalInterestPayment = totalPayment - loan.principleAmount;

    //   const outstandingBalance = totalPayment - loan.currentPaid;

    //   return {
    //     ...loan,
    //     emi: Math.round(emi),
    //     totalPayment: Math.round(totalPayment),
    //     totalInterestPayment: Math.round(totalInterestPayment),
    //     outstandingBalance: Math.round(outstandingBalance), // Add this field
    //     date: currentDate,
    //     time: currentTime,
    //   };
    // });
    const enrichedSource = source.map((loan) => {
      const monthlyInterestRate = loan.interest / 100 / 12;
      const totalMonths = loan.loanTenure * 12;
    
      const emi =
        (loan.principleAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    
      const totalPayment = emi * totalMonths;
      const totalInterestPayment = totalPayment - loan.principleAmount;
    
      const outstandingBalance = totalPayment - loan.currentPaid;
    
      return {
        ...loan,
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterestPayment: Math.round(totalInterestPayment),
        outstandingBalance: Math.round(outstandingBalance),
        date: currentDate,
        time: currentTime,
        paymentHistory: [], // Initialize paymentHistory as an empty array
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
      totalDebt += loan.principleAmount;
      totalInterest += loan.totalInterestPayment;
      totalPaid += loan.currentPaid;
      totalOwed += loan.totalPayment - loan.currentPaid;
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
    const loan = debt.source.find((loan) => loan._id.toString() === loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    const monthlyInterestRate = loan.interest / 100 / 12;
    const interestForTheMonth = loan.principleAmount * monthlyInterestRate;

    if (emiPaid < interestForTheMonth) {
      return res
        .status(400)
        .json({ message: "EMI is too low to cover interest." });
    }

    const principalPaid = emiPaid - interestForTheMonth;

    loan.currentPaid += emiPaid;
    loan.outstandingBalance -= principalPaid;

    // Add payment record to paymentHistory
    const currentMonth = moment().format("YYYY-MM");
    loan.paymentHistory.push({
      month: currentMonth,
      emiPaid,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interestForTheMonth),
      remainingBalance: Math.round(loan.outstandingBalance),
    });

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
        month: currentMonth, // Add the current month to the response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};


