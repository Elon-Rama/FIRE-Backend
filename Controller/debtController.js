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

//     const enrichedSource = Source.map((loan) => ({
//       ...loan,
//       date: currentDate,
//       time: currentTime,
//     }));

//     const existingDebt = await DebtClearance.findOne({ userId });

//     if (existingDebt) {
//       existingDebt.source.push(...enrichedSource);
//       const updatedDebt = await existingDebt.save();

//       return res.status(201).json({
//         statusCode: "0",
//         message: "Debt clearance updated successfully",
//         userId: updatedDebt.userId,
//         debtId: updatedDebt._id,
//         data: {
//           source: updatedDebt.source,
//         },
//       });
//     } else {
//       const newDebtClearance = new DebtClearance({
//         userId,
//         source: enrichedSource,
//       });

//       const savedDebt = await newDebtClearance.save();

//       return res.status(201).json({
//         statusCode: "0",
//         message: "Debt clearance created successfully",
//         userId: savedDebt.userId,
//         debtId: savedDebt._id,
//         data: {
//           source: savedDebt.source,
//         },
//       });
//     }
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
        message: "Invalid request data. Please provide a valid userId and source array.",
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
        (loan.principleAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

      const totalPayment = emi * totalMonths;
      const totalInterestPayment = totalPayment - loan.principleAmount;

      return {
        ...loan,
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterestPayment: Math.round(totalInterestPayment),
        date: currentDate,
        time: currentTime,
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
      return res.status(200).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({
        statusCode: "1",
        message: "User not found. Please provide a valid userId.",
      });
    }

    const debtClearance = await DebtClearance.findOne({ userId });

    if (!debtClearance) {
      return res.status(200).json({
        statusCode: "1",
        message: "No debt clearance records found for the user.",
      });
    }

    let totalDebt = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    // Enhance each loan with calculations
    const enrichedSource = debtClearance.source.map((loan) => {
      const principal = loan.principleAmount;
      const annualInterestRate = loan.interest / 100;
      const monthlyInterestRate = annualInterestRate / 12;
      const loanTenureMonths = loan.loanTerm * 12; // Convert years to months

      const emi = Math.round(
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1)
      );

      const totalPayment = emi * loanTenureMonths;
      const totalInterestPayment = totalPayment - principal;

      totalPaid += loan.currentPaid;
      totalDebt += principal;
      totalInterest += totalInterestPayment;

      return {
        ...loan._doc, // Include original loan properties
        emi,
        totalPayment,
        totalInterestPayment,
      };
    });

    const totalOwed = totalDebt + totalInterest;

    return res.status(200).json({
      statusCode: "0",
      message: "Debt clearance records fetched successfully.",
      userId: debtClearance.userId,
      debtId: debtClearance._id,
      data: [
        {
          source: enrichedSource,
          summary: {
            TotalDebt: totalDebt,
            TotalInterest: totalInterest,
            TotalPaid: totalPaid,
            TotalOwed: totalOwed,
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
