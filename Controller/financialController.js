const Financial = require("../Model/financialModel");
const User = require("../Model/emailModel");

exports.createFinancialData = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const {
      userId,
      income,
      expenses,
      debtAmount,
      monthlyEmi,
      insurance,
      emergencyFund,
      investments,
    } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const financialData = {
      userId,
      income: income || "0",
      expenses: expenses || "0",
      debtAmount: debtAmount || "0",
      monthlyEmi: monthlyEmi || "0",
      insurance: {
        Health: insurance?.Health || "0",
        Terms: insurance?.Terms || "0",
        Both: insurance?.Both || "0",
      },
      emergencyFund: emergencyFund || "0",
      investments: {
        Stocks: investments?.Stocks || "0",
        Gold: investments?.Gold || "0",
        Bonds: investments?.Bonds || "0",
        MutualFund: investments?.MutualFund || "0",
        RealEstate: investments?.RealEstate || "0",
        Others: investments?.Others || "0",
      },
    };

    const financialEntry = new Financial(financialData);
    await financialEntry.save();

    res.status(201).json({
      message: "Financial data saved successfully",
      data: financialEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// exports.getUserFinancial = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     // Fetch financial data from the database
//     const userFinancialData = await Financial.findOne({ userId });

//     if (!userFinancialData) {
//       return res
//         .status(404)
//         .json({ message: "Financial data not found for this user" });
//     }

//     const { income, expenses, monthlyEmi, emergencyFund, healthInsurance, lifeInsurance } = userFinancialData;

//     if (!income || !expenses || !monthlyEmi || !emergencyFund) {
//       return res.status(400).json({
//         message: "Income, expenses, EMI, or emergency fund data missing",
//       });
//     }

//     const monthlyIncome = parseFloat(income);
//     const monthlyExpenses = parseFloat(expenses);
//     const monthlyDebtPayments = parseFloat(monthlyEmi);
//     const totalEmergencyFund = parseFloat(emergencyFund);

//     if (
//       isNaN(monthlyIncome) ||
//       isNaN(monthlyExpenses) ||
//       isNaN(monthlyDebtPayments) ||
//       isNaN(totalEmergencyFund)
//     ) {
//       return res.status(400).json({
//         message: "Income, expenses, EMI, or emergency fund must be valid numbers",
//       });
//     }

//     // Calculate Savings Rate
//     const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

//     let savingsStatus = "";
//     let savingsPoints = 0;

//     if (savingsRate < 10) {
//       savingsStatus = "Poor";
//       savingsPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (savingsRate >= 10 && savingsRate < 20) {
//       savingsStatus = "Needs Improvement";
//       savingsPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (savingsRate >= 20 && savingsRate < 30) {
//       savingsStatus = "Good";
//       savingsPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (savingsRate >= 30) {
//       savingsStatus = "Excellent";
//       savingsPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Debt-to-Income Ratio (DTI)
//     const dti = (monthlyDebtPayments / monthlyIncome) * 100;

//     let dtiStatus = "";
//     let dtiPoints = 0;

//     if (dti >= 50) {
//       dtiStatus = "Poor";
//       dtiPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (dti >= 30 && dti < 50) {
//       dtiStatus = "Needs Improvement";
//       dtiPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (dti >= 10 && dti < 30) {
//       dtiStatus = "Good";
//       dtiPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (dti < 10) {
//       dtiStatus = "Excellent";
//       dtiPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Emergency Fund Adequacy
//     const emergencyMonths = totalEmergencyFund / monthlyExpenses;

//     let emergencyStatus = "";
//     let emergencyPoints = 0;

//     if (emergencyMonths < 1) {
//       emergencyStatus = "Poor";
//       emergencyPoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (emergencyMonths >= 1 && emergencyMonths < 3) {
//       emergencyStatus = "Needs Improvement";
//       emergencyPoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (emergencyMonths >= 3 && emergencyMonths < 6) {
//       emergencyStatus = "Good";
//       emergencyPoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (emergencyMonths >= 6) {
//       emergencyStatus = "Excellent";
//       emergencyPoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Calculate Insurance Coverage Adequacy
//     const totalHealthInsurance = parseFloat(healthInsurance || 0);
//     const totalLifeInsurance = parseFloat(lifeInsurance || 0);
//     const annualIncome = monthlyIncome * 12;

//     let insuranceStatus = "";
//     let insurancePoints = 0;

//     if (totalHealthInsurance === 0 && totalLifeInsurance === 0) {
//       insuranceStatus = "Poor";
//       insurancePoints = Math.floor(Math.random() * 26); // 0-25
//     } else if (
//       totalHealthInsurance < 5 * monthlyIncome ||
//       totalLifeInsurance < 10 * annualIncome
//     ) {
//       insuranceStatus = "Needs Improvement";
//       insurancePoints = Math.floor(Math.random() * 25) + 26; // 26-50
//     } else if (
//       totalHealthInsurance >= 5 * monthlyIncome &&
//       totalHealthInsurance <= 10 * monthlyIncome &&
//       totalLifeInsurance >= 10 * annualIncome &&
//       totalLifeInsurance <= 20 * annualIncome
//     ) {
//       insuranceStatus = "Good";
//       insurancePoints = Math.floor(Math.random() * 25) + 51; // 51-75
//     } else if (
//       totalHealthInsurance > 10 * monthlyIncome &&
//       totalLifeInsurance > 20 * annualIncome
//     ) {
//       insuranceStatus = "Excellent";
//       insurancePoints = Math.floor(Math.random() * 25) + 76; // 76-100
//     }

//     // Return the result
//     res.status(200).json({
//       message: "Data retrieved successfully",
//       data: {
//         userId,
//         savingsRate: savingsRate.toFixed(2),
//         savingsStatus,
//         savingsPoints,
//         dti: dti.toFixed(2),
//         dtiStatus,
//         dtiPoints,
//         emergencyMonths: emergencyMonths.toFixed(2),
//         emergencyStatus,
//         emergencyPoints,
//         insurance: {
//           healthInsurance: totalHealthInsurance,
//           lifeInsurance: totalLifeInsurance,
//           insuranceStatus,
//           insurancePoints,
//         },
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };
exports.getUserFinancial = async (req, res) => {
  //#swagger.tags = ['Financial-Health']
  try {
    const { userId } = req.query;

    // Fetch financial data from the database
    const userFinancialData = await Financial.findOne({ userId });

    if (!userFinancialData) {
      return res
        .status(404)
        .json({ message: "Financial data not found for this user" });
    }

    const { income, expenses, monthlyEmi, emergencyFund, healthInsurance, lifeInsurance } = userFinancialData;

    if (!income || !expenses || !monthlyEmi || !emergencyFund) {
      return res.status(400).json({
        message: "Income, expenses, EMI, or emergency fund data missing",
      });
    }

    const monthlyIncome = parseFloat(income);
    const monthlyExpenses = parseFloat(expenses);
    const monthlyDebtPayments = parseFloat(monthlyEmi);
    const totalEmergencyFund = parseFloat(emergencyFund);

    if (
      isNaN(monthlyIncome) ||
      isNaN(monthlyExpenses) ||
      isNaN(monthlyDebtPayments) ||
      isNaN(totalEmergencyFund)
    ) {
      return res.status(400).json({
        message: "Income, expenses, EMI, or emergency fund must be valid numbers",
      });
    }

    // Calculate Savings Rate
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;

    let savingsStatus = "";
    let savingsPoints = 0;

    if (savingsRate < 10) {
      savingsStatus = "Poor";
      savingsPoints = Math.floor(Math.random() * 26); // 0-25
    } else if (savingsRate >= 10 && savingsRate < 20) {
      savingsStatus = "Needs Improvement";
      savingsPoints = Math.floor(Math.random() * 25) + 26; // 26-50
    } else if (savingsRate >= 20 && savingsRate < 30) {
      savingsStatus = "Good";
      savingsPoints = Math.floor(Math.random() * 25) + 51; // 51-75
    } else if (savingsRate >= 30) {
      savingsStatus = "Excellent";
      savingsPoints = Math.floor(Math.random() * 25) + 76; // 76-100
    }

    // Calculate Debt-to-Income Ratio (DTI)
    const dti = (monthlyDebtPayments / monthlyIncome) * 100;

    let dtiStatus = "";
    let dtiPoints = 0;

    if (dti >= 50) {
      dtiStatus = "Poor";
      dtiPoints = Math.floor(Math.random() * 26); // 0-25
    } else if (dti >= 30 && dti < 50) {
      dtiStatus = "Needs Improvement";
      dtiPoints = Math.floor(Math.random() * 25) + 26; // 26-50
    } else if (dti >= 10 && dti < 30) {
      dtiStatus = "Good";
      dtiPoints = Math.floor(Math.random() * 25) + 51; // 51-75
    } else if (dti < 10) {
      dtiStatus = "Excellent";
      dtiPoints = Math.floor(Math.random() * 25) + 76; // 76-100
    }

    // Calculate Emergency Fund Adequacy
    const emergencyMonths = totalEmergencyFund / monthlyExpenses;

    let emergencyStatus = "";
    let emergencyPoints = 0;

    if (emergencyMonths < 1) {
      emergencyStatus = "Poor";
      emergencyPoints = Math.floor(Math.random() * 26); // 0-25
    } else if (emergencyMonths >= 1 && emergencyMonths < 3) {
      emergencyStatus = "Needs Improvement";
      emergencyPoints = Math.floor(Math.random() * 25) + 26; // 26-50
    } else if (emergencyMonths >= 3 && emergencyMonths < 6) {
      emergencyStatus = "Good";
      emergencyPoints = Math.floor(Math.random() * 25) + 51; // 51-75
    } else if (emergencyMonths >= 6) {
      emergencyStatus = "Excellent";
      emergencyPoints = Math.floor(Math.random() * 25) + 76; // 76-100
    }

    // Calculate Insurance Coverage
    const annualIncome = monthlyIncome * 12;
    const healthInsuranceCoverage = parseFloat(healthInsurance || 0);
    const lifeInsuranceCoverage = parseFloat(lifeInsurance || 0);

    let insuranceStatus = "";
    let insurancePoints = 0;

    const isAdequateHealthInsurance =
      healthInsuranceCoverage >= monthlyIncome * 5 && healthInsuranceCoverage <= monthlyIncome * 10;

    const isAdequateLifeInsurance =
      lifeInsuranceCoverage >= annualIncome * 10 && lifeInsuranceCoverage <= annualIncome * 20;

    if (!healthInsuranceCoverage && !lifeInsuranceCoverage) {
      insuranceStatus = "Poor";
      insurancePoints = Math.floor(Math.random() * 26); // 0-25
    } else if (!isAdequateHealthInsurance || !isAdequateLifeInsurance) {
      insuranceStatus = "Needs Improvement";
      insurancePoints = Math.floor(Math.random() * 25) + 26; // 26-50
    } else if (isAdequateHealthInsurance && isAdequateLifeInsurance) {
      insuranceStatus = "Good";
      insurancePoints = Math.floor(Math.random() * 25) + 51; // 51-75
    } else if (
      isAdequateHealthInsurance &&
      isAdequateLifeInsurance &&
      healthInsuranceCoverage > monthlyIncome * 10 &&
      lifeInsuranceCoverage > annualIncome * 20
    ) {
      insuranceStatus = "Excellent";
      insurancePoints = Math.floor(Math.random() * 25) + 76; // 76-100
    }

    // Response as an array
    const response = [
      {
        metric: "Savings Rate",
        value: savingsRate.toFixed(2),
        status: savingsStatus,
        points: savingsPoints,
      },
      {
        metric: "Debt-to-Income Ratio",
        value: dti.toFixed(2),
        status: dtiStatus,
        points: dtiPoints,
      },
      {
        metric: "Emergency Fund Adequacy",
        value: emergencyMonths.toFixed(2),
        status: emergencyStatus,
        points: emergencyPoints,
      },
      {
        metric: "Insurance Coverage",
        healthInsurance: healthInsuranceCoverage,
        lifeInsurance: lifeInsuranceCoverage,
        status: insuranceStatus,
        points: insurancePoints,
      },
    ];

    res.status(200).json({
      message: "Data retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


