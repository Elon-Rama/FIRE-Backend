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

// exports.getAllDebts = async (req, res) => {
//   //#swagger.tags = ['Debt-Clearance']
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "Invalid request. Please provide a valid userId.",
//       });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "User not found. Please provide a valid userId.",
//       });
//     }

//     const debtClearance = await DebtClearance.findOne({ userId });

//     if (!debtClearance) {
//       return res.status(200).json({
//         statusCode: "1",
//         message: "No debt clearance records found for the user.",
//       });
//     }

//     let totalDebt = 0;
//     let totalInterest = 0;
//     let totalPaid = 0;

//     debtClearance.source.forEach((loan) => {
//       const principal = loan.principleAmount;
//       const interestRate = loan.interest / 100;
//       const emi = loan.emi;
//       const currentPaid = loan.currentPaid;

//       totalPaid += currentPaid;

//       const loanInterest = principal * interestRate;

//       totalDebt += principal;

//       totalInterest += loanInterest;
//     });

//     const totalOwed = totalDebt + totalInterest;

//     return res.status(200).json({
//       statusCode: "0",
//       message: "Debt clearance records fetched successfully.",
//       userId: debtClearance.userId,
//       debtId: debtClearance._id,
//       data: [
//         {
//           source: debtClearance.source,
//         },
//         {
//           TotalDebt: totalDebt,
//           TotalInterest: totalInterest,
//           TotalOwed: totalOwed,
//           totalPaid: totalPaid,
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("Error fetching debt clearance records:", error);
//     res.status(500).json({
//       statusCode: "1",
//       message: "Internal Server Error",
//     });
//   }
// };

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
